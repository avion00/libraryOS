import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { formatMoney } from "../../lib/format";
import { STATUS_META } from "./types";

export function PaymentOverview({ paid, pending, partial }: { paid: number; pending: number; partial: number }) {
  const total = Math.max(paid + pending + partial, 1);
  const data = [
    { key: "paid", label: STATUS_META.paid.label, value: paid, color: STATUS_META.paid.dot },
    { key: "pending", label: STATUS_META.pending.label, value: pending, color: STATUS_META.pending.dot },
    { key: "partial", label: STATUS_META.partial.label, value: partial, color: STATUS_META.partial.dot },
  ];
  const pct = (n: number) => Math.round((n / total) * 1000) / 10;

  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-4 shadow-card">
      <h3 className="text-[13.5px] font-semibold text-slate-900">Payment Overview</h3>

      <div className="relative mx-auto mt-2 h-[140px] w-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="key"
              innerRadius={46}
              outerRadius={66}
              paddingAngle={2}
              cornerRadius={3}
              isAnimationActive
              animationDuration={700}
            >
              {data.map((d) => (
                <Cell key={d.key} fill={d.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
          <span className="text-[19px] font-bold leading-none text-slate-900">{formatMoney(total)}</span>
          <span className="mt-1 text-[10.5px] leading-tight text-slate-400">Total Collection</span>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {data.map((d) => (
          <div key={d.key} className="flex items-center justify-between text-[12.5px]">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
              {d.label}
            </span>
            <span className="text-right">
              <span className="font-semibold text-slate-700">{formatMoney(d.value)}</span>{" "}
              <span className="text-slate-400">({pct(d.value)}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
