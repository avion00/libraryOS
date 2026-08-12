import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Armchair, CalendarClock, IndianRupee, Lightbulb } from "lucide-react";
import type { CurrentMembership } from "../../api/types";
import { daysUntil, formatDate, formatMoney } from "../../lib/format";

function InsightBlock({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  primary,
  secondary,
  action,
}: {
  icon: typeof Lightbulb;
  iconBg: string;
  iconColor: string;
  title: string;
  primary: string;
  secondary: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-paper-500 p-3">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${iconBg} ${iconColor}`}>
        <Icon className="h-[17px] w-[17px]" strokeWidth={2.1} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-medium text-slate-500">{title}</p>
        <p className="mt-0.5 text-[13.5px] font-semibold text-slate-800">{primary}</p>
        <p className="text-[11.5px] text-slate-400">{secondary}</p>
        {action}
      </div>
    </div>
  );
}

export function QuickInsightsCard({
  current,
  currencySymbol,
  onAssignSeat,
  onRenew,
}: {
  current: CurrentMembership | null;
  currencySymbol: string;
  onAssignSeat: () => void;
  onRenew: () => void;
}) {
  const left = current ? daysUntil(current.expiry_date) : null;
  const balanceDue = current?.balance_due ?? 0;

  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb className="h-[18px] w-[18px] text-brand-500" strokeWidth={2.1} />
        <h2 className="text-[15px] font-semibold text-slate-900">Quick Insights</h2>
      </div>

      <div className="space-y-3">
        <InsightBlock
          icon={Armchair}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
          title="Seat Status"
          primary={current ? `Seat ${current.seat_number}` : "Not assigned"}
          secondary={current ? current.shifts.map((s) => s.name).join(", ") || "—" : "No seat currently assigned"}
          action={
            !current && (
              <button onClick={onAssignSeat} className="mt-1.5 text-[12px] font-semibold text-brand-600 hover:text-brand-700">
                Assign seat
              </button>
            )
          }
        />

        {current && (
          <InsightBlock
            icon={CalendarClock}
            iconBg="bg-info-50"
            iconColor="text-info-600"
            title={left !== null && left < 0 ? "Membership Expired" : "Renewal Reminder"}
            primary={left !== null && left >= 0 ? `${left} day${left === 1 ? "" : "s"} left` : "Expired"}
            secondary={`${left !== null && left < 0 ? "Expired on" : "Renews on"} ${formatDate(current.expiry_date)}`}
            action={
              <button onClick={onRenew} className="mt-1.5 text-[12px] font-semibold text-brand-600 hover:text-brand-700">
                Renew now
              </button>
            }
          />
        )}

        {current && (
          <InsightBlock
            icon={IndianRupee}
            iconBg={balanceDue > 0 ? "bg-red-50" : "bg-emerald-50"}
            iconColor={balanceDue > 0 ? "text-red-600" : "text-emerald-600"}
            title="Outstanding"
            primary={formatMoney(balanceDue, currencySymbol)}
            secondary={balanceDue > 0 ? "Balance due on current membership" : "All payments are up to date"}
          />
        )}
      </div>

      <Link
        to="/reports?tab=students"
        className="mt-4 flex items-center gap-1 border-t border-paper-500 pt-3.5 text-[12.5px] font-semibold text-brand-600 hover:text-brand-700"
      >
        View full report
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
      </Link>
    </div>
  );
}
