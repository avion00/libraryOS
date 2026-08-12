import { formatDate, formatMoney } from "../../../lib/format";
import type { PendingFeeRow } from "../../students/types";
import { ReminderButton } from "../ReminderButton";

const COLUMNS = ["Student", "Seat", "Fee", "Collected", "Due", "Expiry", "Status", "Action"];

export function PendingFeesTable({ rows }: { rows: PendingFeeRow[] }) {
  if (rows.length === 0) {
    return <p className="py-14 text-center text-[13px] text-slate-400">No pending fees.</p>;
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
          {rows.map((r) => {
            const partial = r.amount_collected > 0;
            return (
              <tr key={r.membership_id} className="transition-colors hover:bg-paper-300/70">
                <td className="px-4 py-3 text-[13.5px] font-semibold text-slate-800">{r.student_name}</td>
                <td className="px-4 py-3 text-[13px] text-slate-600">Seat {r.seat_number}</td>
                <td className="px-4 py-3 text-[13px] text-slate-600">{formatMoney(r.monthly_fee)}</td>
                <td className="px-4 py-3 text-[13px] text-slate-600">{formatMoney(r.amount_collected)}</td>
                <td className="px-4 py-3 text-[13.5px] font-semibold text-red-600">{formatMoney(r.balance_due)}</td>
                <td className="px-4 py-3 text-[13px] text-slate-600">{formatDate(r.expiry_date)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex h-[23px] items-center rounded-full px-2.5 text-[11.5px] font-semibold ${
                      partial ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {partial ? "Partial" : "Due"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <ReminderButton studentName={r.student_name} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
