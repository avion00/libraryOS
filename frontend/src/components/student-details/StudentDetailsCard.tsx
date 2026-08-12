import { UserRound } from "lucide-react";
import type { Student } from "../../api/types";
import { formatDate } from "../../lib/format";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12px] font-medium text-slate-400">{label}</p>
      <p className="mt-1 text-[13.5px] text-slate-800">{value || <span className="text-slate-300">—</span>}</p>
    </div>
  );
}

export function StudentDetailsCard({ student }: { student: Student }) {
  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <UserRound className="h-[18px] w-[18px] text-brand-500" strokeWidth={2.1} />
        <h2 className="text-[15px] font-semibold text-slate-900">Student Details</h2>
      </div>
      <div className="space-y-3.5">
        <Row label="Address" value={student.address} />
        <Row label="Joining Date" value={formatDate(student.joining_date)} />
        <Row label="Registered On" value={formatDate(student.created_at)} />
        <Row label="Notes" value={student.notes} />
      </div>
    </div>
  );
}
