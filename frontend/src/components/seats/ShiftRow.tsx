import { Pencil, Trash2 } from "lucide-react";
import type { Shift } from "../../api/types";
import { formatTime24, getShiftVisual } from "./shiftVisuals";

export function ShiftRow({
  shift,
  index,
  assignedSeats,
  onEdit,
  onDeleteRequest,
}: {
  shift: Shift;
  index: number;
  assignedSeats: number;
  onEdit: (shift: Shift) => void;
  onDeleteRequest: (shift: Shift) => void;
}) {
  const visual = getShiftVisual(shift.name, index);
  return (
    <tr className="transition-colors hover:bg-paper-300/70">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] ${visual.iconBg}`}>
            <visual.icon className={`h-4 w-4 ${visual.iconColor}`} strokeWidth={2.1} />
          </span>
          <span className="text-[13.5px] font-semibold text-slate-800">{shift.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-[13px] text-slate-600">
        {formatTime24(shift.start_time)} – {formatTime24(shift.end_time)}
      </td>
      <td className="px-4 py-3 text-[13px] text-slate-600">{shift.display_order}</td>
      <td className="px-4 py-3 text-[13px] text-slate-600">{assignedSeats} Seats</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex h-[23px] items-center rounded-full px-2.5 text-[11.5px] font-semibold ${
            shift.is_active ? "bg-emerald-50 text-emerald-600" : "bg-paper-500 text-slate-500"
          }`}
        >
          {shift.is_active ? "Available" : "Inactive"}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(shift)}
            title="Edit shift"
            aria-label="Edit shift"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-500 transition-colors hover:bg-brand-50"
          >
            <Pencil className="h-[15px] w-[15px]" strokeWidth={2} />
          </button>
          <button
            onClick={() => onDeleteRequest(shift)}
            title="Delete shift"
            aria-label="Delete shift"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-[15px] w-[15px]" strokeWidth={2} />
          </button>
        </div>
      </td>
    </tr>
  );
}
