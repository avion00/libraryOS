import type { ReactNode } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export interface DonutSegment {
  key: string;
  label: string;
  value: number;
  color: string;
  displayValue: string;
}

export function ReportDonutCard({
  title,
  headerAction,
  centerValue,
  centerLabel,
  segments,
  footer,
}: {
  title: string;
  headerAction?: ReactNode;
  centerValue: string;
  centerLabel: string;
  segments: DonutSegment[];
  footer?: ReactNode;
}) {
  const total = Math.max(segments.reduce((s, seg) => s + seg.value, 0), 1);
  const pct = (n: number) => Math.round((n / total) * 1000) / 10;

  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-4 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="text-[13.5px] font-semibold text-slate-900">{title}</h3>
        {headerAction}
      </div>

      <div className="relative mx-auto mt-2 h-[140px] w-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={segments}
              dataKey="value"
              nameKey="key"
              innerRadius={46}
              outerRadius={66}
              paddingAngle={2}
              cornerRadius={3}
              isAnimationActive
              animationDuration={700}
            >
              {segments.map((s) => (
                <Cell key={s.key} fill={s.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
          <span className="text-[19px] font-bold leading-none text-slate-900">{centerValue}</span>
          <span className="mt-1 text-[10.5px] leading-tight text-slate-400">{centerLabel}</span>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {segments.map((s) => (
          <div key={s.key} className="flex items-center justify-between text-[12.5px]">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
            <span className="text-right">
              <span className="font-semibold text-slate-700">{s.displayValue}</span>{" "}
              <span className="text-slate-400">({pct(s.value)}%)</span>
            </span>
          </div>
        ))}
      </div>

      {footer}
    </div>
  );
}
