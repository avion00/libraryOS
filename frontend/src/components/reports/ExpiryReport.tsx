import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock3 } from "lucide-react";
import { reportsApi } from "../../api/endpoints";
import { ErrorState, PageLoading } from "../ui";
import { StudentStatCard } from "../students/StudentStatCard";
import { ExpiryFilterBar } from "./ExpiryFilterBar";
import { ExpiryTable } from "./tables/ExpiryTable";
import { ReportsPagination } from "./ReportsPagination";
import { ExpiryTimelineCard, formatExpiryRangeLabel } from "./ExpiryTimelineCard";
import { NextActionsCard } from "./NextActionsCard";
import { daysUntil } from "../../lib/format";
import { downloadCsv } from "./types";
import type { ExpiryReport as ExpiryReportData, StudentsReportSummary } from "../students/types";

export function ExpiryReport() {
  const [days, setDays] = useState(7);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const expiryQuery = useQuery({
    queryKey: ["reports", "expiry", days],
    queryFn: () => reportsApi.expiry(days).then((r) => r.data as ExpiryReportData),
  });

  const expiry7Query = useQuery({
    queryKey: ["reports", "expiry-7"],
    queryFn: () => reportsApi.expiry(7).then((r) => r.data as ExpiryReportData),
  });

  const expiry30Query = useQuery({
    queryKey: ["reports", "expiry-30"],
    queryFn: () => reportsApi.expiry(30).then((r) => r.data as ExpiryReportData),
  });

  const studentsSummaryQuery = useQuery({
    queryKey: ["reports", "students-summary"],
    queryFn: () => reportsApi.students().then((r) => r.data as StudentsReportSummary),
  });

  const pageRows = useMemo(() => {
    const rows = expiryQuery.data?.rows ?? [];
    return rows.slice((page - 1) * pageSize, page * pageSize);
  }, [expiryQuery.data, page]);

  const avgDaysRemaining = useMemo(() => {
    const rows = expiryQuery.data?.rows ?? [];
    if (rows.length === 0) return 0;
    return Math.round(rows.reduce((s, r) => s + Math.max(daysUntil(r.expiry_date), 0), 0) / rows.length);
  }, [expiryQuery.data]);

  const timelineEntries = useMemo(() => {
    const within7 = expiry7Query.data?.count ?? 0;
    const within30 = expiry30Query.data?.count ?? 0;
    const beyond30 = Math.max((studentsSummaryQuery.data?.active ?? 0) - within30, 0);
    return [
      { label: "Expiring in 7 days", range: formatExpiryRangeLabel(0, 7), count: within7, color: "#10b981" },
      { label: "Expiring in 30 days", range: formatExpiryRangeLabel(8, 30), count: Math.max(within30 - within7, 0), color: "#f97316" },
      { label: "Expiring beyond 30 days", range: formatExpiryRangeLabel(31, null), count: beyond30, color: "#ef4444" },
    ];
  }, [expiry7Query.data, expiry30Query.data, studentsSummaryQuery.data]);

  function handleExport() {
    const rows = expiryQuery.data?.rows ?? [];
    downloadCsv(
      rows.map((r) => [r.student_name, r.student_code, r.phone, `Seat ${r.seat_number}`, r.expiry_date, r.is_overdue ? "overdue" : "pending"]),
      ["student_name", "student_code", "phone", "seat", "expiry_date", "status"],
      "expiry-list.csv"
    );
  }

  if (expiryQuery.isLoading) return <PageLoading />;
  if (expiryQuery.error || !expiryQuery.data) return <ErrorState message="Unable to load the expiry report." onRetry={() => expiryQuery.refetch()} />;

  return (
    <div className="flex flex-col gap-4">
      <ExpiryFilterBar
        days={days}
        onDaysChange={(d) => {
          setDays(d);
          setPage(1);
        }}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StudentStatCard icon={CalendarDays} iconBg="bg-emerald-100" iconColor="text-emerald-600" title="Expiring in 7 Days" value={String(expiry7Query.data?.count ?? "—")} footer="memberships" />
        <StudentStatCard icon={CalendarDays} iconBg="bg-orange-100" iconColor="text-orange-600" title="Expiring in 30 Days" value={String(expiry30Query.data?.count ?? "—")} footer="memberships" />
        <StudentStatCard icon={Clock3} iconBg="bg-paper-700" iconColor="text-ink-700" title="Average Days Remaining" value={String(avgDaysRemaining)} footer="days" />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-paper-700 bg-white shadow-card">
          <ExpiryTable rows={pageRows} />
          {expiryQuery.data.rows.length > 0 && (
            <ReportsPagination page={page} pageSize={pageSize} totalItems={expiryQuery.data.rows.length} itemLabel="results" onPageChange={setPage} />
          )}
        </div>

        <div className="flex w-full flex-col gap-4 lg:w-[300px] lg:shrink-0">
          <ExpiryTimelineCard entries={timelineEntries} />
          <NextActionsCard expiringSoonCount={expiry7Query.data?.count ?? 0} onExport={handleExport} />
        </div>
      </div>
    </div>
  );
}
