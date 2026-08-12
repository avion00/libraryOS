import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, IndianRupee, Info, MoreVertical, TrendingUp, Users } from "lucide-react";
import { reportsApi } from "../../api/endpoints";
import { ErrorState, PageLoading } from "../ui";
import { StudentStatCard } from "../students/StudentStatCard";
import { ReportDonutCard, type DonutSegment } from "./charts/ReportDonutCard";
import { PendingFeesTable } from "./tables/PendingFeesTable";
import { ReminderQueueCard } from "./ReminderQueueCard";
import { formatMoney } from "../../lib/format";
import { downloadCsv } from "./types";
import type { PendingFeesReport as PendingFeesReportData } from "../students/types";

function bucketLabel(amount: number): string {
  if (amount <= 500) return "₹0 – ₹500";
  if (amount <= 1000) return "₹500 – ₹1,000";
  return "₹1,000+";
}

function useClickOutside(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOutside]);
  return ref;
}

export function PendingFeesReport() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useClickOutside(() => setMenuOpen(false));

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["reports", "pending-fees"],
    queryFn: () => reportsApi.pendingFees().then((r) => r.data as PendingFeesReportData),
  });

  const buckets = useMemo(() => {
    if (!data) return [];
    const map = new Map<string, number>();
    for (const r of data.rows) map.set(bucketLabel(r.balance_due), (map.get(bucketLabel(r.balance_due)) ?? 0) + r.balance_due);
    const order = ["₹1,000+", "₹500 – ₹1,000", "₹0 – ₹500"];
    const colors: Record<string, string> = { "₹1,000+": "#ef4444", "₹500 – ₹1,000": "#f97316", "₹0 – ₹500": "#10b981" };
    return order.map((label) => ({ label, total: map.get(label) ?? 0, color: colors[label] }));
  }, [data]);

  function handleExport() {
    if (!data) return;
    downloadCsv(
      data.rows.map((r) => [r.student_name, r.student_code, `Seat ${r.seat_number}`, r.monthly_fee, r.amount_collected, r.balance_due, r.expiry_date]),
      ["student_name", "student_code", "seat", "monthly_fee", "amount_collected", "balance_due", "expiry_date"],
      "pending-fees.csv"
    );
    setMenuOpen(false);
  }

  if (isLoading) return <PageLoading />;
  if (error || !data) return <ErrorState message="Unable to load the pending fees report." onRetry={() => refetch()} />;

  const avgDue = data.count > 0 ? data.total_due / data.count : 0;
  const segments: DonutSegment[] = buckets.map((b) => ({ key: b.label, label: b.label, value: b.total, color: b.color, displayValue: formatMoney(b.total) }));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StudentStatCard icon={Users} iconBg="bg-paper-700" iconColor="text-ink-700" title="Students With Dues" value={String(data.count)} footer="students" />
        <StudentStatCard icon={IndianRupee} iconBg="bg-emerald-100" iconColor="text-emerald-600" title="Total Pending" value={formatMoney(data.total_due)} footer="total amount" />
        <StudentStatCard icon={TrendingUp} iconBg="bg-paper-700" iconColor="text-ink-700" title="Average Due" value={formatMoney(avgDue)} footer="per student" />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-paper-700 bg-white shadow-card">
          <h3 className="px-4 pt-3.5 text-[14px] font-semibold text-slate-900">Pending Fees</h3>
          <div className="mt-1">
            <PendingFeesTable rows={data.rows} />
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 lg:w-[300px] lg:shrink-0">
          <ReportDonutCard
            title="Pending Fee Breakdown"
            headerAction={
              <div className="relative" ref={menuRef}>
                <button onClick={() => setMenuOpen((v) => !v)} className="rounded-lg p-1 text-slate-400 hover:bg-paper-500 hover:text-slate-600" aria-label="More options">
                  <MoreVertical className="h-4 w-4" strokeWidth={2} />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-8 z-20 w-44 rounded-lg border border-paper-700 bg-white p-1 shadow-card-hover">
                    <button onClick={handleExport} className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[12.5px] text-slate-600 hover:bg-paper-300">
                      <Download className="h-3.5 w-3.5" strokeWidth={2} />
                      Export CSV
                    </button>
                  </div>
                )}
              </div>
            }
            centerValue={formatMoney(data.total_due)}
            centerLabel="Total"
            segments={segments}
            footer={
              data.count > 0 && (
                <div className="mt-3.5 flex items-start gap-2 rounded-lg bg-info-50 p-2.5 text-[11.5px] leading-snug text-info-700">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-info-600" strokeWidth={2} />
                  {data.count} student{data.count === 1 ? "" : "s"} have pending fees
                </div>
              )
            }
          />

          <ReminderQueueCard rows={data.rows} />
        </div>
      </div>
    </div>
  );
}
