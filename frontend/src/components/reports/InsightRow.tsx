import type { LucideIcon } from "lucide-react";

export function InsightRow({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  value,
}: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle?: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${iconBg}`}>
        <Icon className={`h-[17px] w-[17px] ${iconColor}`} strokeWidth={2.1} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[12.5px] font-semibold text-slate-800">{title}</p>
        {subtitle && <p className="text-[11px] leading-snug text-slate-400">{subtitle}</p>}
      </div>
      <span className="shrink-0 text-[16px] font-bold text-slate-900">{value}</span>
    </div>
  );
}
