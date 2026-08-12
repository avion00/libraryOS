import { FilterSelect } from "../students/FilterSelect";

const DAYS_OPTIONS = [
  { value: "7", label: "7 days" },
  { value: "14", label: "14 days" },
  { value: "30", label: "30 days" },
  { value: "60", label: "60 days" },
  { value: "90", label: "90 days" },
];

export function ExpiryFilterBar({ days, onDaysChange }: { days: number; onDaysChange: (d: number) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-paper-700 bg-white p-4 shadow-card">
      <label className="text-[13.5px] text-slate-600">Show memberships expiring within</label>
      <FilterSelect className="w-[140px]" options={DAYS_OPTIONS} value={String(days)} onChange={(e) => onDaysChange(Number(e.target.value))} />
    </div>
  );
}
