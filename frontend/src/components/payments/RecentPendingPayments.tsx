import { Link } from "react-router-dom";
import { formatDate, formatMoney } from "../../lib/format";
import { Avatar } from "../dashboard/Avatar";
import type { PendingFeeRow } from "../students/types";

export function RecentPendingPayments({ rows }: { rows: PendingFeeRow[] }) {
  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-4 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="text-[13.5px] font-semibold text-slate-900">Recent Pending Payments</h3>
        <Link to="/reports" className="text-[12px] font-semibold text-brand-600 hover:text-brand-700">
          View all
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="py-4 text-center text-[12.5px] text-slate-400">No pending fees right now.</p>
      ) : (
        <div className="mt-1.5 divide-y divide-paper-500">
          {rows.slice(0, 5).map((r) => (
            <Link
              key={r.membership_id}
              to={`/students/${r.student_id}`}
              className="flex items-center gap-2.5 py-2.5 transition-colors hover:bg-paper-300/60"
            >
              <Avatar name={r.student_name} size={32} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-slate-800">{r.student_name}</p>
                <p className="text-[11.5px] text-slate-400">{r.student_code}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[13px] font-semibold text-slate-800">{formatMoney(r.balance_due)}</p>
                <p className="text-[11px] font-medium text-rose-500">Due on {formatDate(r.expiry_date)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
