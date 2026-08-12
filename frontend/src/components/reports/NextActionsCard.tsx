import { Link } from "react-router-dom";
import { ChevronRight, FileSpreadsheet, Mail, Send } from "lucide-react";
import { useToast } from "../../context/ToastContext";

export function NextActionsCard({ expiringSoonCount, onExport }: { expiringSoonCount: number; onExport: () => void }) {
  const { notify } = useToast();

  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-4 shadow-card">
      <h3 className="text-[13.5px] font-semibold text-slate-900">Next actions</h3>

      <div className="mt-2.5 space-y-1">
        <button
          onClick={() => notify("Reminders aren't sent — email/SMS isn't connected yet.", "info")}
          className="flex w-full items-center gap-3 rounded-lg px-1.5 py-2.5 text-left transition-colors hover:bg-paper-300"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-orange-100">
            <Mail className="h-[17px] w-[17px] text-orange-700" strokeWidth={2.1} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[12.5px] font-semibold text-slate-800">Send reminders</span>
            <span className="block text-[11px] leading-snug text-slate-400">
              Send WhatsApp/Email reminders to {expiringSoonCount} member{expiringSoonCount === 1 ? "" : "s"} expiring in 7 days
            </span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" strokeWidth={2} />
        </button>

        <Link to="/students" className="flex w-full items-center gap-3 rounded-lg px-1.5 py-2.5 text-left transition-colors hover:bg-paper-300">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-paper-700">
            <Send className="h-[17px] w-[17px] text-ink-700" strokeWidth={2.1} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[12.5px] font-semibold text-slate-800">Review memberships</span>
            <span className="block text-[11px] leading-snug text-slate-400">Check and confirm upcoming renewals</span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" strokeWidth={2} />
        </Link>

        <button onClick={onExport} className="flex w-full items-center gap-3 rounded-lg px-1.5 py-2.5 text-left transition-colors hover:bg-paper-300">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-emerald-100">
            <FileSpreadsheet className="h-[17px] w-[17px] text-emerald-600" strokeWidth={2.1} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[12.5px] font-semibold text-slate-800">Export expiry list</span>
            <span className="block text-[11px] leading-snug text-slate-400">Download expiring memberships as CSV</span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
