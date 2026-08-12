import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { formatDate } from "../../lib/format";

interface TimelineEntry {
  label: string;
  range: string;
  count: number;
  color: string;
}

export function ExpiryTimelineCard({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-4 shadow-card">
      <h3 className="text-[13.5px] font-semibold text-slate-900">Expiry Timeline</h3>

      <div className="mt-3 space-y-0">
        {entries.map((e, i) => {
          const isLast = i === entries.length - 1;
          return (
            <div key={e.label} className="relative flex gap-3 pb-5 last:pb-0">
              {!isLast && <span className="absolute left-[5px] top-4 h-full w-px bg-paper-700" />}
              <span className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: e.color }} />
              <div className="flex flex-1 items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-slate-800">{e.label}</p>
                  <p className="text-[11.5px] text-slate-400">{e.range}</p>
                </div>
                <span className="shrink-0 rounded-full bg-paper-500 px-2.5 py-1 text-[12.5px] font-bold text-slate-700">{e.count}</span>
              </div>
            </div>
          );
        })}
      </div>

      <Link to="/reports?tab=expiry" className="mt-1 flex items-center gap-1 border-t border-paper-500 pt-3.5 text-[12.5px] font-semibold text-brand-600 hover:text-brand-700">
        View full expiry report
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
      </Link>
    </div>
  );
}

export function formatExpiryRangeLabel(fromDays: number, toDays: number | null): string {
  const today = new Date();
  const from = new Date(today);
  from.setDate(from.getDate() + fromDays);
  if (toDays === null) return `After ${formatDate(from.toISOString().slice(0, 10))}`;
  const to = new Date(today);
  to.setDate(to.getDate() + toDays);
  return `${formatDate(from.toISOString().slice(0, 10))} – ${formatDate(to.toISOString().slice(0, 10))}`;
}
