import { Check, Plus } from "lucide-react";
import { ACCENT_COLORS } from "./types";

export function AccentColorPicker({ value, onChange }: { value: string; onChange: (key: string) => void }) {
  return (
    <div>
      <p className="mb-1.5 text-[12.5px] font-medium text-slate-600">Accent Color</p>
      <div className="flex flex-wrap items-center gap-2">
        {ACCENT_COLORS.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => onChange(c.key)}
            aria-label={`${c.key} accent`}
            aria-pressed={value === c.key}
            className="relative flex h-8 w-8 items-center justify-center rounded-full ring-offset-2 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            style={{ backgroundColor: c.hex, boxShadow: value === c.key ? `0 0 0 2px white, 0 0 0 4px ${c.hex}` : undefined }}
          >
            {value === c.key && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
          </button>
        ))}
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-slate-300 text-slate-300">
          <Plus className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>
      <p className="mt-1.5 text-[11px] text-slate-400">Applies once dynamic theming ships — the app uses Orange today.</p>
    </div>
  );
}
