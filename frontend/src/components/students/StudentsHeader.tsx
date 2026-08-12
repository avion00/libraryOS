import { Plus } from "lucide-react";

export function StudentsHeader({ onAddStudent }: { onAddStudent: () => void }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-[26px] font-bold leading-tight text-slate-900">Students</h1>
        <p className="mt-0.5 text-[13.5px] text-slate-500">Search, filter, and manage student memberships</p>
      </div>
      <button
        onClick={onAddStudent}
        className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand-400 px-4 text-sm font-semibold text-ink-900 shadow-card transition-colors hover:bg-brand-500"
      >
        <Plus className="h-4 w-4" strokeWidth={2.4} />
        Add student
      </button>
    </div>
  );
}
