import { CalendarDays, Star } from "lucide-react";
import { formatDate, formatMoney } from "../../lib/format";
import { InsightRow } from "./InsightRow";

export function CollectionsInsights({
  bestDay,
  busiestDay,
}: {
  bestDay: { date: string; amount: number } | null;
  busiestDay: { date: string; count: number } | null;
}) {
  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-4 shadow-card">
      <h3 className="text-[13.5px] font-semibold text-slate-900">Insights</h3>
      <div className="mt-3 space-y-3">
        {bestDay ? (
          <InsightRow icon={Star} iconBg="bg-amber-100" iconColor="text-amber-600" title="Best collection day" subtitle={formatDate(bestDay.date)} value={formatMoney(bestDay.amount)} />
        ) : (
          <p className="text-[12.5px] text-slate-400">No collections yet.</p>
        )}
        {busiestDay && (
          <InsightRow
            icon={CalendarDays}
            iconBg="bg-orange-100"
            iconColor="text-orange-700"
            title="Busiest payment day"
            subtitle={formatDate(busiestDay.date)}
            value={`${busiestDay.count} payment${busiestDay.count === 1 ? "" : "s"}`}
          />
        )}
      </div>
    </div>
  );
}
