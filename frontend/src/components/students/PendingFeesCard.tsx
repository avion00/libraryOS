import { Link } from "react-router-dom";
import { ArrowRight, WalletCards } from "lucide-react";
import { formatMoney } from "../../lib/format";

export function PendingFeesCard({ totalDue, studentsCount }: { totalDue: number; studentsCount: number }) {
  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-[13.5px] font-semibold text-slate-900">Pending Fee Collection</h3>
          <p className="mt-2 text-[24px] font-bold leading-none text-red-600">{formatMoney(totalDue)}</p>
          <p className="mt-1.5 text-[12px] text-slate-400">From {studentsCount} students</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-rose-50">
          <WalletCards className="h-[18px] w-[18px] text-rose-500" strokeWidth={2.1} />
        </span>
      </div>

      <Link to="/reports" className="mt-3 flex items-center gap-1 text-[12px] font-semibold text-brand-600 hover:text-brand-700">
        View details
        <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
      </Link>
    </div>
  );
}
