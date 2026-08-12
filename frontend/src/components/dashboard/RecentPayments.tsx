import { Link } from "react-router-dom";
import type { Payment } from "../../api/types";
import { formatMoney } from "../../lib/format";
import { Avatar } from "./Avatar";

const METHOD_LABEL: Record<string, string> = {
  cash: "Cash",
  bank_transfer: "Bank Transfer",
  online: "Online",
  other: "Other",
};

const STATUS_STYLE: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-600",
  pending: "bg-amber-50 text-amber-600",
  partial: "bg-amber-50 text-amber-600",
};

export function RecentPayments({ payments, currencySymbol }: { payments: Payment[]; currencySymbol: string }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-paper-700 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-slate-900">Recent Payments</h2>
        <Link to="/payments" className="text-[12.5px] font-semibold text-brand-600 hover:text-brand-700">
          View all
        </Link>
      </div>

      {payments.length === 0 ? (
        <p className="flex flex-1 items-center justify-center text-sm text-slate-400">No payments recorded yet.</p>
      ) : (
        <div className="mt-1.5 divide-y divide-paper-500">
          {payments.map((p) => (
            <div key={p.id} className="flex items-center gap-3 py-2.5">
              <Avatar name={p.student_name} size={36} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold text-slate-800">{p.student_name}</p>
                <p className="text-[12px] text-slate-400">{METHOD_LABEL[p.method] ?? p.method}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[13.5px] font-semibold text-slate-800">{formatMoney(p.amount, currencySymbol)}</p>
                <span
                  className={`mt-0.5 inline-flex items-center rounded-full px-2 py-[1px] text-[10.5px] font-semibold capitalize ${
                    STATUS_STYLE[p.status] ?? "bg-paper-500 text-slate-500"
                  }`}
                >
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
