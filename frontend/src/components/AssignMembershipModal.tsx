import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { membershipsApi, settingsApi } from "../api/endpoints";
import { extractErrorMessage } from "../api/client";
import { useToast } from "../context/ToastContext";
import { Button, Field, Input, Modal } from "../components/ui";
import SeatShiftPicker from "./SeatShiftPicker";
import type { Student } from "../api/types";

export default function AssignMembershipModal({
  open,
  onClose,
  student,
}: {
  open: boolean;
  onClose: () => void;
  student: Student;
}) {
  const [seatId, setSeatId] = useState<number | null>(null);
  const [shiftIds, setShiftIds] = useState<number[]>([]);
  const [monthlyFee, setMonthlyFee] = useState("");
  const [startDate, setStartDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { notify } = useToast();
  const queryClient = useQueryClient();

  const { data: librarySettings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsApi.get().then((r) => r.data),
    enabled: open,
  });

  useEffect(() => {
    if (librarySettings && monthlyFee === "") {
      setMonthlyFee(String(librarySettings.default_monthly_fee));
    }
  }, [librarySettings, monthlyFee]);

  const mutation = useMutation({
    mutationFn: () =>
      membershipsApi.create({
        student_id: student.id,
        seat_id: seatId!,
        shift_ids: shiftIds,
        monthly_fee: Number(monthlyFee),
        start_date: startDate || undefined,
      }),
    onSuccess: () => {
      notify("Seat assigned successfully.", "success");
      queryClient.invalidateQueries({ queryKey: ["student", student.id] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      onClose();
    },
    onError: (err) => setError(extractErrorMessage(err)),
  });

  function handleSubmit() {
    setError(null);
    if (!seatId || shiftIds.length === 0) {
      setError("Please select a seat and at least one shift.");
      return;
    }
    mutation.mutate();
  }

  return (
    <Modal open={open} onClose={onClose} title={`Assign seat — ${student.full_name}`}>
      <div className="space-y-4">
        {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <SeatShiftPicker seatId={seatId} shiftIds={shiftIds} onSeatChange={setSeatId} onShiftIdsChange={setShiftIds} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Monthly fee">
            <Input type="number" min="0" step="0.01" value={monthlyFee} onChange={(e) => setMonthlyFee(e.target.value)} />
          </Field>
          <Field label="Start date (optional)">
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </Field>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? "Assigning…" : "Assign seat"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
