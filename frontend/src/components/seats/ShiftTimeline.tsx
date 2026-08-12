import type { Shift } from "../../api/types";
import { formatTime24, getShiftVisual } from "./shiftVisuals";

export function ShiftTimeline({ shifts }: { shifts: Shift[] }) {
  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-4 shadow-card">
      <h3 className="text-[13.5px] font-semibold text-slate-900">Shift Timeline / Coverage</h3>

      <div className="mt-3 space-y-0">
        {shifts.map((shift, i) => {
          const visual = getShiftVisual(shift.name, i);
          const isLast = i === shifts.length - 1;
          return (
            <div key={shift.id} className="relative flex gap-3 pb-5 last:pb-0">
              {!isLast && <span className="absolute left-[5px] top-4 h-full w-px bg-paper-700" />}
              <span className={`relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${visual.dot}`} />
              <div className="flex flex-1 items-center gap-2.5">
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
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                    shift.is_active ? "bg-emerald-50 text-emerald-600" : "bg-paper-500 text-slate-500"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${shift.is_active ? "bg-emerald-500" : "bg-slate-400"}`} />
                  {shift.is_active ? "Available" : "Inactive"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
