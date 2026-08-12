import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download } from "lucide-react";

export function BulkActions({
  allSelected,
  someSelected,
  onToggleAll,
  selectedCount,
  onExportSelected,
}: {
  allSelected: boolean;
  someSelected: boolean;
  onToggleAll: () => void;
  selectedCount: number;
  onExportSelected: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) checkboxRef.current.indeterminate = someSelected && !allSelected;
  }, [someSelected, allSelected]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="flex items-center gap-3 border-b border-paper-500 bg-paper-300/60 px-4 py-2.5">
      <input
        ref={checkboxRef}
        type="checkbox"
        checked={allSelected}
        onChange={onToggleAll}
        className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-400"
        aria-label="Select all students on this page"
      />

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          disabled={selectedCount === 0}
          className="flex items-center gap-1.5 rounded-lg border border-paper-700 bg-white px-2.5 py-1.5 text-[12.5px] font-medium text-slate-600 hover:bg-paper-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Bulk actions
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
        {open && selectedCount > 0 && (
          <div className="absolute left-0 top-9 z-20 w-44 rounded-lg border border-paper-700 bg-white p-1 shadow-card-hover">
            <button
              onClick={() => {
                onExportSelected();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[12.5px] text-slate-600 hover:bg-paper-300"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={2} />
              Export selected
            </button>
          </div>
        )}
      </div>

      <span className="text-[12.5px] text-slate-400">{selectedCount} selected</span>
    </div>
  );
}
