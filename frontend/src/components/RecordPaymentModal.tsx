import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentsApi } from "../api/endpoints";
import { extractErrorMessage } from "../api/client";
import { useToast } from "../context/ToastContext";
import { Button, Field, Input, Modal, Select } from "../components/ui";
import type { Membership, Student } from "../api/types";

export default function RecordPaymentModal({
  open,
  onClose,
  student,
  membership,
}: {
  open: boolean;
  onClose: () => void;
  student: Student;
  membership?: Membership | null;
}) {
  const [amount, setAmount] = useState(membership ? String(membership.payment_summary.balance_due) : "");
  const [method, setMethod] = useState("cash");
  const [status, setStatus] = useState("paid");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { notify } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      paymentsApi.create({
        student: student.id,
        membership: membership?.id,
        amount: Number(amount),
        payment_date: date,
        method,
        status,
        reference_number: reference,
        notes,
      }),
    onSuccess: () => {
      notify("Payment recorded.", "success");
      queryClient.invalidateQueries({ queryKey: ["student", student.id] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      onClose();
    },
    onError: (err) => setError(extractErrorMessage(err)),
  });

  return (
    <Modal open={open} onClose={onClose} title={`Record payment — ${student.full_name}`}>
      <div className="space-y-4">
        {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount">
            <Input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </Field>
          <Field label="Payment date">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </Field>
          <Field label="Method">
            <Select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="online">Online</option>
              <option value="other">Other</option>
            </Select>
          </Field>
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="pending">Pending</option>
            </Select>
          </Field>
        </div>
        <Field label="Reference / transaction number (optional)">
          <Input value={reference} onChange={(e) => setReference(e.target.value)} />
        </Field>
        <Field label="Notes (optional)">
          <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setError(null);
              if (!amount || Number(amount) <= 0) {
                setError("Enter a valid amount greater than zero.");
                return;
              }
              mutation.mutate();
            }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving…" : "Record payment"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
