import { useState } from "react";
import { DatabaseBackup, Download } from "lucide-react";
import { api, extractErrorMessage } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { SettingsSectionHeader } from "./SettingsSectionHeader";

type ExportKind = "students" | "memberships" | "payments" | "seats";

const EXPORTS: { kind: ExportKind; label: string }[] = [
  { kind: "students", label: "Students CSV" },
  { kind: "memberships", label: "Memberships CSV" },
  { kind: "payments", label: "Payments CSV" },
  { kind: "seats", label: "Seats CSV" },
];

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function GroupTitle({ children }: { children: string }) {
  return <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-slate-400">{children}</h3>;
}

export function BackupSettings() {
  const { notify } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleExport(kind: ExportKind) {
    setLoading(kind);
    try {
      const resp = await api.get(`/reports/export/${kind}`, { responseType: "blob" });
      downloadBlob(resp.data as Blob, `${kind}.csv`);
    } catch (err) {
      notify(extractErrorMessage(err), "error");
    } finally {
      setLoading(null);
    }
  }

  async function handleBackup() {
    setLoading("backup");
    try {
      const resp = await api.get("/audit/backup", { responseType: "blob" });
      downloadBlob(resp.data as Blob, `libraryos_backup_${new Date().toISOString().slice(0, 10)}.json`);
    } catch (err) {
      notify(extractErrorMessage(err), "error");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-5 sm:p-6">
      <SettingsSectionHeader title="Backup & Data" subtitle="Export, backup and protect your library data." />

      <GroupTitle>Data exports</GroupTitle>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {EXPORTS.map((e) => (
          <button
            key={e.kind}
            onClick={() => handleExport(e.kind)}
            disabled={loading === e.kind}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-paper-700 px-3 text-[12.5px] font-medium text-slate-600 transition-colors hover:border-brand-300 hover:bg-brand-50/40 hover:text-brand-700 disabled:opacity-60"
          >
            <Download className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            {loading === e.kind ? "Exporting…" : e.label}
          </button>
        ))}
      </div>

      <div className="my-6 border-t border-paper-500" />

      <GroupTitle>Full backup</GroupTitle>
      <button
        onClick={handleBackup}
        disabled={loading === "backup"}
        className="flex h-10 w-full max-w-xs items-center justify-center gap-2 rounded-lg border border-paper-700 px-3 text-[12.5px] font-semibold text-slate-700 transition-colors hover:border-brand-300 hover:bg-brand-50/40 hover:text-brand-700 disabled:opacity-60"
      >
        <DatabaseBackup className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
        {loading === "backup" ? "Preparing…" : "Full JSON Backup"}
      </button>

      <div className="my-6 border-t border-paper-500" />

      <GroupTitle>Backup status</GroupTitle>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-slate-600">Scheduled backups</span>
          <span className="inline-flex h-[22px] items-center rounded-full bg-paper-500 px-2 text-[11px] font-semibold text-slate-500">Not configured</span>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-slate-600">Last backup</span>
          <span className="text-slate-400">On-demand only</span>
        </div>
        <p className="text-[11px] text-slate-400">Backups are on-demand only — automatic scheduling isn't set up yet.</p>
      </div>
    </div>
  );
}
