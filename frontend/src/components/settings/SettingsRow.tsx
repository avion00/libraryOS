import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function SettingsRow({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
  trailing,
  onClick,
  disabled,
}: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description?: string;
  trailing?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      disabled={onClick ? disabled : undefined}
      className={`flex w-full items-center gap-3 py-3.5 text-left transition-colors ${
        onClick ? "rounded-lg px-2 hover:bg-paper-300 disabled:cursor-not-allowed disabled:opacity-60" : ""
      } ${disabled && !onClick ? "opacity-60" : ""}`}
    >
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${iconBg}`}>
        <Icon className={`h-[17px] w-[17px] ${iconColor}`} strokeWidth={2.1} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-medium text-slate-800">{title}</span>
        {description && <span className="block text-[12px] leading-snug text-slate-400">{description}</span>}
      </span>
      {trailing && <span className="shrink-0">{trailing}</span>}
    </Comp>
  );
}
