import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { paymentsApi, reportsApi } from "../api/endpoints";
import { api, extractErrorMessage } from "../api/client";
import { useDebounce } from "../lib/useDebounce";
import { useToast } from "../context/ToastContext";
import { ErrorState, PageLoading } from "../components/ui";
import type { Payment, PaymentMethod } from "../api/types";
import type { PendingFeesReport } from "../components/students/types";

import { PaymentsHeader } from "../components/payments/PaymentsHeader";
import { PaymentsSummary } from "../components/payments/PaymentsSummary";
import { PaymentFilters } from "../components/payments/PaymentFilters";
import { PaymentsTable } from "../components/payments/PaymentsTable";
import { PaymentsPagination } from "../components/payments/PaymentsPagination";
import { PaymentsInsights } from "../components/payments/PaymentsInsights";
import { ReceiptDialog } from "../components/payments/ReceiptDialog";
import { isSameMonth } from "../components/payments/types";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function PaymentsPage() {
  const { notify } = useToast();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [status, setStatus] = useState("");
  const [method, setMethod] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, method, fromDate, toDate, pageSize]);

  const allPaymentsQuery = useQuery({
    queryKey: ["payments", "all"],
    queryFn: () => paymentsApi.list({ page_size: 1000 }).then((r) => r.data),
  });

  const tableQuery = useQuery({
    queryKey: ["payments", "table", debouncedSearch, status, method, fromDate, toDate, page, pageSize],
    queryFn: () =>
      paymentsApi
        .list({
          search: debouncedSearch || undefined,
          status: status || undefined,
          method: method || undefined,
          date_from: fromDate || undefined,
          date_to: toDate || undefined,
          page,
          page_size: pageSize,
        })
        .then((r) => r.data),
  });

  const pendingFeesQuery = useQuery({
    queryKey: ["reports", "pending-fees"],
    queryFn: () => reportsApi.pendingFees().then((r) => r.data as PendingFeesReport),
  });

  const allPayments = useMemo(() => allPaymentsQuery.data?.results ?? [], [allPaymentsQuery.data]);

  const summary = useMemo(() => {
    const now = new Date();
    const lastMonthRef = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = allPayments.filter((p) => isSameMonth(p.payment_date, now));
    const lastMonth = allPayments.filter((p) => isSameMonth(p.payment_date, lastMonthRef));

    const sum = (list: Payment[]) => list.reduce((s, p) => s + Number(p.amount), 0);

    const totalThisMonth = sum(thisMonth);
    const totalLastMonth = sum(lastMonth);
    const trendPct = totalLastMonth > 0 ? ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100 : totalThisMonth > 0 ? 100 : 0;

    const paidThisMonth = sum(thisMonth.filter((p) => p.status === "paid"));
    const pendingOnly = sum(thisMonth.filter((p) => p.status === "pending"));
    const partialOnly = sum(thisMonth.filter((p) => p.status === "partial"));
    const pendingThisMonth = pendingOnly + partialOnly;

    const methodTotals = new Map<PaymentMethod, number>();
    for (const p of thisMonth) methodTotals.set(p.method, (methodTotals.get(p.method) ?? 0) + Number(p.amount));
    const methodBreakdown = Array.from(methodTotals.entries())
      .map(([m, total]) => ({ method: m, total }))
      .sort((a, b) => b.total - a.total);

    const trendData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      const amount = allPayments
        .filter((p) => p.payment_date === key && (p.status === "paid" || p.status === "partial"))
        .reduce((s, p) => s + Number(p.amount), 0);
      return { label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }), amount };
    });

    return {
      totalThisMonth,
      trendPct,
      paidThisMonth,
      pendingThisMonth,
      paidPct: totalThisMonth > 0 ? (paidThisMonth / totalThisMonth) * 100 : 0,
      pendingPct: totalThisMonth > 0 ? (pendingThisMonth / totalThisMonth) * 100 : 0,
      countThisMonth: thisMonth.length,
      donutPaid: paidThisMonth,
      donutPending: pendingOnly,
      donutPartial: partialOnly,
      methodBreakdown,
      trendData,
    };
  }, [allPayments]);

  function clearFilters() {
    setSearch("");
    setStatus("");
    setMethod("");
    setFromDate("");
    setToDate("");
  }

  async function handleExportCsv() {
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

  const loading = allPaymentsQuery.isLoading || tableQuery.isLoading;
  const failed = allPaymentsQuery.error || tableQuery.error;

  return (
    <div className="flex flex-col gap-4">
      <PaymentsHeader onExport={handleExportCsv} exporting={exporting} />

      {loading ? (
        <PageLoading />
      ) : failed ? (
        <ErrorState message="Unable to load payments." onRetry={() => { allPaymentsQuery.refetch(); tableQuery.refetch(); }} />
      ) : (
        <>
          <PaymentsSummary
            totalThisMonth={summary.totalThisMonth}
            trendPct={summary.trendPct}
            paidThisMonth={summary.paidThisMonth}
            paidPct={summary.paidPct}
            pendingThisMonth={summary.pendingThisMonth}
            pendingPct={summary.pendingPct}
            countThisMonth={summary.countThisMonth}
          />

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
            <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-paper-700 bg-white shadow-card">
              <PaymentFilters
                search={search}
                onSearchChange={setSearch}
                status={status}
                onStatusChange={setStatus}
                method={method}
                onMethodChange={setMethod}
                fromDate={fromDate}
                onFromDateChange={setFromDate}
                toDate={toDate}
                onToDateChange={setToDate}
              />

              <PaymentsTable payments={tableQuery.data?.results ?? []} onOpenReceipt={setSelectedPayment} onClearFilters={clearFilters} />

              {tableQuery.data && tableQuery.data.count > 0 && (
                <PaymentsPagination
                  page={page}
                  pageSize={pageSize}
                  totalItems={tableQuery.data.count}
                  onPageChange={setPage}
                  onPageSizeChange={setPageSize}
                />
              )}
            </div>

            <PaymentsInsights
              paid={summary.donutPaid}
              pending={summary.donutPending}
              partial={summary.donutPartial}
              methodBreakdown={summary.methodBreakdown}
              pendingFeeRows={pendingFeesQuery.data?.rows ?? []}
              trendData={summary.trendData}
            />
          </div>
        </>
      )}

      <ReceiptDialog open={!!selectedPayment} onClose={() => setSelectedPayment(null)} payment={selectedPayment} />
    </div>
  );
}
