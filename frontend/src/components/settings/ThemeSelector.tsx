import { Moon, Monitor, Sun } from "lucide-react";

export type ThemePreference = "light" | "dark" | "system";

const OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeSelector({ value, onChange }: { value: ThemePreference; onChange: (v: ThemePreference) => void }) {
  return (
    <div>
      <p className="mb-1.5 text-[12.5px] font-medium text-slate-600">Appearance</p>
      <div className="inline-flex rounded-lg border border-paper-700 p-1">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
              value === o.value ? "bg-brand-50 text-brand-700 ring-1 ring-brand-200" : "text-slate-500 hover:bg-paper-300"
            }`}
          >
            <o.icon className="h-3.5 w-3.5" strokeWidth={2} />
            {o.label}
          </button>
        ))}
      </div>
      {value !== "light" && <p className="mt-1.5 text-[11px] text-slate-400">Dark mode is coming soon — Light stays active for now.</p>}
    </div>
  );
}
