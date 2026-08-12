import { SEAT_STATUS_META, type SeatComputedStatus } from "./types";

const ORDER: SeatComputedStatus[] = ["available", "partial", "full", "disabled"];

export function SeatLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-[12px] text-slate-500">
      {ORDER.map((key) => (
        <span key={key} className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${SEAT_STATUS_META[key].dot}`} />
          {SEAT_STATUS_META[key].label}
        </span>
      ))}
    </div>
  );
}
