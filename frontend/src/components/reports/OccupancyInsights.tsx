import { Star, TrendingUp } from "lucide-react";

interface SeatRow {
  seat_number: number;
  occupied_shifts: number;
  total_shifts: number;
}

export function OccupancyInsights({ rows, occupancyPct, totalSeatShifts }: { rows: SeatRow[]; occupancyPct: number; totalSeatShifts: number }) {
  const top = [...rows].sort((a, b) => b.occupied_shifts - a.occupied_shifts).slice(0, 3);

  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-4 shadow-card">
      <h3 className="text-[13.5px] font-semibold text-slate-900">Occupancy Insights</h3>

      <div className="mt-3">
        <p className="mb-2 flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-700">
          <Star className="h-3.5 w-3.5 text-amber-500" strokeWidth={2} />
          Highest usage seats
        </p>
        <div className="space-y-1.5">
          {top.map((s, i) => (
            <div key={s.seat_number} className="flex items-center justify-between text-[12.5px]">
              <span className="text-slate-600">
                {i + 1}. Seat {s.seat_number}
              </span>
              <span className="rounded-md bg-paper-500 px-2 py-0.5 font-semibold text-slate-600">
                {s.occupied_shifts} / {s.total_shifts}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 border-t border-paper-500 pt-3.5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-emerald-100">
            <TrendingUp className="h-[17px] w-[17px] text-emerald-600" strokeWidth={2.1} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-semibold text-slate-800">Average occupancy</p>
            <p className="text-[11px] leading-snug text-slate-400">Based on {totalSeatShifts} total seat-shifts</p>
          </div>
          <span className="shrink-0 text-[16px] font-bold text-slate-900">{occupancyPct}%</span>
        </div>
      </div>
    </div>
  );
}
