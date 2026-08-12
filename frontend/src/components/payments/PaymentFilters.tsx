import { CalendarDays, Search } from "lucide-react";
import { FilterSelect } from "../students/FilterSelect";
import { METHOD_FILTER_OPTIONS, STATUS_FILTER_OPTIONS } from "./types";

function DateField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative w-full sm:w-[152px]">
      <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={2} />
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-paper-700 bg-white pl-9 pr-2.5 text-[13px] text-slate-600 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />
    </div>
  );
}

export function PaymentFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  method,
  onMethodChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  method: string;
  onMethodChange: (v: string) => void;
  fromDate: string;
  onFromDateChange: (v: string) => void;
  toDate: string;
  onToDateChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 border-b border-paper-500 p-4">
      <div className="relative min-w-[200px] flex-1 basis-[26%]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={2} />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          type="text"
          placeholder="Search receipt, student…"
          className="h-10 w-full rounded-lg border border-paper-700 bg-white pl-9 pr-3 text-[13.5px] text-slate-700 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <FilterSelect className="w-[142px]" options={STATUS_FILTER_OPTIONS} value={status} onChange={(e) => onStatusChange(e.target.value)} />
      <FilterSelect className="w-[150px]" options={METHOD_FILTER_OPTIONS} value={method} onChange={(e) => onMethodChange(e.target.value)} />
      <DateField value={fromDate} onChange={onFromDateChange} placeholder="From date" />
      <DateField value={toDate} onChange={onToDateChange} placeholder="To date" />
    </div>
  );
}
