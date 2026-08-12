import { ChevronRight, User } from "lucide-react";
import type { SeatSlot, Shift } from "../../api/types";
import { Avatar } from "../dashboard/Avatar";
import { formatTime, getShiftVisual } from "./shiftVisuals";

export function SeatShiftRow({
  shift,
  slot,
  index,
  onAssign,
  onViewStudent,
}: {
  shift: Shift;
  slot: SeatSlot | undefined;
  index: number;
  onAssign: (shiftId: number) => void;
  onViewStudent: (studentId: number) => void;
}) {
  const visual = getShiftVisual(shift.name, index);
  const occupied = slot?.status === "occupied";

  function handleClick() {
    if (occupied && slot?.student) onViewStudent(slot.student.id);
    else onAssign(shift.id);
  }

  return (
    <button
      onClick={handleClick}
      className="flex w-full items-center gap-3 rounded-xl border border-paper-700 p-3 text-left transition-colors hover:border-brand-300 hover:bg-brand-50/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] ${visual.iconBg}`}>
        <visual.icon className={`h-[18px] w-[18px] ${visual.iconColor}`} strokeWidth={2.1} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="flex items-baseline gap-2 text-[14.5px] font-semibold text-slate-800">
          {shift.name}
          <span className="text-[12px] font-normal text-slate-400">
            {formatTime(shift.start_time)} – {formatTime(shift.end_time)}
          </span>
        </p>
        {occupied && slot?.student ? (
          <p className="text-[12px] text-slate-500">
            {slot.student.full_name} <span className="text-slate-400">({slot.student.student_code})</span>
          </p>
        ) : (
          <p className="text-[12px] text-slate-400">No student assigned</p>
        )}
      </div>

      {occupied && slot?.student ? (
        <Avatar name={slot.student.full_name} size={30} />
      ) : (
        <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-paper-500 text-slate-400">
          <User className="h-4 w-4" strokeWidth={2} />
        </span>
      )}

      <span
        className={`inline-flex h-[23px] shrink-0 items-center rounded-full px-2.5 text-[11px] font-semibold ${
          occupied ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
        }`}
      >
        {occupied ? "Occupied" : "Available"}
      </span>

      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" strokeWidth={2} />
    </button>
  );
}
