import { Download, Search } from "lucide-react";
import { FilterSelect } from "./FilterSelect";
import { PRIMARY_STATUS_OPTIONS, SECONDARY_STATUS_OPTIONS, SHIFT_OPTIONS } from "./types";

const SHIFT_SELECT_OPTIONS = [{ value: "", label: "All shifts" }, ...SHIFT_OPTIONS.map((s) => ({ value: s, label: s }))];

export function StudentFilters({
  search,
  onSearchChange,
  primaryStatus,
  onPrimaryStatusChange,
  secondaryStatus,
  onSecondaryStatusChange,
  shift,
  onShiftChange,
  onExport,
  exporting,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  primaryStatus: string;
  onPrimaryStatusChange: (v: string) => void;
  secondaryStatus: string;
  onSecondaryStatusChange: (v: string) => void;
  shift: string;
  onShiftChange: (v: string) => void;
  onExport: () => void;
  exporting: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 border-b border-paper-500 p-4">
      <div className="relative min-w-[220px] flex-1 basis-[42%]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={2} />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          type="text"
          placeholder="Search by name, phone, or student ID..."
          className="h-10 w-full rounded-lg border border-paper-700 bg-white pl-9 pr-3 text-[13.5px] text-slate-700 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <FilterSelect
        className="w-[150px]"
        options={PRIMARY_STATUS_OPTIONS}
        value={primaryStatus}
        onChange={(e) => onPrimaryStatusChange(e.target.value)}
      />
      <FilterSelect
        className="w-[170px]"
        options={SECONDARY_STATUS_OPTIONS}
        value={secondaryStatus}
        onChange={(e) => onSecondaryStatusChange(e.target.value)}
      />
      <FilterSelect className="w-[140px]" options={SHIFT_SELECT_OPTIONS} value={shift} onChange={(e) => onShiftChange(e.target.value)} />

      <button
        onClick={onExport}
        disabled={exporting}
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-paper-700 px-3.5 text-[13.5px] font-medium text-slate-600 transition-colors hover:bg-paper-300 disabled:opacity-60"
      >
        <Download className="h-4 w-4" strokeWidth={2} />
        {exporting ? "Exporting…" : "Export"}
      </button>
    </div>
  );
}
