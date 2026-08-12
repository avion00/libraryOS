import { Link } from "react-router-dom";
import { Avatar } from "./Avatar";

const CHECKINS = [
  { name: "Aarav Sharma", seat: 7, time: "11:12 AM" },
  { name: "Diya Singh", seat: 22, time: "11:07 AM" },
  { name: "Rohan Verma", seat: 3, time: "10:58 AM" },
  { name: "Ananya Gupta", seat: 15, time: "10:45 AM" },
];

export function RecentCheckins() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-paper-700 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-slate-900">Recent Check-ins</h2>
        <Link to="/seats" className="text-[12.5px] font-semibold text-brand-600 hover:text-brand-700">
          View all
        </Link>
      </div>

      <div className="mt-1.5 divide-y divide-paper-500">
        {CHECKINS.map((c) => (
          <div key={c.name} className="flex items-center gap-3 py-2.5">
            <Avatar name={c.name} size={36} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold text-slate-800">{c.name}</p>
              <p className="text-[12px] text-slate-400">Seat {String(c.seat).padStart(2, "0")}</p>
            </div>
            <div className="shrink-0 text-right">
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-[1px] text-[10.5px] font-semibold text-emerald-600">
                IN
              </span>
              <p className="mt-0.5 text-[11.5px] text-slate-400">{c.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
