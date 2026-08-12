import type { ReactNode } from "react";
import { Armchair, Crown } from "lucide-react";
import type { CurrentMembership } from "../../api/types";
import { Button } from "../ui";
import { FeeBadge } from "../students/FeeBadge";
import { formatDate, formatMoney, daysUntil } from "../../lib/format";
import { MembershipTimeline } from "./MembershipTimeline";

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-[13.5px] font-semibold text-slate-800">{value}</p>
    </div>
  );
}

export function CurrentMembershipCard({
  current,
  currencySymbol,
  onAssignSeat,
}: {
  current: CurrentMembership | null;
  currencySymbol: string;
  onAssignSeat: () => void;
}) {
  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <Crown className="h-[18px] w-[18px] text-brand-500" strokeWidth={2.1} />
        <h2 className="text-[15px] font-semibold text-slate-900">Current Membership</h2>
      </div>

      {!current ? (
        <div className="flex flex-col items-center justify-center gap-2.5 py-10 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-600">
            <Armchair className="h-5 w-5" strokeWidth={2} />
          </span>
          <p className="text-[13.5px] font-semibold text-slate-700">No active membership</p>
          <p className="max-w-[240px] text-[12.5px] text-slate-400">Assign a seat and membership to start tracking this student.</p>
          <Button size="sm" className="mt-1" onClick={onAssignSeat}>
            Assign seat
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <Row label="Plan" value={`${formatMoney(current.monthly_fee, currencySymbol)}/mo`} />
            <Row label="Seat Assignment" value={`Seat ${current.seat_number}`} />
            <Row label="Shift" value={current.shifts.map((s) => s.name).join(", ") || "—"} />
            <Row label="Start Date" value={formatDate(current.start_date)} />
            <Row label="Fee Status" value={<FeeBadge status={current.payment_status} />} />
            <Row
              label="End Date"
              value={
                <>
                  {formatDate(current.expiry_date)}{" "}
                  <span className="font-normal text-slate-400">
                    ({daysUntil(current.expiry_date) >= 0 ? `${daysUntil(current.expiry_date)} days left` : "overdue"})
                  </span>
                </>
              }
            />
          </div>
          <MembershipTimeline startDate={current.start_date} endDate={current.expiry_date} />
        </>
      )}
    </div>
  );
}
