import { Link } from "react-router-dom";
import { ArrowRight, Download, ReceiptText } from "lucide-react";
import type { Payment } from "../../../api/types";
import { formatDate, formatMoney } from "../../../lib/format";
import { Avatar } from "../../dashboard/Avatar";
import { PaymentStatusBadge } from "../../payments/PaymentStatusBadge";
import { METHOD_LABEL } from "../../payments/types";
import { METHOD_VISUAL } from "../../payments/methodVisuals";

const COLUMNS = ["Date", "Student", "Seat", "Method", "Amount", "Status", "Receipt", ""];

export function CollectionsTable({
  payments,
  seatByMembership,
  onOpenReceipt,
}: {
  payments: Payment[];
  seatByMembership: Map<number, number>;
  onOpenReceipt: (payment: Payment) => void;
}) {
  return (
    <div className="rounded-2xl border border-paper-700 bg-white shadow-card">
      <div className="flex items-center justify-between px-4 pt-3.5">
        <h3 className="text-[14px] font-semibold text-slate-900">Recent collections</h3>
        <Link to="/payments" className="flex items-center gap-1 text-[12.5px] font-semibold text-brand-600 hover:text-brand-700">
          View all collections
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
        </Link>
      </div>

      {payments.length === 0 ? (
        <p className="py-14 text-center text-[13px] text-slate-400">No collections in this period.</p>
      ) : (
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
              {payments.map((p) => {
                const visual = METHOD_VISUAL[p.method];
                const seat = p.membership ? seatByMembership.get(p.membership) : undefined;
                return (
                  <tr key={p.id} className="transition-colors hover:bg-paper-300/70">
                    <td className="px-4 py-3 text-[13px] text-slate-600">{formatDate(p.payment_date)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={p.student_name} size={30} />
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-slate-800">{p.student_name}</p>
                          <p className="text-[11px] text-slate-400">{p.student_code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-slate-600">{seat ? `Seat ${seat}` : "—"}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-[13px] text-slate-600">
                        <visual.icon className={`h-3.5 w-3.5 shrink-0 ${visual.color}`} strokeWidth={2} />
                        {METHOD_LABEL[p.method]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[13.5px] font-semibold text-slate-800">{formatMoney(p.amount)}</td>
                    <td className="px-4 py-3">
                      <PaymentStatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-slate-500">{p.receipt_number}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onOpenReceipt(p)}
                          title="View receipt"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
                        >
                          <ReceiptText className="h-[15px] w-[15px]" strokeWidth={2} />
                        </button>
                        <button
                          onClick={() => onOpenReceipt(p)}
                          title="Download receipt"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
                        >
                          <Download className="h-[15px] w-[15px]" strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
