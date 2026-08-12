import { ReceiptText } from "lucide-react";
import type { Payment } from "../../api/types";
import { PaymentRow } from "./PaymentRow";

const COLUMNS = ["Receipt", "Student", "Date", "Amount", "Method", "Status", "Actions"];

export function PaymentsTable({
  payments,
  onOpenReceipt,
  onClearFilters,
}: {
  payments: Payment[];
  onOpenReceipt: (payment: Payment) => void;
  onClearFilters: () => void;
}) {
  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper-500 text-slate-400">
          <ReceiptText className="h-5 w-5" strokeWidth={2} />
        </span>
        <div>
          <p className="text-[14px] font-semibold text-slate-700">No payments found</p>
          <p className="mt-0.5 text-[13px] text-slate-400">Try adjusting your search or filters.</p>
        </div>
        <button
          onClick={onClearFilters}
          className="mt-1 rounded-lg border border-paper-700 px-3.5 py-1.5 text-[12.5px] font-medium text-slate-600 hover:bg-paper-300"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="px-4 pt-3.5 text-[14px] font-semibold text-slate-900">All Payments</h2>
      <div className="mt-1 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-paper-300/80">
            <tr>
              {COLUMNS.map((c) => (
                <th key={c} className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-paper-500">
            {payments.map((p) => (
              <PaymentRow key={p.id} payment={p} onOpenReceipt={onOpenReceipt} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
