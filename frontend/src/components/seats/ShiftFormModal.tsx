import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shiftsApi } from "../../api/endpoints";
import { extractErrorMessage } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { Button, Field, Input, Modal } from "../ui";
import type { Shift } from "../../api/types";

export function ShiftFormModal({
  open,
  onClose,
  shift,
  activeCount,
}: {
  open: boolean;
  onClose: () => void;
  shift: Shift | null;
  activeCount: number;
}) {
  const isEdit = !!shift;
  const [name, setName] = useState(shift?.name ?? "");
  const [startTime, setStartTime] = useState(shift?.start_time.slice(0, 5) ?? "");
  const [endTime, setEndTime] = useState(shift?.end_time.slice(0, 5) ?? "");
  const [displayOrder, setDisplayOrder] = useState(String(shift?.display_order ?? 0));
  const [isActive, setIsActive] = useState(shift?.is_active ?? true);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        name,
        start_time: startTime,
        end_time: endTime,
        display_order: Number(displayOrder),
        is_active: isActive,
      };
      return isEdit ? shiftsApi.update(shift!.id, payload) : shiftsApi.create(payload);
    },
    onSuccess: () => {
      notify(isEdit ? "Shift updated." : "Shift created.", "success");
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      queryClient.invalidateQueries({ queryKey: ["seat-map"] });
      onClose();
    },
    onError: (err) => setError(extractErrorMessage(err)),
  });

  function handleSubmit() {
    setError(null);
    const wasAlreadyActive = shift?.is_active ?? false;
    if (isActive && !wasAlreadyActive && activeCount >= 4) {
      setError("Maximum of 4 active shifts allowed. Deactivate another shift first.");
      return;
    }
    mutation.mutate();
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit shift" : "Add shift"}>
      <div className="space-y-4">
        {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <Field label="Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start time">
            <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
          </Field>
          <Field label="End time">
            <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
          </Field>
        </div>
        <Field label="Display order">
          <Input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-400"
          />
          Active
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
