import type { Shift } from "../../api/types";
import { formatTime24, getShiftVisual } from "./shiftVisuals";

export function ShiftCoverage({ shifts, onViewAll }: { shifts: Shift[]; onViewAll: () => void }) {
  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-4 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="text-[13.5px] font-semibold text-slate-900">Shift Coverage</h3>
        <button onClick={onViewAll} className="text-[12px] font-semibold text-brand-600 hover:text-brand-700">
          View all
        </button>
      </div>

      <div className="mt-2.5 space-y-1.5">
        {shifts.map((shift, i) => {
          const visual = getShiftVisual(shift.name, i);
          return (
            <div key={shift.id} className="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] ${visual.iconBg}`}>
                <visual.icon className={`h-4 w-4 ${visual.iconColor}`} strokeWidth={2.1} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-slate-800">{shift.name}</p>
                <p className="text-[11.5px] text-slate-400">
                  {formatTime24(shift.start_time)} – {formatTime24(shift.end_time)}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  shift.is_active ? "bg-emerald-50 text-emerald-600" : "bg-paper-500 text-slate-500"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${shift.is_active ? "bg-emerald-500" : "bg-slate-400"}`} />
                {shift.is_active ? "Available" : "Inactive"}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 border-t border-paper-500 pt-2.5 text-[11.5px] text-slate-400">Up to 4 active shifts at a time.</p>
    </div>
  );
}
