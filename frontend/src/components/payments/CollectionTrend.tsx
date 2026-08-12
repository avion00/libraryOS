import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatMoney } from "../../lib/format";

export function CollectionTrend({ data }: { data: { label: string; amount: number }[] }) {
  const total = data.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-4 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="text-[13.5px] font-semibold text-slate-900">Collection Trend</h3>
        <span className="text-[11.5px] text-slate-400">Last 7 days</span>
      </div>
      <p className="mt-1 text-[18px] font-bold text-slate-900">{formatMoney(total)}</p>

      <div className="mt-1 h-[80px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="collectionFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-primary)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--chart-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              formatter={(v) => [formatMoney(Number(v)), "Collected"]}
              labelFormatter={(l) => l}
              contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 11, boxShadow: "0 4px 14px rgba(15,23,42,0.08)" }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="var(--chart-primary)"
              strokeWidth={2}
              fill="url(#collectionFill)"
              dot={{ r: 2.5, fill: "var(--chart-primary)", strokeWidth: 0 }}
              isAnimationActive
              animationDuration={700}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-1 flex justify-between text-[10.5px] text-slate-400">
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}
