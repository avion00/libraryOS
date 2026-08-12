import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const COLORS = { active: "#10b981", vacated: "#64748b", expired: "#fb7185", no_membership: "#e2e8f0" };

export function MembershipOverview({
  active,
  vacated,
  expired,
  noMembership,
}: {
  active: number;
  vacated: number;
  expired: number;
  noMembership: number;
}) {
  const total = Math.max(active + vacated + expired + noMembership, 1);
  const data = [
    { key: "active", label: "Active", value: active, color: COLORS.active },
    { key: "vacated", label: "Vacated", value: vacated, color: COLORS.vacated },
    { key: "expired", label: "Expired", value: expired, color: COLORS.expired },
    { key: "no_membership", label: "No Membership", value: noMembership, color: COLORS.no_membership },
  ];
  const pct = (n: number) => Math.round((n / total) * 100);

  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-4 shadow-card">
      <h3 className="text-[13.5px] font-semibold text-slate-900">Membership Overview</h3>

      <div className="mt-2 flex items-center gap-3">
        <div className="h-[90px] w-[90px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="key" innerRadius={28} outerRadius={44} paddingAngle={2} cornerRadius={3} isAnimationActive animationDuration={700}>
                {data.map((d) => (
                  <Cell key={d.key} fill={d.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-1.5">
          {data.map((d) => (
            <div key={d.key} className="flex items-center justify-between text-[11.5px]">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                {d.label}
              </span>
              <span className="font-semibold text-slate-700">
                {d.value} <span className="font-normal text-slate-400">({pct(d.value)}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <Link
        to="/reports"
        className="mt-3 flex items-center gap-1 text-[12px] font-semibold text-brand-600 hover:text-brand-700"
      >
        View full report
        <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
      </Link>
    </div>
  );
}
