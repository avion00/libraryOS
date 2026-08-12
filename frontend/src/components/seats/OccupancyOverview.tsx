import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const COLORS = { available: "#10b981", partial: "#f97316", full: "#ef4444", disabled: "#94a3b8" };

export function OccupancyOverview({
  available,
  partial,
  full,
  disabled,
}: {
  available: number;
  partial: number;
  full: number;
  disabled: number;
}) {
  const total = Math.max(available + partial + full + disabled, 1);
  const data = [
    { key: "available", label: "Available", value: available, color: COLORS.available },
    { key: "partial", label: "Partial", value: partial, color: COLORS.partial },
    { key: "full", label: "Full", value: full, color: COLORS.full },
    { key: "disabled", label: "Disabled", value: disabled, color: COLORS.disabled },
  ];
  const pct = (n: number) => Math.round((n / total) * 1000) / 10;

  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-4 shadow-card">
      <h3 className="text-[13.5px] font-semibold text-slate-900">Occupancy Overview</h3>

      <div className="mt-2 flex items-center gap-4">
        <div className="relative h-[128px] w-[128px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="key"
                innerRadius={42}
                outerRadius={62}
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
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[22px] font-bold leading-none text-slate-900">{total}</span>
            <span className="mt-0.5 text-center text-[10.5px] leading-tight text-slate-400">Total Seats</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((d) => (
            <div key={d.key} className="flex items-center justify-between text-[12.5px]">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                {d.label}
              </span>
              <span className="font-semibold text-slate-700">
                {d.value} <span className="font-normal text-slate-400">({pct(d.value)}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
