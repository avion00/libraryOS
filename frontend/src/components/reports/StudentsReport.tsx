import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, Clock3, DoorOpen, TrendingUp, UserRoundX, Users } from "lucide-react";
import { reportsApi, studentsApi, paymentsApi } from "../../api/endpoints";
import { ErrorState } from "../ui";
import { ReportsSkeleton } from "../skeletons/ReportsSkeleton";
import { StudentStatCard } from "../students/StudentStatCard";
import { ReportDonutCard, type DonutSegment } from "./charts/ReportDonutCard";
import { StudentsReportTable } from "./tables/StudentsReportTable";
import { ReportsPagination } from "./ReportsPagination";
import { InsightRow } from "./InsightRow";
import type { StudentsReportSummary, ExpiryReport } from "../students/types";

export function StudentsReport() {
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const summaryQuery = useQuery({
    queryKey: ["reports", "students-summary"],
    queryFn: () => reportsApi.students().then((r) => r.data as StudentsReportSummary),
  });

  const studentsQuery = useQuery({
    queryKey: ["students", "report-list"],
    queryFn: () => studentsApi.list({ page_size: 1000 }).then((r) => r.data.results),
  });

  const paymentsQuery = useQuery({
    queryKey: ["payments", "report-last"],
    queryFn: () => paymentsApi.list({ page_size: 1000 }).then((r) => r.data.results),
  });

  const expiringSoonQuery = useQuery({
    queryKey: ["reports", "expiry-7"],
    queryFn: () => reportsApi.expiry(7).then((r) => r.data as ExpiryReport),
  });

  const lastPaymentByStudent = useMemo(() => {
    const map = new Map<number, { date: string; amount: number }>();
    for (const p of paymentsQuery.data ?? []) {
      const existing = map.get(p.student);
      if (!existing || p.payment_date > existing.date) map.set(p.student, { date: p.payment_date, amount: Number(p.amount) });
    }
    return map;
  }, [paymentsQuery.data]);

  const students = studentsQuery.data ?? [];
  const pageRows = useMemo(() => students.slice((page - 1) * pageSize, page * pageSize), [students, page]);

  if (summaryQuery.isLoading || studentsQuery.isLoading)
    return <ReportsSkeleton statCount={5} gridClassName="grid-cols-2 gap-3 lg:grid-cols-5" main="table" />;
  if (summaryQuery.error || !summaryQuery.data || studentsQuery.error)
    return <ErrorState message="Unable to load the student report." onRetry={() => { summaryQuery.refetch(); studentsQuery.refetch(); }} />;

  const s = summaryQuery.data;
  const segments: DonutSegment[] = [
    { key: "active", label: "Active", value: s.active, color: "#10b981", displayValue: String(s.active) },
    { key: "expired", label: "Expired", value: s.expired, color: "#ef4444", displayValue: String(s.expired) },
    { key: "vacated", label: "Vacated", value: s.vacated, color: "#8C969F", displayValue: String(s.vacated) },
    { key: "never_booked", label: "Never Booked", value: s.never_booked, color: "#B0B7BD", displayValue: String(s.never_booked) },
  ];
  const activeRate = s.total_students > 0 ? Math.round((s.active / s.total_students) * 1000) / 10 : 0;

  return (
    <div className="flex animate-fadeIn flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StudentStatCard icon={Users} iconBg="bg-slate-100" iconColor="text-slate-600" title="Total Students" value={String(s.total_students)} footer="All students" />
        <StudentStatCard icon={TrendingUp} iconBg="bg-emerald-100" iconColor="text-emerald-600" title="Active" value={String(s.active)} footer="Currently active" />
        <StudentStatCard icon={Clock3} iconBg="bg-red-100" iconColor="text-red-600" title="Expired" value={String(s.expired)} footer="Needs renewal" />
        <StudentStatCard icon={DoorOpen} iconBg="bg-slate-100" iconColor="text-slate-600" title="Vacated" value={String(s.vacated)} footer="Seat freed" />
        <StudentStatCard icon={UserRoundX} iconBg="bg-paper-500" iconColor="text-slate-500" title="Never Booked" value={String(s.never_booked)} footer="No membership yet" />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-paper-700 bg-white shadow-card">
          <h3 className="px-4 pt-3.5 text-[14px] font-semibold text-slate-900">Student Status Overview</h3>
          <div className="mt-1">
            <StudentsReportTable students={pageRows} lastPaymentByStudent={lastPaymentByStudent} />
          </div>
          {students.length > 0 && (
            <ReportsPagination page={page} pageSize={pageSize} totalItems={students.length} itemLabel="students" onPageChange={setPage} pageSizeOptions={[6, 10, 25]} />
          )}
        </div>

        <div className="flex w-full flex-col gap-4 lg:w-[300px] lg:shrink-0">
          <ReportDonutCard title="Student Status Breakdown" centerValue={String(s.total_students)} centerLabel="Total Students" segments={segments} />

          <div className="rounded-2xl border border-paper-700 bg-white p-4 shadow-card">
            <h3 className="text-[13.5px] font-semibold text-slate-900">Insights</h3>
            <div className="mt-3 space-y-3">
              <InsightRow icon={TrendingUp} iconBg="bg-emerald-100" iconColor="text-emerald-600" title="Active rate" subtitle="Percentage of currently active students" value={`${activeRate}%`} />
              <InsightRow
                icon={Clock3}
                iconBg="bg-orange-100"
                iconColor="text-orange-600"
                title="Expiring soon"
                subtitle="Memberships expiring within 7 days"
                value={String(expiringSoonQuery.data?.count ?? "—")}
              />
            </div>
            <Link to="/students" className="mt-3.5 flex items-center gap-1 border-t border-paper-500 pt-3.5 text-[12.5px] font-semibold text-brand-600 hover:text-brand-700">
              View full student report
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
