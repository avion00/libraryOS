import { Mail } from "lucide-react";
import { formatDate } from "../../../lib/format";
import type { ExpiryRow } from "../../students/types";

const COLUMNS = ["Student", "Phone", "Seat", "Expiry", "Status", "Reminder Sent"];

export function ExpiryTable({ rows }: { rows: ExpiryRow[] }) {
  if (rows.length === 0) {
    return <p className="py-14 text-center text-[13px] text-slate-400">No memberships expiring in this period.</p>;
  }

  return (
    <div className="overflow-x-auto">
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
          {rows.map((r) => (
            <tr key={r.membership_id} className="transition-colors hover:bg-paper-300/70">
              <td className="px-4 py-3 text-[13.5px] font-semibold text-slate-800">{r.student_name}</td>
              <td className="px-4 py-3 text-[13px] text-slate-600">{r.phone}</td>
              <td className="px-4 py-3 text-[13px] text-slate-600">Seat {r.seat_number}</td>
              <td className="px-4 py-3 text-[13px] text-slate-600">{formatDate(r.expiry_date)}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex h-[23px] items-center rounded-full px-2.5 text-[11.5px] font-semibold ${
                    r.is_overdue ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {r.is_overdue ? "Overdue" : "Pending"}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="flex items-center gap-1.5 text-[13px] text-slate-400">
                  <Mail className="h-3.5 w-3.5" strokeWidth={2} />
                  No
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
