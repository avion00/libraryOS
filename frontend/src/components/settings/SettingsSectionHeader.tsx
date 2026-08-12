import type { ReactNode } from "react";

export function SettingsSectionHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-[18px] font-semibold text-slate-900">{title}</h2>
        <p className="mt-0.5 text-[13px] text-slate-500">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
