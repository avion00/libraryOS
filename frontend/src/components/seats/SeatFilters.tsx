import { ListFilter, Search } from "lucide-react";
import { FilterSelect } from "../students/FilterSelect";
import { SEAT_STATUS_FILTER_OPTIONS } from "./types";

export function SeatFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="relative w-[220px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={2} />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          type="text"
          placeholder="Search seat number..."
          className="h-10 w-full rounded-lg border border-paper-700 bg-white pl-9 pr-3 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </div>
      <div className="relative">
        <ListFilter className="pointer-events-none absolute left-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" strokeWidth={2} />
        <FilterSelect
          className="w-[172px] [&_select]:pl-8"
          options={SEAT_STATUS_FILTER_OPTIONS}
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        />
      </div>
    </div>
  );
}
