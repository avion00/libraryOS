import { ChevronLeft, ChevronRight } from "lucide-react";
import { FilterSelect } from "../students/FilterSelect";

function buildPageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = Array.from(pages)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}

export function ReportsPagination({
  page,
  pageSize,
  totalItems,
  itemLabel,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
}: {
  page: number;
  pageSize: number;
  totalItems: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);
  const pages = buildPageList(page, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-paper-500 px-4 py-3">
      <p className="text-[12.5px] text-slate-500">
        Showing {from} to {to} of {totalItems} {itemLabel}
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
          {pages.map((p, i) =>
            p === "…" ? (
              <span key={`ellipsis-${i}`} className="flex h-8 w-6 items-center justify-center text-[12.5px] text-slate-300">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[12.5px] font-semibold transition-colors ${
                  p === page ? "bg-brand-400 text-ink-900" : "text-slate-500 hover:bg-paper-500"
                }`}
              >
                {p}
              </button>
            )
          )}
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-paper-500 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {onPageSizeChange && (
          <FilterSelect
            className="w-[108px]"
            options={pageSizeOptions.map((n) => ({ value: String(n), label: `${n} / page` }))}
            value={String(pageSize)}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          />
        )}
      </div>
    </div>
  );
}
