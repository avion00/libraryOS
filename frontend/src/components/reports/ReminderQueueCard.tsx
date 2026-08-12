import { ArrowRight } from "lucide-react";
import { formatDate, formatMoney } from "../../lib/format";
import type { PendingFeeRow } from "../students/types";
import { Avatar } from "../dashboard/Avatar";
import { ReminderButton } from "./ReminderButton";

export function ReminderQueueCard({ rows }: { rows: PendingFeeRow[] }) {
  const sorted = [...rows].sort((a, b) => a.expiry_date.localeCompare(b.expiry_date));

  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-4 shadow-card">
      <h3 className="text-[13.5px] font-semibold text-slate-900">Reminder Queue</h3>

      {sorted.length === 0 ? (
        <p className="py-4 text-center text-[12.5px] text-slate-400">Nothing to remind right now.</p>
      ) : (
        <div className="mt-1.5 divide-y divide-paper-500">
          {sorted.slice(0, 5).map((r) => (
            <div key={r.membership_id} className="flex items-center gap-2.5 py-2.5">
              <Avatar name={r.student_name} size={32} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-slate-800">{r.student_name}</p>
                <p className="text-[11px] font-medium text-rose-500">Due on {formatDate(r.expiry_date)}</p>
              </div>
              <span className="shrink-0 text-[13px] font-semibold text-slate-800">{formatMoney(r.balance_due)}</span>
              <ReminderButton studentName={r.student_name} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600" />
            </div>
          ))}
        </div>
      )}

      <button className="mt-2.5 flex items-center gap-1 border-t border-paper-500 pt-2.5 text-[12px] font-semibold text-brand-600 hover:text-brand-700">
        View all reminders
        <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
      </button>
    </div>
  );
}
