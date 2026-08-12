import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { membershipsApi } from "../api/endpoints";
import { extractErrorMessage } from "../api/client";
import { useToast } from "../context/ToastContext";
import { Button, Modal } from "../components/ui";
import SeatShiftPicker from "./SeatShiftPicker";
import type { Membership } from "../api/types";

export default function ChangeMembershipModal({
  open,
  onClose,
  membership,
}: {
  open: boolean;
  onClose: () => void;
  membership: Membership;
}) {
  const [seatId, setSeatId] = useState<number | null>(membership.seat);
  const [shiftIds, setShiftIds] = useState<number[]>(membership.shifts.filter((s) => s.is_active).map((s) => s.shift.id));
  const [error, setError] = useState<string | null>(null);
  const { notify } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => membershipsApi.change(membership.id, { seat_id: seatId!, shift_ids: shiftIds }),
    onSuccess: () => {
      notify("Seat/shift updated.", "success");
      queryClient.invalidateQueries({ queryKey: ["student", membership.student.id] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      onClose();
    },
    onError: (err) => setError(extractErrorMessage(err)),
  });

  return (
    <Modal open={open} onClose={onClose} title={`Change seat/shift — ${membership.student.full_name}`}>
      <div className="space-y-4">
        {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <SeatShiftPicker
          seatId={seatId}
          shiftIds={shiftIds}
          onSeatChange={setSeatId}
          onShiftIdsChange={setShiftIds}
          excludeMembershipId={membership.id}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setError(null);
              if (!seatId || shiftIds.length === 0) {
                setError("Please select a seat and at least one shift.");
                return;
              }
              mutation.mutate();
            }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
