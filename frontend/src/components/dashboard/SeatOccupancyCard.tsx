import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { CalendarClock } from "lucide-react";

const COLORS = { occupied: "var(--chart-success)", vacant: "#FBBF24", disabled: "var(--chart-neutral)" };

export function SeatOccupancyCard({
  occupied,
  vacant,
  disabled,
  occupancyPercentage,
  shiftSlotsOccupied,
  shiftSlotsTotal,
}: {
  occupied: number;
  vacant: number;
  disabled: number;
  occupancyPercentage: number;
  shiftSlotsOccupied: number;
  shiftSlotsTotal: number;
}) {
  const total = Math.max(occupied + vacant + disabled, 1);
  const data = [
    { key: "occupied", value: occupied, color: COLORS.occupied },
    { key: "vacant", value: vacant, color: COLORS.vacant },
    { key: "disabled", value: disabled, color: COLORS.disabled },
  ];
  const pct = (n: number) => Math.round((n / total) * 100);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-paper-700 bg-white p-5 shadow-card">
      <h2 className="text-[15px] font-semibold text-slate-900">Seat Occupancy</h2>

      <div className="relative mx-auto mt-2 h-[160px] w-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="key"
              innerRadius={54}
              outerRadius={76}
              paddingAngle={2}
              cornerRadius={4}
              startAngle={90}
              endAngle={-270}
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
          <span className="text-2xl font-bold text-slate-900">{occupancyPercentage}%</span>
          <span className="text-[11.5px] font-medium text-slate-400">Occupied</span>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        <LegendRow color={COLORS.occupied} label="Occupied" count={occupied} pct={pct(occupied)} />
        <LegendRow color={COLORS.vacant} label="Vacant" count={vacant} pct={pct(vacant)} border />
        <LegendRow color={COLORS.disabled} label="Disabled" count={disabled} pct={pct(disabled)} />
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-paper-500 pt-3.5 text-[12.5px] text-slate-500">
        <CalendarClock className="h-3.5 w-3.5 shrink-0 text-slate-400" strokeWidth={2} />
        {shiftSlotsOccupied} of {shiftSlotsTotal} shift-slots booked
      </div>
    </div>
  );
}

function LegendRow({ color, label, count, pct, border }: { color: string; label: string; count: number; pct: number; border?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="flex items-center gap-2 text-slate-600">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: color, boxShadow: border ? "inset 0 0 0 1px rgba(148,163,184,0.4)" : undefined }}
        />
        {label} ({count})
      </span>
      <span className="font-semibold text-slate-700">{pct}%</span>
    </div>
  );
}
