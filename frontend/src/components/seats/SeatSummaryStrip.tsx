import { Armchair, CalendarDays, MapPin, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

function StripCard({ icon: Icon, label, value, valueColor = "text-slate-800" }: { icon: LucideIcon; label: string; value: string; valueColor?: string }) {
  return (
    <div className="rounded-xl border border-paper-700 p-3">
      <div className="flex items-center gap-1.5 text-slate-400">
        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
        <span className="text-[11.5px] font-medium">{label}</span>
      </div>
      <p className={`mt-1.5 text-[14px] font-semibold ${valueColor}`}>{value}</p>
    </div>
  );
}

export function SeatSummaryStrip({
  occupied,
  total,
  todayLabel,
  todayColor,
  zone,
  seatType,
}: {
  occupied: number;
  total: number;
  todayLabel: string;
  todayColor: string;
  zone: string;
  seatType: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      <StripCard icon={Users} label="Occupancy" value={`${occupied}/${total}`} />
      <StripCard icon={CalendarDays} label="Today" value={todayLabel} valueColor={todayColor} />
      <StripCard icon={MapPin} label="Zone" value={zone} />
      <StripCard icon={Armchair} label="Seat type" value={seatType} />
    </div>
  );
}
