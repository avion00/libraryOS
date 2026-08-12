import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function StudentStatCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  value,
  footer,
  rightSlot,
}: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  value: string;
  footer: string;
  rightSlot?: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col justify-between gap-3 rounded-xl border border-paper-700 bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-center gap-2.5">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${iconBg}`}>
          <Icon className={`h-[18px] w-[18px] ${iconColor}`} strokeWidth={2.1} />
        </span>
        <p className="text-[13px] font-medium text-slate-500">{title}</p>
      </div>
      <div>
        <p className="text-[24px] font-bold leading-none text-slate-900">{value}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-[12px] text-slate-400">{footer}</span>
          {rightSlot}
        </div>
      </div>
    </div>
  );
}
