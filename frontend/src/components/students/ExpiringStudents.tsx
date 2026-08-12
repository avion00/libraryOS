import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { formatDate } from "../../lib/format";
import type { ExpiryRow } from "./types";

export function ExpiringStudents({ rows }: { rows: ExpiryRow[] }) {
  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-4 shadow-card">
      <h3 className="text-[13.5px] font-semibold text-slate-900">Expiring This Month</h3>

      {rows.length === 0 ? (
        <p className="py-4 text-center text-[12.5px] text-slate-400">Nothing expiring this month.</p>
      ) : (
        <div className="mt-2 divide-y divide-paper-500">
          {rows.slice(0, 5).map((r) => (
            <Link
              key={r.membership_id}
              to={`/students/${r.student_id}`}
              className="flex items-center justify-between gap-2 py-2 text-[12.5px] transition-colors hover:text-brand-600"
            >
              <span className="text-slate-500">{formatDate(r.expiry_date)}</span>
              <span className="truncate font-medium text-slate-700">{r.student_name}</span>
            </Link>
          ))}
        </div>
      )}

      <Link to="/reports" className="mt-2.5 flex items-center gap-1 text-[12px] font-semibold text-brand-600 hover:text-brand-700">
        View all
        <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
      </Link>
    </div>
  );
}
