import { Moon, Monitor, Sun } from "lucide-react";
import { useTheme, type ThemePreference } from "../../context/ThemeContext";

const OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <p className="mb-1.5 text-[12.5px] font-medium text-slate-600">Appearance</p>
      <div className="inline-flex rounded-lg border border-paper-700 p-1">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setTheme(o.value)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
              theme === o.value ? "bg-brand-50 text-brand-700 ring-1 ring-brand-200" : "text-slate-500 hover:bg-paper-300"
            }`}
          >
            <o.icon className="h-3.5 w-3.5" strokeWidth={2} />
            {o.label}
          </button>
        ))}
      </div>
      <p className="mt-1.5 text-[11px] text-slate-400">
        {theme === "system" ? "Follows your device's appearance setting." : `${theme === "dark" ? "Dark" : "Light"} mode is active.`}
      </p>
    </div>
  );
}
