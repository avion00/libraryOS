import type { Shift } from "../../api/types";
import { getShiftVisual } from "./shiftVisuals";

export function ShiftUtilization({
  entries,
  overall,
}: {
  entries: { shift: Shift; percentage: number }[];
  overall: number;
}) {
  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-4 shadow-card">
      <h3 className="text-[13.5px] font-semibold text-slate-900">Utilization by Shift</h3>

      <div className="mt-3 space-y-3">
        {entries.map(({ shift, percentage }, i) => {
          const visual = getShiftVisual(shift.name, i);
          return (
            <div key={shift.id}>
              <div className="mb-1 flex items-center justify-between text-[12.5px]">
                <span className="font-medium text-slate-600">{shift.name}</span>
                <span className="font-semibold text-slate-700">{Math.round(percentage)}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper-500">
                <div
                  className={`h-full rounded-full ${visual.bar} transition-[width] duration-700`}
                  style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-paper-500 pt-3">
        <span className="text-[12.5px] font-semibold text-slate-700">Overall Utilization</span>
        <span className="text-[14px] font-bold text-brand-600">{Math.round(overall)}%</span>
      </div>
    </div>
  );
}
