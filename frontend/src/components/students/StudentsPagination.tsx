import { ChevronLeft, ChevronRight } from "lucide-react";
import { FilterSelect } from "./FilterSelect";
import { PAGE_SIZE_OPTIONS } from "./types";

function pageWindow(page: number, totalPages: number, size = 5): number[] {
  let start = Math.max(1, page - Math.floor(size / 2));
  const end = Math.min(totalPages, start + size - 1);
  start = Math.max(1, end - size + 1);
  const out: number[] = [];
  for (let p = start; p <= end; p++) out.push(p);
  return out;
}

export function StudentsPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);
  const pages = pageWindow(page, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-paper-500 px-4 py-3">
      <p className="text-[12.5px] text-slate-500">
        Showing {from} to {to} of {totalItems} students
      </p>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-paper-500 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[12.5px] font-semibold transition-colors ${
                p === page ? "bg-brand-400 text-ink-900" : "text-slate-500 hover:bg-paper-500"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-paper-500 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <FilterSelect
          className="w-[108px]"
          options={PAGE_SIZE_OPTIONS.map((n) => ({ value: String(n), label: `${n} / page` }))}
          value={String(pageSize)}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
