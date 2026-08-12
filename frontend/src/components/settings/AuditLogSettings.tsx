import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { auditApi } from "../../api/endpoints";
import { formatDateTime } from "../../lib/format";
import { SettingsSectionHeader } from "./SettingsSectionHeader";
import { ReportsPagination } from "../reports/ReportsPagination";
import type { AuditLogEntry } from "../seats/types";

const ACTION_LABEL: Record<string, string> = {
  login: "Signed in",
  create_student: "Student created",
  update_student: "Student updated",
  delete_student: "Student deleted",
  create_seat: "Seat created",
  update_seat: "Seat updated",
  delete_seat: "Seat deleted",
  record_payment: "Payment recorded",
  update_settings: "Settings updated",
  export_backup: "Backup exported",
};

export function AuditLogSettings() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["audit", "settings-page", page],
    queryFn: () => auditApi.logs({ page, page_size: pageSize }).then((r) => r.data as { count: number; results: AuditLogEntry[] }),
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-paper-700 bg-white">
      <div className="p-5 pb-0 sm:p-6 sm:pb-0">
        <SettingsSectionHeader title="Audit Logs" subtitle="Review recent administrator activity." />
      </div>

      {isLoading ? (
        <p className="py-14 text-center text-[13px] text-slate-400">Loading…</p>
      ) : error || !data ? (
        <div className="flex flex-col items-center gap-3 py-14 text-center">
          <p className="text-[13px] text-slate-500">Audit logs are not currently available.</p>
          <button onClick={() => refetch()} className="rounded-lg border border-paper-700 px-3.5 py-1.5 text-[12.5px] font-medium text-slate-600 hover:bg-paper-300">
            Retry
          </button>
        </div>
      ) : data.results.length === 0 ? (
        <p className="py-14 text-center text-[13px] text-slate-400">No recorded activity yet.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-paper-300/80">
                <tr>
                  {["Action", "User", "Target", "Time"].map((c) => (
                    <th key={c} className="whitespace-nowrap px-6 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-500">
                {data.results.map((entry) => (
                  <tr key={entry.id} className="transition-colors hover:bg-paper-300/70">
                    <td className="px-6 py-3 text-[13px] font-medium text-slate-800">{ACTION_LABEL[entry.action] ?? entry.action}</td>
                    <td className="px-6 py-3 text-[13px] text-slate-600">{entry.username ?? "System"}</td>
                    <td className="px-6 py-3 text-[13px] text-slate-500">
                      {entry.model_name}
                      {entry.object_id && ` #${entry.object_id}`}
                    </td>
                    <td className="px-6 py-3 text-[12.5px] text-slate-400">{formatDateTime(entry.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ReportsPagination page={page} pageSize={pageSize} totalItems={data.count} itemLabel="entries" onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
