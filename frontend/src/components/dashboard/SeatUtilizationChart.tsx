import { useMemo, useRef, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChevronDown } from "lucide-react";

const RANGE_OPTIONS = [
  { key: "7", label: "Last 7 days" },
  { key: "14", label: "Last 14 days" },
];

const PATTERN_7 = [22, 27, 34, 29, 34, 17, 30];
const PATTERN_14 = [18, 24, 20, 26, 31, 22, 27, 25, 30, 33, 19, 24, 21, 30];

function buildData(days: number, pattern: number[], todayValue?: number) {
  const today = new Date();
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const value = i === 0 && typeof todayValue === "number" ? Math.round(todayValue) : pattern[pattern.length - 1 - i];
    out.push({ label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }), value });
  }
  return out;
}

function LastPointLabel(rawProps: unknown) {
  const props = rawProps as { x?: string | number; y?: string | number; index?: number; value?: string | number };
  const total = (rawProps as { total: number }).total;
  const { index } = props;
  const x = typeof props.x === "number" ? props.x : Number(props.x);
  const y = typeof props.y === "number" ? props.y : Number(props.y);
  if (index !== total - 1 || Number.isNaN(x) || Number.isNaN(y)) return null;
  const text = `${props.value}%`;
  const w = 14 + text.length * 7;
  return (
    <g transform={`translate(${x - w / 2}, ${y - 34})`}>
      <rect width={w} height={22} rx={7} fill="var(--chart-primary)" />
      <text x={w / 2} y={15} textAnchor="middle" fontSize={11} fontWeight={700} fill="#101820">
        {text}
      </text>
    </g>
  );
}

export function SeatUtilizationChart({ occupancyPercentage }: { occupancyPercentage: number }) {
  const [range, setRange] = useState<"7" | "14">("7");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const data = useMemo(
    () => buildData(range === "7" ? 7 : 14, range === "7" ? PATTERN_7 : PATTERN_14, occupancyPercentage),
    [range, occupancyPercentage]
  );

  return (
    <div className="flex h-full flex-col rounded-2xl border border-paper-700 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-900">Seat Utilization Trend</h2>
          <p className="text-[12px] text-slate-400">(Last {range} Days)</p>
        </div>
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg border border-paper-700 px-2.5 py-1.5 text-[12.5px] font-medium text-slate-600 hover:bg-paper-300"
          >
            {RANGE_OPTIONS.find((o) => o.key === range)?.label}
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
          {open && (
            <div className="absolute right-0 top-9 z-20 w-36 rounded-lg border border-paper-700 bg-white p-1 shadow-card-hover">
              {RANGE_OPTIONS.map((o) => (
                <button
                  key={o.key}
                  onClick={() => {
                    setRange(o.key as "7" | "14");
                    setOpen(false);
                  }}
                  className="block w-full rounded-md px-2.5 py-1.5 text-left text-[12.5px] text-slate-600 hover:bg-paper-300"
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 min-h-[190px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 28, right: 22, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="utilFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-primary)" stopOpacity={0.28} />
                <stop offset="100%" stopColor="var(--chart-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 4" vertical={false} stroke="#eef1f6" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              interval={range === "14" ? 1 : 0}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(v) => `${v}%`}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              width={40}
            />
            <Tooltip
              formatter={(v) => [`${v}%`, "Utilization"]}
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
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--chart-primary)"
              strokeWidth={2.25}
              fill="url(#utilFill)"
              dot={{ r: 3.5, fill: "var(--chart-primary)", strokeWidth: 2, stroke: "#ffffff" }}
              activeDot={{ r: 5 }}
              isAnimationActive
              animationDuration={700}
              label={(p) => LastPointLabel({ ...p, total: data.length })}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
