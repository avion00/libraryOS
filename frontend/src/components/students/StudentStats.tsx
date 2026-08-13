import { Link } from "react-router-dom";
import { ArrowUp, CircleCheck, Clock3, Users, WalletCards } from "lucide-react";
import { StudentStatCard } from "./StudentStatCard";
import { formatMoney } from "../../lib/format";

function DeltaBadge({ value }: { value: number }) {
  if (value <= 0) return null;
  return (
    <span className="inline-flex items-center gap-0.5 text-[11.5px] font-semibold text-emerald-600">
      <ArrowUp className="h-3 w-3" strokeWidth={2.5} />
      {value} this month
    </span>
  );
}

function ViewAllLink({ to }: { to: string }) {
  return (
    <Link to={to} className="text-[11.5px] font-semibold text-brand-600 hover:text-brand-700">
      View all
    </Link>
  );
}

export function StudentStats({
  totalStudents,
  newStudentsThisMonth,
  activeMemberships,
  newActiveThisMonth,
  expiringSoonCount,
  pendingFeesTotal,
  pendingFeesStudents,
}: {
  totalStudents: number;
  newStudentsThisMonth: number;
  activeMemberships: number;
  newActiveThisMonth: number;
  expiringSoonCount: number;
  pendingFeesTotal: number;
  pendingFeesStudents: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StudentStatCard
        icon={Users}
        iconBg="bg-slate-100"
        iconColor="text-slate-600"
        title="Total Students"
        value={String(totalStudents)}
        footer="Across all locations"
        rightSlot={<DeltaBadge value={newStudentsThisMonth} />}
      />
      <StudentStatCard
        icon={CircleCheck}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
        title="Active Memberships"
        value={String(activeMemberships)}
        footer="Currently active"
        rightSlot={<DeltaBadge value={newActiveThisMonth} />}
      />
      <StudentStatCard
        icon={Clock3}
        iconBg="bg-orange-100"
        iconColor="text-orange-600"
        title="Expiring Soon"
        value={String(expiringSoonCount)}
        footer="In next 30 days"
        rightSlot={<ViewAllLink to="/reports" />}
      />
      <StudentStatCard
        icon={WalletCards}
        iconBg="bg-slate-100"
        iconColor="text-slate-600"
        title="Pending Fees"
        value={formatMoney(pendingFeesTotal)}
        footer={`From ${pendingFeesStudents} students`}
        rightSlot={<ViewAllLink to="/reports" />}
      />
    </div>
  );
}
