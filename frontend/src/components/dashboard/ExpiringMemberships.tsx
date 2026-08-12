import { Link } from "react-router-dom";
import { daysUntil, formatDate } from "../../lib/format";
import { Avatar } from "./Avatar";

interface ExpiringMembership {
  membership_id: number;
  student_id: number;
  student_name: string;
  seat_number: number;
  expiry_date: string;
}

export function ExpiringMemberships({ memberships }: { memberships: ExpiringMembership[] }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-paper-700 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-slate-900">Expiring Memberships</h2>
        <Link to="/reports" className="text-[12.5px] font-semibold text-brand-600 hover:text-brand-700">
          View all
        </Link>
      </div>

      {memberships.length === 0 ? (
        <p className="flex flex-1 items-center justify-center text-sm text-slate-400">Nothing expiring soon.</p>
      ) : (
        <div className="mt-1.5 divide-y divide-paper-500">
          {memberships.slice(0, 5).map((m) => {
            const left = daysUntil(m.expiry_date);
            const urgent = left <= 2;
            return (
              <Link
                key={m.membership_id}
                to={`/students/${m.student_id}`}
                className="flex items-center gap-3 py-2.5 transition-colors hover:bg-paper-300/60"
              >
                <Avatar name={m.student_name} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold text-slate-800">{m.student_name}</p>
                  <p className="text-[12px] text-slate-400">Seat {m.seat_number}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-[1px] text-[10.5px] font-semibold ${
                      urgent ? "bg-rose-50 text-rose-600" : "bg-orange-50 text-orange-600"
                    }`}
                  >
                    {left <= 0 ? "Expires today" : `${left} day${left === 1 ? "" : "s"} left`}
                  </span>
                  <p className="mt-0.5 text-[11.5px] text-slate-400">{formatDate(m.expiry_date)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
