import { CalendarDays, Download } from "lucide-react";
import { FilterSelect } from "../students/FilterSelect";
import { METHOD_FILTER_OPTIONS } from "../payments/types";
import { TIMEFRAME_OPTIONS } from "./types";

export function CollectionsFilterBar({
  timeframe,
  onTimeframeChange,
  method,
  onMethodChange,
  customFrom,
  onCustomFromChange,
  customTo,
  onCustomToChange,
  onExport,
  exporting,
}: {
  timeframe: string;
  onTimeframeChange: (v: string) => void;
  method: string;
  onMethodChange: (v: string) => void;
  customFrom: string;
  onCustomFromChange: (v: string) => void;
  customTo: string;
  onCustomToChange: (v: string) => void;
  onExport: () => void;
  exporting: boolean;
}) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-paper-700 bg-white p-4 shadow-card">
      <div>
        <label className="mb-1.5 block text-[11.5px] font-medium text-slate-500">Timeframe</label>
        <div className="relative w-[180px]">
          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={2} />
          <FilterSelect className="[&_select]:pl-9" options={TIMEFRAME_OPTIONS} value={timeframe} onChange={(e) => onTimeframeChange(e.target.value)} />
        </div>
      </div>

      {timeframe === "custom" && (
        <>
          <div>
            <label className="mb-1.5 block text-[11.5px] font-medium text-slate-500">From</label>
            <input
              type="date"
              value={customFrom}
              onChange={(e) => onCustomFromChange(e.target.value)}
              className="h-10 w-[152px] rounded-lg border border-paper-700 bg-white px-3 text-[13px] text-slate-600 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11.5px] font-medium text-slate-500">To</label>
            <input
              type="date"
              value={customTo}
              onChange={(e) => onCustomToChange(e.target.value)}
              className="h-10 w-[152px] rounded-lg border border-paper-700 bg-white px-3 text-[13px] text-slate-600 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </>
      )}

      <div>
        <label className="mb-1.5 block text-[11.5px] font-medium text-slate-500">Payment method</label>
        <FilterSelect className="w-[160px]" options={METHOD_FILTER_OPTIONS} value={method} onChange={(e) => onMethodChange(e.target.value)} />
      </div>

      <button
        onClick={onExport}
        disabled={exporting}
        className="ml-auto inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand-400 px-4 text-sm font-semibold text-ink-900 shadow-card transition-colors hover:bg-brand-500 disabled:opacity-60"
      >
        <Download className="h-4 w-4" strokeWidth={2.2} />
        {exporting ? "Exporting…" : "Export payments CSV"}
      </button>
    </div>
  );
}
