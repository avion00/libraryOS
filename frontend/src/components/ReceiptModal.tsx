import { useQuery } from "@tanstack/react-query";
import { paymentsApi } from "../api/endpoints";
import { Button, Modal, PageLoading } from "../components/ui";
import { formatDate, formatMoney } from "../lib/format";

export default function ReceiptModal({ open, onClose, paymentId }: { open: boolean; onClose: () => void; paymentId: number | null }) {
  const { data: receipt, isLoading } = useQuery({
    queryKey: ["receipt", paymentId],
    queryFn: () => paymentsApi.receipt(paymentId!).then((r) => r.data),
    enabled: open && !!paymentId,
  });

  return (
    <Modal open={open} onClose={onClose} title="Receipt" widthClass="max-w-md">
      {isLoading || !receipt ? (
        <PageLoading />
      ) : (
        <div>
          <div id="receipt-print" className="rounded-lg border border-slate-200 p-5 text-sm">
            <div className="mb-4 text-center">
              <p className="text-lg font-semibold text-slate-900">{receipt.library.name}</p>
              {receipt.library.address && <p className="text-xs text-slate-500">{receipt.library.address}</p>}
              <p className="text-xs text-slate-500">
                {receipt.library.phone} {receipt.library.email && `• ${receipt.library.email}`}
              </p>
            </div>
            <div className="mb-3 flex justify-between border-t border-dashed border-slate-300 pt-3 text-xs text-slate-500">
              <span>Receipt No.</span>
              <span className="font-medium text-slate-800">{receipt.receipt_number}</span>
            </div>
            <div className="space-y-1.5">
              <Row label="Student" value={`${receipt.student.full_name} (${receipt.student.student_code})`} />
              {receipt.seat_number != null && <Row label="Seat" value={`Seat ${receipt.seat_number}`} />}
              {receipt.shifts.length > 0 && <Row label="Shift(s)" value={receipt.shifts.join(", ")} />}
              {receipt.billing_period && (
                <Row
                  label="Billing period"
                  value={`${formatDate(receipt.billing_period.start_date)} – ${formatDate(receipt.billing_period.expiry_date)}`}
                />
              )}
              <Row label="Payment date" value={formatDate(receipt.payment_date)} />
              <Row label="Method" value={receipt.method.replace("_", " ")} />
              <Row label="Status" value={receipt.status} />
              {receipt.reference_number && <Row label="Reference" value={receipt.reference_number} />}
            </div>
            <div className="mt-4 flex justify-between border-t border-dashed border-slate-300 pt-3 text-base font-semibold text-slate-900">
              <span>Amount</span>
              <span>{formatMoney(receipt.amount, receipt.currency_symbol)}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2 no-print">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => window.print()}>Print</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  );
}
