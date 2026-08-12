import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  hint,
  hintColor = "text-slate-400",
}: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  hint?: string;
  hintColor?: string;
}) {
  return (
    <div className="flex h-full flex-col justify-between gap-2.5 rounded-xl border border-paper-700 bg-white p-3.5 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-center gap-2.5">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${iconBg}`}>
          <Icon className={`h-[18px] w-[18px] ${iconColor}`} strokeWidth={2.1} />
        </span>
        <p className="text-[12px] font-medium leading-[1.2] text-slate-500">{label}</p>
      </div>
      <div>
        <p className="text-[22px] font-bold leading-none text-slate-900">{value}</p>
        {hint && <p className={`mt-1.5 text-[11.5px] font-medium leading-none ${hintColor}`}>{hint}</p>}
      </div>
    </div>
  );
}
