import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity } from "lucide-react";
import type { MonthlyPaymentPoint } from "./activity";
import { formatMoney } from "../../lib/format";

export function ActivityChartCard({ data, currencySymbol }: { data: MonthlyPaymentPoint[]; currencySymbol: string }) {
  const hasData = data.some((d) => d.amount > 0);

  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-5 shadow-card">
      <div className="mb-1 flex items-center gap-2">
        <Activity className="h-[18px] w-[18px] text-brand-500" strokeWidth={2.1} />
        <h2 className="text-[15px] font-semibold text-slate-900">Payment Activity</h2>
        <span className="text-[12px] text-slate-400">(Last 6 months)</span>
      </div>

      {!hasData ? (
        <div className="flex h-[190px] flex-col items-center justify-center gap-1 text-center">
          <p className="text-[13px] font-medium text-slate-500">No payment activity yet</p>
          <p className="text-[12px] text-slate-400">Recorded payments will appear here over time.</p>
        </div>
      ) : (
        <div className="mt-3 h-[190px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 4" vertical={false} stroke="var(--chart-grid)" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#8C969F" }} tickLine={false} axisLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "#8C969F" }}
                tickLine={false}
                axisLine={false}
                width={40}
                tickFormatter={(v) => (v >= 1000 ? `${v / 1000}K` : String(v))}
              />
              <Tooltip
                cursor={{ fill: "var(--chart-grid)" }}
                formatter={(v) => [formatMoney(Number(v), currencySymbol), "Collected"]}
                contentStyle={{ borderRadius: 10, border: "1px solid #E5E0D7", fontSize: 12, boxShadow: "0 4px 14px rgba(16,24,32,0.08)" }}
              />
              <Bar dataKey="amount" fill="var(--chart-primary)" radius={[4, 4, 0, 0]} maxBarSize={32} isAnimationActive animationDuration={700} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
