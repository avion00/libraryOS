import { useEffect, useId, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, UserPlus, X } from "lucide-react";
import { membershipsApi, settingsApi, studentsApi } from "../../api/endpoints";
import { extractErrorMessage } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { useDebounce } from "../../lib/useDebounce";
import { DialogShell, Button, Field, Input } from "../ui";
import { Avatar } from "../dashboard/Avatar";
import { getShiftVisual, formatTime } from "./shiftVisuals";
import type { SeatSlot, Shift, Student } from "../../api/types";

export function AssignStudentDialog({
  open,
  onClose,
  seatId,
  seatNumber,
  shifts,
  slots,
  initialShiftId,
  onAssigned,
}: {
  open: boolean;
  onClose: () => void;
  seatId: number;
  seatNumber: number;
  shifts: Shift[];
  slots: SeatSlot[];
  initialShiftId?: number | null;
  onAssigned: () => void;
}) {
  const titleId = useId();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [student, setStudent] = useState<Student | null>(null);
  const [shiftIds, setShiftIds] = useState<number[]>(initialShiftId ? [initialShiftId] : []);
  const [monthlyFee, setMonthlyFee] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { notify } = useToast();
  const queryClient = useQueryClient();

  const { data: librarySettings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsApi.get().then((r) => r.data),
    enabled: open,
  });
  useEffect(() => {
    if (librarySettings && monthlyFee === "") setMonthlyFee(String(librarySettings.default_monthly_fee));
  }, [librarySettings, monthlyFee]);

  const { data: results, isFetching } = useQuery({
    queryKey: ["students", "assign-search", debouncedQuery],
    queryFn: () => studentsApi.list({ search: debouncedQuery, page_size: 8 }).then((r) => r.data.results),
    enabled: open && debouncedQuery.trim().length > 0,
  });

  const mutation = useMutation({
    mutationFn: () =>
      membershipsApi.create({
        student_id: student!.id,
        seat_id: seatId,
        shift_ids: shiftIds,
        monthly_fee: Number(monthlyFee),
      }),
    onSuccess: () => {
      notify(`${student!.full_name} assigned to Seat ${seatNumber}.`, "success");
      queryClient.invalidateQueries({ queryKey: ["seat-map"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      onAssigned();
      onClose();
    },
    onError: (err) => setError(extractErrorMessage(err)),
  });

  function toggleShift(id: number, occupiedByOther: boolean) {
    if (occupiedByOther) return;
    setShiftIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : prev.length >= 4 ? prev : [...prev, id]));
  }

  function handleSubmit() {
    setError(null);
    if (!student) {
      setError("Select a student to assign.");
      return;
    }
    if (shiftIds.length === 0) {
      setError("Select at least one shift.");
      return;
    }
    mutation.mutate();
  }

  function handleClose() {
    setQuery("");
    setStudent(null);
    setShiftIds(initialShiftId ? [initialShiftId] : []);
    setError(null);
    onClose();
  }

  return (
    <DialogShell open={open} onClose={handleClose} widthClass="max-w-lg" labelledBy={titleId}>
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 id={titleId} className="text-[18px] font-bold text-slate-900">
              Assign student
            </h2>
            <p className="text-[12.5px] text-slate-400">Seat {seatNumber}</p>
          </div>
          <button onClick={handleClose} className="rounded-full p-1.5 text-slate-400 hover:bg-paper-500 hover:text-slate-600" aria-label="Close">
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        {!student ? (
          <div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={2} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search students by name, phone, or ID…"
                className="h-10 w-full rounded-lg border border-paper-700 pl-9 pr-3 text-[13.5px] text-slate-700 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div className="mt-2 max-h-64 overflow-y-auto">
              {query.trim() === "" ? (
                <p className="py-6 text-center text-[12.5px] text-slate-400">Type to search students.</p>
              ) : isFetching ? (
                <p className="py-6 text-center text-[12.5px] text-slate-400">Searching…</p>
              ) : results && results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStudent(s)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-paper-300"
                    >
                      <Avatar name={s.full_name} size={30} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold text-slate-800">{s.full_name}</span>
                        <span className="block text-[11.5px] text-slate-400">
                          {s.student_code} · {s.phone}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="py-6 text-center text-[12.5px] text-slate-400">No students found.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 rounded-lg border border-paper-700 p-2.5">
              <Avatar name={student.full_name} size={34} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-semibold text-slate-800">{student.full_name}</span>
                <span className="block text-[11.5px] text-slate-400">{student.student_code}</span>
              </span>
              <button onClick={() => setStudent(null)} className="text-[12px] font-semibold text-brand-600 hover:text-brand-700">
                Change
              </button>
            </div>

            <div>
              <p className="mb-1.5 text-[13px] font-medium text-slate-700">Shifts (up to 4)</p>
              <div className="grid grid-cols-2 gap-2">
                {shifts.map((shift, i) => {
                  const slot = slots.find((s) => s.shift_id === shift.id);
                  const occupiedByOther = slot?.status === "occupied";
                  const selected = shiftIds.includes(shift.id);
                  const visual = getShiftVisual(shift.name, i);
                  return (
                    <button
                      key={shift.id}
                      type="button"
                      disabled={occupiedByOther}
                      onClick={() => toggleShift(shift.id, occupiedByOther)}
                      className={`rounded-lg border px-3 py-2 text-left text-[13px] transition-colors ${
                        occupiedByOther
                          ? "cursor-not-allowed border-paper-700 bg-paper-300 text-slate-400"
                          : selected
                            ? "border-brand-400 bg-brand-50 text-brand-700"
                            : "border-paper-700 text-slate-700 hover:bg-paper-300"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        <visual.icon className="h-3.5 w-3.5" strokeWidth={2} />
                        {shift.name}
                      </span>
                      <span className="text-[11px] opacity-70">
                        {formatTime(shift.start_time)}–{formatTime(shift.end_time)}
                      </span>
                      {occupiedByOther && <span className="mt-0.5 block text-[10.5px]">Booked by {slot?.student?.full_name}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <Field label="Monthly fee">
              <Input type="number" min="0" step="0.01" value={monthlyFee} onChange={(e) => setMonthlyFee(e.target.value)} />
            </Field>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!student || mutation.isPending}>
            <UserPlus className="h-4 w-4" strokeWidth={2.2} />
            {mutation.isPending ? "Assigning…" : "Confirm assignment"}
          </Button>
        </div>
      </div>
    </DialogShell>
  );
}
