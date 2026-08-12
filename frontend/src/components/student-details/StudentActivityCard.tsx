import { useState } from "react";
import { Armchair, ClipboardList, DoorOpen, IndianRupee, UserRound } from "lucide-react";
import type { ActivityEvent } from "./activity";
import { formatDateTime } from "../../lib/format";

const PAGE_SIZE = 6;

const META: Record<ActivityEvent["type"], { icon: typeof UserRound; bg: string; color: string }> = {
  created: { icon: UserRound, bg: "bg-emerald-50", color: "text-emerald-600" },
  membership_started: { icon: Armchair, bg: "bg-orange-50", color: "text-orange-600" },
  membership_renewed: { icon: Armchair, bg: "bg-orange-50", color: "text-orange-600" },
  vacated: { icon: DoorOpen, bg: "bg-paper-500", color: "text-slate-500" },
  payment: { icon: IndianRupee, bg: "bg-emerald-50", color: "text-emerald-600" },
};

export function StudentActivityCard({ events }: { events: ActivityEvent[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? events : events.slice(0, PAGE_SIZE);

  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <ClipboardList className="h-[18px] w-[18px] text-brand-500" strokeWidth={2.1} />
        <h2 className="text-[15px] font-semibold text-slate-900">Notes / Recent Activity</h2>
      </div>

      {events.length === 0 ? (
        <p className="py-8 text-center text-[13px] text-slate-400">No recent activity.</p>
      ) : (
        <>
          <div className="space-y-0">
            {visible.map((e, i) => {
              const meta = META[e.type];
              const isLast = i === visible.length - 1;
              return (
                <div key={e.id} className="relative flex gap-3 pb-4 last:pb-0">
                  {!isLast && <span className="absolute left-[15px] top-8 h-[calc(100%-20px)] w-px bg-paper-700" />}
                  <span className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${meta.bg} ${meta.color}`}>
                    <meta.icon className="h-[15px] w-[15px]" strokeWidth={2.1} />
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-[13px] font-semibold text-slate-800">{e.title}</p>
                    <p className="text-[11.5px] text-slate-400">
                      {formatDateTime(e.timestamp)}
                      {e.actor ? ` by ${e.actor}` : ""}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {events.length > PAGE_SIZE && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 border-t border-paper-500 pt-3.5 text-[12.5px] font-semibold text-brand-600 hover:text-brand-700"
            >
              {expanded ? "Show less" : `View all activity (${events.length})`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
