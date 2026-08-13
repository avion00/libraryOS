import { Armchair, CircleCheck, Clock3, Users } from "lucide-react";
import { StudentStatCard } from "../students/StudentStatCard";

export function SeatMapStats({
  total,
  available,
  partial,
  full,
}: {
  total: number;
  available: number;
  partial: number;
  full: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StudentStatCard icon={Armchair} iconBg="bg-slate-100" iconColor="text-slate-600" title="Total Seats" value={String(total)} footer="All configured seats" />
      <StudentStatCard icon={CircleCheck} iconBg="bg-emerald-100" iconColor="text-emerald-600" title="Available" value={String(available)} footer="Seats ready to use" />
      <StudentStatCard icon={Clock3} iconBg="bg-orange-100" iconColor="text-orange-600" title="Partially Occupied" value={String(partial)} footer="Seats in partial use" />
      <StudentStatCard icon={Users} iconBg="bg-rose-100" iconColor="text-rose-600" title="Fully Occupied" value={String(full)} footer="Seats at full capacity" />
    </div>
  );
}
