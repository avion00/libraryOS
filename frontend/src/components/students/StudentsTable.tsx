import { useEffect, useRef } from "react";
import { Search } from "lucide-react";
import type { Student } from "../../api/types";
import { StudentRow } from "./StudentRow";

const COLUMNS = ["Student", "Phone", "Seat / Shifts", "Expiry", "Fee Status", "Status", "Actions"];

export function StudentsTable({
  students,
  selectedIds,
  allSelected,
  someSelected,
  onToggleSelect,
  onToggleAll,
  onEdit,
  onDeleteRequest,
  onClearFilters,
}: {
  students: Student[];
  selectedIds: Set<number>;
  allSelected: boolean;
  someSelected: boolean;
  onToggleSelect: (id: number) => void;
  onToggleAll: () => void;
  onEdit: (student: Student) => void;
  onDeleteRequest: (student: Student) => void;
  onClearFilters: () => void;
}) {
  const headerCheckboxRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (headerCheckboxRef.current) headerCheckboxRef.current.indeterminate = someSelected && !allSelected;
  }, [someSelected, allSelected]);

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper-500 text-slate-400">
          <Search className="h-5 w-5" strokeWidth={2} />
        </span>
        <div>
          <p className="text-[14px] font-semibold text-slate-700">No students found</p>
          <p className="mt-0.5 text-[13px] text-slate-400">Try adjusting your search or filters.</p>
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
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-paper-300/80">
          <tr>
            <th className="w-10 px-4 py-2.5">
              <input
                ref={headerCheckboxRef}
                type="checkbox"
                checked={allSelected}
                onChange={onToggleAll}
                className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-400"
                aria-label="Select all students on this page"
              />
            </th>
            {COLUMNS.map((c) => (
              <th key={c} className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-paper-500">
          {students.map((s) => (
            <StudentRow
              key={s.id}
              student={s}
              selected={selectedIds.has(s.id)}
              onToggleSelect={onToggleSelect}
              onEdit={onEdit}
              onDeleteRequest={onDeleteRequest}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
