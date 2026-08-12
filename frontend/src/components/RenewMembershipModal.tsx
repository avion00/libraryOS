import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { membershipsApi } from "../api/endpoints";
import { extractErrorMessage } from "../api/client";
import { useToast } from "../context/ToastContext";
import { Button, Field, Input, Modal, Select } from "../components/ui";
import type { Membership } from "../api/types";
import { formatDate } from "../lib/format";

export default function RenewMembershipModal({
  open,
  onClose,
  membership,
}: {
  open: boolean;
  onClose: () => void;
  membership: Membership;
}) {
  const [monthlyFee, setMonthlyFee] = useState(String(membership.monthly_fee));
  const [collectPayment, setCollectPayment] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState(String(membership.monthly_fee));
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [error, setError] = useState<string | null>(null);
  const { notify } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      membershipsApi.renew(membership.id, {
        monthly_fee: Number(monthlyFee),
        ...(collectPayment && Number(paymentAmount) > 0
          ? { payment_amount: Number(paymentAmount), payment_method: paymentMethod }
          : {}),
      }),
    onSuccess: () => {
      notify("Membership renewed.", "success");
      queryClient.invalidateQueries({ queryKey: ["student", membership.student.id] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      onClose();
    },
    onError: (err) => setError(extractErrorMessage(err)),
  });

  const nextStart = new Date(membership.expiry_date);
  nextStart.setDate(nextStart.getDate() + 1);

  return (
    <Modal open={open} onClose={onClose} title={`Renew membership — ${membership.student.full_name}`}>
      <div className="space-y-4">
        {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <p className="text-sm text-slate-600">
          Current membership expires <strong>{formatDate(membership.expiry_date)}</strong>. The new period will start{" "}
          <strong>{formatDate(nextStart.toISOString().slice(0, 10))}</strong> and run for one month, keeping the same
          seat and shifts.
        </p>
        <Field label="Monthly fee">
          <Input type="number" min="0" step="0.01" value={monthlyFee} onChange={(e) => setMonthlyFee(e.target.value)} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={collectPayment} onChange={(e) => setCollectPayment(e.target.checked)} />
          Collect payment now
        </label>
        {collectPayment && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount received">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </Field>
            <Field label="Method">
              <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="online">Online</option>
                <option value="other">Other</option>
              </Select>
            </Field>
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => { setError(null); mutation.mutate(); }} disabled={mutation.isPending}>
            {mutation.isPending ? "Renewing…" : "Renew membership"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
