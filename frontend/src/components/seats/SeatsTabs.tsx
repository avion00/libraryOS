import type { ReactNode } from "react";

export function SeatsTabs({
  tab,
  onChange,
  rightSlot,
}: {
  tab: "map" | "shifts";
  onChange: (tab: "map" | "shifts") => void;
  rightSlot?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-paper-700">
      <div className="flex items-center gap-6">
        {(
          [
            ["map", "Seat Map"],
            ["shifts", "Shifts"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`relative py-2.5 text-[14px] font-semibold transition-colors ${
              tab === key ? "text-brand-600" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {label}
            {tab === key && <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-brand-500" />}
          </button>
        ))}
      </div>
      {rightSlot && <div className="pb-2.5">{rightSlot}</div>}
    </div>
  );
}
