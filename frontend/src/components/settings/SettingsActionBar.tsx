import { RotateCcw, Save } from "lucide-react";

export function SettingsActionBar({
  dirty,
  saving,
  onReset,
  onCancel,
  onSave,
}: {
  dirty: boolean;
  saving: boolean;
  onReset: () => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-paper-700 bg-white/95 px-4 py-3.5 backdrop-blur sm:-mx-6 sm:px-6">
      <span className="text-[12.5px] font-medium text-amber-600">{dirty && "Unsaved changes"}</span>
      <div className="ml-auto flex items-center gap-2.5">
        <button
          onClick={onReset}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-paper-700 px-4 text-[13px] font-medium text-slate-600 transition-colors hover:bg-paper-300"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
          Reset to defaults
        </button>
        <button
          onClick={onCancel}
          disabled={!dirty}
          className="inline-flex h-10 items-center rounded-lg border border-paper-700 px-4 text-[13px] font-medium text-slate-600 transition-colors hover:bg-paper-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={!dirty || saving}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand-400 px-4 text-[13px] font-semibold text-ink-900 shadow-card transition-colors hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" strokeWidth={2} />
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>
    </div>
  );
}
