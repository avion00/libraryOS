import { Search } from "lucide-react";
import type { SeatMapEntry } from "../../api/types";
import { SeatCard } from "./SeatCard";

export function SeatGrid({
  entries,
  onOpenSeat,
  onClearFilters,
}: {
  entries: SeatMapEntry[];
  onOpenSeat: (entry: SeatMapEntry, el: HTMLButtonElement) => void;
  onClearFilters: () => void;
}) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper-500 text-slate-400">
          <Search className="h-5 w-5" strokeWidth={2} />
        </span>
        <div>
          <p className="text-[14px] font-semibold text-slate-700">No seats found</p>
          <p className="mt-0.5 text-[13px] text-slate-400">Try adjusting the status filter.</p>
        </div>
        <button
          onClick={onClearFilters}
          className="mt-1 rounded-lg border border-paper-700 px-3.5 py-1.5 text-[12.5px] font-medium text-slate-600 hover:bg-paper-300"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8">
      {entries.map((entry) => (
        <SeatCard key={entry.seat.id} entry={entry} onOpen={onOpenSeat} />
      ))}
    </div>
  );
}
