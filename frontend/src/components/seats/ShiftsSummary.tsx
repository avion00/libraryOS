import { Armchair, CalendarDays, ChartNoAxesCombined, Clock3 } from "lucide-react";
import { StudentStatCard } from "../students/StudentStatCard";

export function ShiftsSummary({
  activeShifts,
  coveredHoursLabel,
  avgSeatsPerShift,
  overallUtilization,
}: {
  activeShifts: number;
  coveredHoursLabel: string;
  avgSeatsPerShift: number;
  overallUtilization: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StudentStatCard icon={CalendarDays} iconBg="bg-slate-100" iconColor="text-slate-600" title="Active Shifts" value={String(activeShifts)} footer="Currently configured" />
      <StudentStatCard icon={Clock3} iconBg="bg-emerald-100" iconColor="text-emerald-600" title="Covered Hours" value={coveredHoursLabel} footer="All day coverage" />
      <StudentStatCard icon={Armchair} iconBg="bg-orange-100" iconColor="text-orange-600" title="Avg Seats per Shift" value={String(avgSeatsPerShift)} footer="Across all shifts" />
      <StudentStatCard
        icon={ChartNoAxesCombined}
        iconBg="bg-slate-100"
        iconColor="text-slate-600"
        title="Shift Utilization"
        value={`${Math.round(overallUtilization)}%`}
        footer="Overall utilization"
      />
    </div>
  );
}
