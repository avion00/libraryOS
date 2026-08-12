import type { ReactNode } from "react";

export const settingInputClass =
  "h-10 w-full rounded-lg border border-paper-700 bg-white px-3 text-[13.5px] text-slate-700 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-paper-300 disabled:text-slate-400";

export function SettingField({
  label,
  htmlFor,
  hint,
  error,
  children,
  className = "",
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[12.5px] font-medium text-slate-600">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-[11.5px] text-slate-400">{hint}</p>}
      {error && <p className="mt-1 text-[11.5px] text-red-600">{error}</p>}
    </div>
  );
}
