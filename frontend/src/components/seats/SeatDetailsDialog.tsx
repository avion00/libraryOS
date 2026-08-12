import { useId, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Armchair, Ban, History, ShieldCheck, UserPlus, X } from "lucide-react";
import { seatsApi } from "../../api/endpoints";
import { extractErrorMessage } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { DialogShell, Button, ConfirmDialog } from "../ui";
import type { SeatMapEntry, Shift } from "../../api/types";
import { computeSeatStatus, SEAT_STATUS_META } from "./types";
import { SeatSummaryStrip } from "./SeatSummaryStrip";
import { SeatShiftRow } from "./SeatShiftRow";
import { SeatHistoryDialog } from "./SeatHistoryDialog";

export function SeatDetailsDialog({
  entry,
  shifts,
  onClose,
  onChanged,
  onRequestAssign,
  onViewStudent,
}: {
  entry: SeatMapEntry | null;
  shifts: Shift[];
  onClose: () => void;
  onChanged: () => void;
  onRequestAssign: (shiftId?: number) => void;
  onViewStudent: (studentId: number) => void;
}) {
  const titleId = useId();
  const { notify } = useToast();
  const queryClient = useQueryClient();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [disableConfirmOpen, setDisableConfirmOpen] = useState(false);

  const toggleMutation = useMutation({
    mutationFn: (nextStatus: "available" | "disabled") => seatsApi.update(entry!.seat.id, { status: nextStatus }),
    onSuccess: (_, nextStatus) => {
      notify(nextStatus === "disabled" ? "Seat disabled." : "Seat enabled.", "success");
      queryClient.invalidateQueries({ queryKey: ["seat-map"] });
      onChanged();
      setDisableConfirmOpen(false);
      if (nextStatus === "disabled") onClose();
    },
    onError: (err) => notify(extractErrorMessage(err), "error"),
  });

  if (!entry) return null;

  const status = computeSeatStatus(entry);
  const meta = SEAT_STATUS_META[status];
  const isDisabled = entry.seat.status === "disabled";
  const canAssign = !isDisabled && entry.occupied_count < entry.total_shifts;

  return (
    <>
      <DialogShell open={!!entry} onClose={onClose} widthClass="max-w-[760px]" labelledBy={titleId}>
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50">
                <Armchair className="h-7 w-7 text-brand-600" strokeWidth={2} />
              </span>
              <div>
                <h2 id={titleId} className="text-[26px] font-bold leading-tight text-slate-900">
                  Seat {entry.seat.number}
                </h2>
                <p className="text-[13.5px] text-slate-400">Seat details &amp; shift availability</p>
                <span className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${meta.bg} ${meta.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                  {meta.label === "Fully available" ? "Available" : meta.label === "Fully occupied" ? "Fully occupied" : meta.label}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="rounded-full border border-paper-700 p-2 text-slate-400 hover:bg-paper-500 hover:text-slate-600" aria-label="Close">
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          <div className="mt-5">
            <SeatSummaryStrip
              occupied={entry.occupied_count}
              total={entry.total_shifts}
              todayLabel={meta.label === "Fully available" ? "Available" : meta.label === "Fully occupied" ? "Full" : meta.label === "Disabled" ? "Disabled" : "Partial"}
              todayColor={meta.text}
              zone={entry.seat.notes || "Zone A"}
              seatType="Standard"
            />
          </div>

          <div className="mt-6">
            <h3 className="text-[15px] font-semibold text-slate-900">Shift availability</h3>
            <p className="text-[12.5px] text-slate-400">Manage shifts and assign students.</p>
            <div className="mt-3 space-y-2">
              {shifts.map((shift, i) => (
                <SeatShiftRow
                  key={shift.id}
                  shift={shift}
                  index={i}
                  slot={entry.slots.find((s) => s.shift_id === shift.id)}
                  onAssign={(shiftId) => onRequestAssign(shiftId)}
                  onViewStudent={onViewStudent}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-info-50 p-3.5 text-[12.5px] leading-relaxed text-info-700">
            Students can be assigned to any available shift. You can assign from the student's profile or use the{" "}
            <button onClick={() => onRequestAssign()} className="font-semibold text-info-600 underline underline-offset-2 hover:text-info-700">
              Assign student
            </button>{" "}
            action.
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-2.5 border-t border-paper-500 pt-5">
            <Button variant="secondary" onClick={() => setHistoryOpen(true)}>
              <History className="h-4 w-4" strokeWidth={2} />
              View seat history
            </Button>
            <div className="flex items-center gap-2.5">
              {isDisabled ? (
                <Button variant="secondary" onClick={() => toggleMutation.mutate("available")} disabled={toggleMutation.isPending}>
                  <ShieldCheck className="h-4 w-4" strokeWidth={2} />
                  Enable seat
                </Button>
              ) : (
                <button
                  onClick={() => setDisableConfirmOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 px-4 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-50"
                >
                  <Ban className="h-4 w-4" strokeWidth={2} />
                  Disable seat
                </button>
              )}
              <Button onClick={() => onRequestAssign()} disabled={!canAssign}>
                <UserPlus className="h-4 w-4" strokeWidth={2.2} />
                Assign student
              </Button>
            </div>
          </div>
        </div>
      </DialogShell>

      <SeatHistoryDialog open={historyOpen} onClose={() => setHistoryOpen(false)} seatId={entry.seat.id} seatNumber={entry.seat.number} />

      <ConfirmDialog
        open={disableConfirmOpen}
        title={`Disable Seat ${entry.seat.number}?`}
        message="This will prevent new student assignments until the seat is enabled again."
        confirmLabel="Disable seat"
        danger
        loading={toggleMutation.isPending}
        onConfirm={() => toggleMutation.mutate("disabled")}
        onCancel={() => setDisableConfirmOpen(false)}
      />
    </>
  );
}
