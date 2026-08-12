import { useState } from "react";
import { History } from "lucide-react";
import type { Membership } from "../../api/types";
import { StatusBadge } from "../students/StatusBadge";
import { formatDate, formatMoney } from "../../lib/format";

const PAGE_SIZE = 5;

export function MembershipHistoryCard({ memberships, currencySymbol }: { memberships: Membership[]; currencySymbol: string }) {
  const [expanded, setExpanded] = useState(false);
  const sorted = [...memberships].sort((a, b) => b.start_date.localeCompare(a.start_date));
  const visible = expanded ? sorted : sorted.slice(0, PAGE_SIZE);

  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <History className="h-[18px] w-[18px] text-brand-500" strokeWidth={2.1} />
        <h2 className="text-[15px] font-semibold text-slate-900">Membership History</h2>
      </div>

      {sorted.length === 0 ? (
        <p className="py-8 text-center text-[13px] text-slate-400">No previous memberships.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px]">
              <thead>
                <tr className="text-left text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">
                  <th className="pb-2 pr-2">Plan</th>
                  <th className="pb-2 pr-2">Shift</th>
                  <th className="pb-2 pr-2">Start</th>
                  <th className="pb-2 pr-2">End</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-500">
                {visible.map((m) => (
                  <tr key={m.id}>
                    <td className="py-2 pr-2 font-medium text-slate-700">{formatMoney(m.monthly_fee, currencySymbol)}/mo</td>
                    <td className="py-2 pr-2 text-slate-600">{m.shifts.map((s) => s.shift.name).join(", ") || "—"}</td>
                    <td className="py-2 pr-2 text-slate-600">{formatDate(m.start_date)}</td>
                    <td className="py-2 pr-2 text-slate-600">{formatDate(m.expiry_date)}</td>
                    <td className="py-2">
                      <StatusBadge status={m.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sorted.length > PAGE_SIZE && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-3.5 border-t border-paper-500 pt-3.5 text-[12.5px] font-semibold text-brand-600 hover:text-brand-700"
            >
              {expanded ? "Show less" : `View all history (${sorted.length})`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
