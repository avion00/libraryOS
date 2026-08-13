import { useState } from "react";
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatDate, formatMoney } from "../../../lib/format";

interface DailyPoint {
  date: string;
  amount: number;
  count: number;
}

export function CollectionsChart({ data }: { data: DailyPoint[] }) {
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  return (
    <div className="flex h-full flex-col rounded-2xl border border-paper-700 bg-white p-4 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-[13.5px] font-semibold text-slate-900">Daily collections</h3>
          <div className="mt-1 flex items-center gap-3 text-[11.5px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-brand-500" /> Amount (₹)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-3 rounded-full bg-ink-200" /> Transactions
            </span>
          </div>
        </div>
        <div className="flex rounded-lg border border-paper-700 p-0.5">
          <button
            onClick={() => setChartType("bar")}
            className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors ${
              chartType === "bar" ? "bg-brand-400 text-ink-900" : "text-slate-500 hover:bg-paper-300"
            }`}
          >
            Bar
          </button>
          <button
            onClick={() => setChartType("line")}
            className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors ${
              chartType === "line" ? "bg-brand-400 text-ink-900" : "text-slate-500 hover:bg-paper-300"
            }`}
          >
            Line
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <p className="flex flex-1 items-center justify-center text-[13px] text-slate-400">No collections in this period.</p>
      ) : (
        <div className="mt-3 min-h-[260px] flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 4" vertical={false} stroke="#eef1f6" />
              <XAxis
                dataKey="date"
                tickFormatter={(v) => formatDate(v)}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                minTickGap={24}
              />
              <YAxis yAxisId="amount" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} width={44} tickFormatter={(v) => `${v / 1000}K`} />
              <YAxis yAxisId="count" orientation="right" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} width={28} allowDecimals={false} />
              <Tooltip
                labelFormatter={(v) => formatDate(v as string)}
                formatter={(value, name) => (name === "amount" ? [formatMoney(Number(value)), "Amount"] : [value, "Transactions"])}
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--surface)",
                  color: "var(--text-primary)",
                  fontSize: 12,
                  boxShadow: "0 4px 14px rgba(15,23,42,0.08)",
                }}
                labelStyle={{ color: "var(--text-secondary)" }}
                itemStyle={{ color: "var(--text-primary)" }}
              />
              {chartType === "bar" ? (
                <Bar yAxisId="amount" dataKey="amount" fill="var(--chart-primary)" radius={[4, 4, 0, 0]} maxBarSize={28} />
              ) : (
                <Line yAxisId="amount" type="monotone" dataKey="amount" stroke="var(--chart-primary)" strokeWidth={2.25} dot={{ r: 3, fill: "var(--chart-primary)" }} />
              )}
              <Line yAxisId="count" type="monotone" dataKey="count" stroke="var(--chart-neutral)" strokeWidth={1.75} dot={{ r: 2.5, fill: "var(--chart-neutral)" }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
