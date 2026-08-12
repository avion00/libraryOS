import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IndianRupee, ChartNoAxesCombined, ReceiptText } from "lucide-react";
import { paymentsApi, membershipsApi } from "../../api/endpoints";
import { api, extractErrorMessage } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { ErrorState, PageLoading } from "../ui";
import { StudentStatCard } from "../students/StudentStatCard";
import { METHOD_LABEL } from "../payments/types";
import type { Payment, PaymentMethod } from "../../api/types";
import { CollectionsFilterBar } from "./CollectionsFilterBar";
import { CollectionsChart } from "./charts/CollectionsChart";
import { ReportDonutCard, type DonutSegment } from "./charts/ReportDonutCard";
import { CollectionsInsights } from "./CollectionsInsights";
import { CollectionsTable } from "./tables/CollectionsTable";
import { ReceiptDialog } from "../payments/ReceiptDialog";
import { computePreviousRange, computeTimeframeRange, downloadBlob } from "./types";
import { formatMoney } from "../../lib/format";

function trendLabel(current: number, previous: number): { pct: number; up: boolean } {
  if (previous > 0) return { pct: ((current - previous) / previous) * 100, up: current >= previous };
  return { pct: current > 0 ? 100 : 0, up: current >= previous };
}

const DONUT_COLORS: Record<PaymentMethod, string> = { cash: "#10b981", online: "#F2AA4C", bank_transfer: "#3C4854", other: "#f59e0b" };

export function CollectionsReport() {
  const { notify } = useToast();
  const [timeframe, setTimeframe] = useState("month");
  const [method, setMethod] = useState("");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [exporting, setExporting] = useState(false);
  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);

  const range = useMemo(() => computeTimeframeRange(timeframe, customFrom, customTo), [timeframe, customFrom, customTo]);
  const prevRange = useMemo(() => computePreviousRange(range.from, range.to), [range]);

  const currentQuery = useQuery({
    queryKey: ["reports", "collections-current", range.from, range.to, method],
    queryFn: () =>
      paymentsApi.list({ date_from: range.from, date_to: range.to, method: method || undefined, page_size: 1000 }).then((r) => r.data.results),
  });

  const previousQuery = useQuery({
    queryKey: ["reports", "collections-previous", prevRange.from, prevRange.to, method],
    queryFn: () =>
      paymentsApi.list({ date_from: prevRange.from, date_to: prevRange.to, method: method || undefined, page_size: 1000 }).then((r) => r.data.results),
  });

  const membershipsQuery = useQuery({
    queryKey: ["memberships", "seat-lookup"],
    queryFn: () => membershipsApi.list({ page_size: 1000 }).then((r) => r.data.results),
  });

  const seatByMembership = useMemo(() => {
    const map = new Map<number, number>();
    for (const m of membershipsQuery.data ?? []) map.set(m.id, m.seat_number);
    return map;
  }, [membershipsQuery.data]);

  const collected = useMemo(() => (currentQuery.data ?? []).filter((p) => p.status === "paid" || p.status === "partial"), [currentQuery.data]);
  const collectedPrev = useMemo(() => (previousQuery.data ?? []).filter((p) => p.status === "paid" || p.status === "partial"), [previousQuery.data]);

  const totalCollected = collected.reduce((s, p) => s + Number(p.amount), 0);
  const totalCollectedPrev = collectedPrev.reduce((s, p) => s + Number(p.amount), 0);
  const paymentCount = collected.length;
  const paymentCountPrev = collectedPrev.length;
  const avgPayment = paymentCount > 0 ? totalCollected / paymentCount : 0;
  const avgPaymentPrev = paymentCountPrev > 0 ? totalCollectedPrev / paymentCountPrev : 0;

  const totalTrend = trendLabel(totalCollected, totalCollectedPrev);
  const countTrend = trendLabel(paymentCount, paymentCountPrev);
  const avgTrend = trendLabel(avgPayment, avgPaymentPrev);

  const dailyData = useMemo(() => {
    const byDate = new Map<string, { amount: number; count: number }>();
    for (const p of collected) {
      const entry = byDate.get(p.payment_date) ?? { amount: 0, count: 0 };
      entry.amount += Number(p.amount);
      entry.count += 1;
      byDate.set(p.payment_date, entry);
    }
    return Array.from(byDate.entries())
      .map(([date, v]) => ({ date, ...v }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [collected]);

  const byMethod = useMemo(() => {
    const map = new Map<PaymentMethod, number>();
    for (const p of collected) map.set(p.method, (map.get(p.method) ?? 0) + Number(p.amount));
    return Array.from(map.entries())
      .map(([m, total]) => ({ method: m, total }))
      .sort((a, b) => b.total - a.total);
  }, [collected]);

  const donutSegments: DonutSegment[] = byMethod.map((m) => ({
    key: m.method,
    label: METHOD_LABEL[m.method],
    value: m.total,
    color: DONUT_COLORS[m.method],
    displayValue: formatMoney(m.total),
  }));

  const bestDay = dailyData.length > 0 ? dailyData.reduce((best, d) => (d.amount > best.amount ? d : best)) : null;
  const busiestDay = dailyData.length > 0 ? dailyData.reduce((best, d) => (d.count > best.count ? d : best)) : null;

  const recent = useMemo(() => [...collected].sort((a, b) => b.payment_date.localeCompare(a.payment_date)).slice(0, 8), [collected]);

  async function handleExport() {
    setExporting(true);
    try {
      const resp = await api.get("/reports/export/payments", { responseType: "blob" });
      downloadBlob(resp.data as Blob, "payments.csv");
    } catch (err) {
      notify(extractErrorMessage(err), "error");
    } finally {
      setExporting(false);
    }
  }

  const loading = currentQuery.isLoading || previousQuery.isLoading;
  const failed = currentQuery.error || previousQuery.error;

  return (
    <div className="flex flex-col gap-4">
      <CollectionsFilterBar
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        method={method}
        onMethodChange={setMethod}
        customFrom={customFrom}
        onCustomFromChange={setCustomFrom}
        customTo={customTo}
        onCustomToChange={setCustomTo}
        onExport={handleExport}
        exporting={exporting}
      />

      {loading ? (
        <PageLoading />
      ) : failed ? (
        <ErrorState message="Unable to load the collections report." onRetry={() => { currentQuery.refetch(); previousQuery.refetch(); }} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StudentStatCard
              icon={IndianRupee}
              iconBg="bg-orange-100"
              iconColor="text-orange-700"
              title="Total Collected"
              value={formatMoney(totalCollected)}
              footer={`${totalTrend.up ? "▲" : "▼"} ${Math.abs(totalTrend.pct).toFixed(1)}% vs last period`}
            />
            <StudentStatCard
              icon={ReceiptText}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
              title="Payments"
              value={String(paymentCount)}
              footer={`${countTrend.up ? "▲" : "▼"} ${Math.abs(countTrend.pct).toFixed(1)}% vs last period`}
            />
            <StudentStatCard
              icon={ChartNoAxesCombined}
              iconBg="bg-paper-700"
              iconColor="text-ink-700"
              title="Average Payment"
              value={formatMoney(avgPayment)}
              footer={`${avgTrend.up ? "▲" : "▼"} ${Math.abs(avgTrend.pct).toFixed(1)}% vs last period`}
            />
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
            <div className="min-w-0 flex-1">
              <CollectionsChart data={dailyData} />
            </div>
            <div className="flex w-full flex-col gap-4 lg:w-[300px] lg:shrink-0">
              <ReportDonutCard title="Collection by method" centerValue={formatMoney(totalCollected)} centerLabel="Total" segments={donutSegments} />
              <CollectionsInsights bestDay={bestDay} busiestDay={busiestDay} />
            </div>
          </div>

          <CollectionsTable payments={recent} seatByMembership={seatByMembership} onOpenReceipt={setReceiptPayment} />
        </>
      )}

      <ReceiptDialog open={!!receiptPayment} onClose={() => setReceiptPayment(null)} payment={receiptPayment} />
    </div>
  );
}
