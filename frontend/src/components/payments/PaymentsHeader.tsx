import { Download } from "lucide-react";

export function PaymentsHeader({ onExport, exporting }: { onExport: () => void; exporting: boolean }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-[26px] font-bold leading-tight text-slate-900">Payments</h1>
        <p className="mt-0.5 text-[13.5px] text-slate-500">Every payment ever recorded — nothing is deleted, only added to</p>
      </div>
      <button
        onClick={onExport}
        disabled={exporting}
        className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand-400 px-4 text-sm font-semibold text-ink-900 shadow-card transition-colors hover:bg-brand-500 disabled:opacity-60"
      >
        <Download className="h-4 w-4" strokeWidth={2.2} />
        {exporting ? "Exporting…" : "Export CSV"}
      </button>
    </div>
  );
}
