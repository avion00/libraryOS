import { Info } from "lucide-react";
import type { Shift } from "../../api/types";
import { ShiftRow } from "./ShiftRow";

const COLUMNS = ["Name", "Time", "Order", "Assigned Seats", "Status", "Actions"];

export function ShiftsTable({
  shifts,
  assignedSeats,
  onEdit,
  onDeleteRequest,
}: {
  shifts: Shift[];
  assignedSeats: number;
  onEdit: (shift: Shift) => void;
  onDeleteRequest: (shift: Shift) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-paper-700 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-paper-300/80">
            <tr>
              {COLUMNS.map((c) => (
                <th key={c} className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-paper-500">
            {shifts.map((shift, i) => (
              <ShiftRow key={shift.id} shift={shift} index={i} assignedSeats={assignedSeats} onEdit={onEdit} onDeleteRequest={onDeleteRequest} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 border-t border-paper-500 px-4 py-3 text-[12.5px] text-slate-500">
        <Info className="h-3.5 w-3.5 shrink-0 text-slate-400" strokeWidth={2} />
        A library can configure up to 4 active shifts at a time.
      </div>
    </div>
  );
}
