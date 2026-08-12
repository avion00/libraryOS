import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";

interface Option {
  value: string;
  label: string;
}

export function FilterSelect({
  options,
  className = "",
  ...props
}: { options: readonly Option[]; className?: string } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={`relative ${className}`}>
      <select
        {...props}
        className="h-10 w-full appearance-none rounded-lg border border-paper-700 bg-white pl-3 pr-8 text-[13.5px] font-medium text-slate-600 transition-colors focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={2} />
    </div>
  );
}
