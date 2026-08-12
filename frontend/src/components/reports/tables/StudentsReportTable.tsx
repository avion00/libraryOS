import { Link } from "react-router-dom";
import type { Student } from "../../../api/types";
import { formatDate, formatMoney } from "../../../lib/format";
import { Avatar } from "../../dashboard/Avatar";
import { ReportStudentStatusBadge } from "../ReportStudentStatusBadge";

const COLUMNS = ["Student", "Membership Status", "Seat", "Joined / Renewal", "Last Payment"];

export function StudentsReportTable({
  students,
  lastPaymentByStudent,
}: {
  students: Student[];
  lastPaymentByStudent: Map<number, { date: string; amount: number }>;
}) {
  if (students.length === 0) {
    return <p className="py-14 text-center text-[13px] text-slate-400">No students found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-paper-300/80">
          <tr>
            {COLUMNS.map((c) => (
              <th key={c} className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-paper-500">
          {students.map((s) => {
            const m = s.summary.current_membership;
            const lastPayment = lastPaymentByStudent.get(s.id);
            return (
              <tr key={s.id} className="transition-colors hover:bg-paper-300/70">
                <td className="px-4 py-3">
                  <Link to={`/students/${s.id}`} className="flex items-center gap-2.5 hover:text-brand-600">
                    <Avatar name={s.full_name} size={30} />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-slate-800">{s.full_name}</p>
                      <p className="text-[11px] text-slate-400">{s.student_code}</p>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <ReportStudentStatusBadge status={s.summary.status} />
                </td>
                <td className="px-4 py-3 text-[13px] text-slate-600">{m ? `Seat ${m.seat_number}` : "—"}</td>
                <td className="px-4 py-3 text-[13px] text-slate-600">{m ? formatDate(m.start_date) : "—"}</td>
                <td className="px-4 py-3 text-[13px] text-slate-600">
                  {lastPayment ? (
                    <>
                      {formatDate(lastPayment.date)} <span className="text-slate-400">/ {formatMoney(lastPayment.amount)}</span>
                    </>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
