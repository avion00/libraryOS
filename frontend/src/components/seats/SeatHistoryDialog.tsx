import { useId } from "react";
import { useQuery } from "@tanstack/react-query";
import { History, X } from "lucide-react";
import { auditApi } from "../../api/endpoints";
import { formatDateTime } from "../../lib/format";
import { DialogShell } from "../ui";
import type { AuditLogEntry } from "./types";

const ACTION_LABEL: Record<string, string> = {
  create_seat: "Seat created",
  update_seat: "Seat updated",
  delete_seat: "Seat deleted",
};

export function SeatHistoryDialog({ open, onClose, seatId, seatNumber }: { open: boolean; onClose: () => void; seatId: number; seatNumber: number }) {
  const titleId = useId();

  const { data, isLoading } = useQuery({
    queryKey: ["audit", "seat", seatId],
    queryFn: () => auditApi.logs({ model_name: "Seat", page_size: 100 }).then((r) => r.data.results as AuditLogEntry[]),
    enabled: open,
  });

  const entries = (data ?? []).filter((e) => e.object_id === String(seatId));

  return (
    <DialogShell open={open} onClose={onClose} widthClass="max-w-md" labelledBy={titleId}>
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 id={titleId} className="flex items-center gap-2 text-[16px] font-bold text-slate-900">
            <History className="h-4 w-4 text-slate-400" strokeWidth={2} />
            Seat {seatNumber} history
          </h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-paper-500 hover:text-slate-600" aria-label="Close">
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {isLoading ? (
          <p className="py-8 text-center text-[12.5px] text-slate-400">Loading…</p>
        ) : entries.length === 0 ? (
          <p className="py-8 text-center text-[12.5px] text-slate-400">No recorded activity for this seat yet.</p>
        ) : (
          <div className="max-h-80 space-y-3 overflow-y-auto">
            {entries.map((entry) => (
              <div key={entry.id} className="rounded-lg border border-paper-700 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-slate-800">{ACTION_LABEL[entry.action] ?? entry.action}</span>
                  <span className="text-[11px] text-slate-400">{formatDateTime(entry.created_at)}</span>
                </div>
                <p className="mt-0.5 text-[11.5px] text-slate-400">by {entry.username ?? "System"}</p>
                {Object.keys(entry.changes ?? {}).length > 0 && (
                  <p className="mt-1.5 truncate text-[11px] text-slate-400">
                    {Object.entries(entry.changes)
                      .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
                      .join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DialogShell>
  );
}
