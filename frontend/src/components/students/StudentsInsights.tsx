import { MembershipOverview } from "./MembershipOverview";
import { ExpiringStudents } from "./ExpiringStudents";
import { PendingFeesCard } from "./PendingFeesCard";
import type { ExpiryRow, StudentsReportSummary } from "./types";

export function StudentsInsights({
  report,
  expiringRows,
  pendingTotal,
  pendingCount,
}: {
  report: StudentsReportSummary;
  expiringRows: ExpiryRow[];
  pendingTotal: number;
  pendingCount: number;
}) {
  return (
    <div className="flex w-full flex-col gap-4 lg:w-[280px] lg:shrink-0">
      <h2 className="text-[13px] font-semibold uppercase tracking-wide text-slate-400">Insights</h2>
      <MembershipOverview active={report.active} vacated={report.vacated} expired={report.expired} noMembership={report.never_booked} />
      <ExpiringStudents rows={expiringRows} />
      <PendingFeesCard totalDue={pendingTotal} studentsCount={pendingCount} />
    </div>
  );
}
