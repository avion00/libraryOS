import type { SeatMapEntry } from "../../api/types";
import { computeSeatStatus, SEAT_STATUS_META } from "./types";

export function SeatCard({ entry, onOpen }: { entry: SeatMapEntry; onOpen: (entry: SeatMapEntry, el: HTMLButtonElement) => void }) {
  const status = computeSeatStatus(entry);
  const meta = SEAT_STATUS_META[status];

  return (
    <button
      onClick={(e) => onOpen(entry, e.currentTarget)}
      className="flex h-[78px] flex-col items-center justify-center gap-1 rounded-[11px] border border-paper-700 bg-white transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50/40 hover:shadow-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
    >
      <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
      <span className="text-[13.5px] font-semibold text-slate-800">Seat {entry.seat.number}</span>
      <span className="text-[12px] text-slate-400">
        {entry.seat.status === "disabled" ? "Disabled" : `${entry.occupied_count}/${entry.total_shifts}`}
      </span>
    </button>
  );
}
