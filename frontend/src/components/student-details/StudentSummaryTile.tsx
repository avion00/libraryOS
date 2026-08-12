import type { LucideIcon } from "lucide-react";

export function StudentSummaryTile({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  accent?: "orange" | "neutral";
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-paper-700 bg-paper-300/60 px-3 py-2.5">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] ${
          accent === "orange" ? "bg-orange-100 text-orange-700" : "bg-paper-700 text-ink-700"
        }`}
      >
        <Icon className="h-4 w-4" strokeWidth={2.1} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[11px] font-medium text-slate-500">{label}</span>
        <span className="block truncate text-[13.5px] font-semibold text-slate-800">{value}</span>
      </span>
    </div>
  );
}
