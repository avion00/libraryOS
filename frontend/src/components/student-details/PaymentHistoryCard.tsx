import { useState } from "react";
import { Plus, ReceiptText } from "lucide-react";
import type { Payment } from "../../api/types";
import { PaymentStatusBadge } from "../payments/PaymentStatusBadge";
import { METHOD_LABEL } from "../payments/types";
import { Button } from "../ui";
import { formatDate, formatMoney } from "../../lib/format";

const PAGE_SIZE = 6;

export function PaymentHistoryCard({
  payments,
  currencySymbol,
  onRecordPayment,
  onOpenReceipt,
}: {
  payments: Payment[];
  currencySymbol: string;
  onRecordPayment: () => void;
  onOpenReceipt: (payment: Payment) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const sorted = [...payments].sort((a, b) => b.payment_date.localeCompare(a.payment_date));
  const visible = expanded ? sorted : sorted.slice(0, PAGE_SIZE);

  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ReceiptText className="h-[18px] w-[18px] text-brand-500" strokeWidth={2.1} />
          <h2 className="text-[15px] font-semibold text-slate-900">Payment History</h2>
        </div>
        <Button variant="secondary" size="sm" onClick={onRecordPayment}>
          <Plus className="h-3.5 w-3.5" strokeWidth={2.2} />
          Record payment
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <p className="text-[13px] font-medium text-slate-500">No payments recorded yet</p>
          <Button size="sm" onClick={onRecordPayment}>
            <Plus className="h-3.5 w-3.5" strokeWidth={2.2} />
            Record payment
          </Button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px]">
              <thead>
                <tr className="text-left text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">
                  <th className="pb-2 pr-2">Date</th>
                  <th className="pb-2 pr-2">Receipt No.</th>
                  <th className="pb-2 pr-2">Method</th>
                  <th className="pb-2 pr-2">Amount</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-500">
                {visible.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 pr-2 text-slate-600">{formatDate(p.payment_date)}</td>
                    <td className="py-2 pr-2">
                      <button
                        onClick={() => onOpenReceipt(p)}
                        className="font-mono text-[12px] text-brand-600 hover:text-brand-700 hover:underline"
                      >
                        {p.receipt_number}
                      </button>
                    </td>
                    <td className="py-2 pr-2 capitalize text-slate-600">{METHOD_LABEL[p.method]}</td>
                    <td className="py-2 pr-2 font-semibold text-slate-800">{formatMoney(p.amount, currencySymbol)}</td>
                    <td className="py-2">
                      <PaymentStatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sorted.length > PAGE_SIZE && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-3.5 border-t border-paper-500 pt-3.5 text-[12.5px] font-semibold text-brand-600 hover:text-brand-700"
            >
              {expanded ? "Show less" : `View all payments (${sorted.length})`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
