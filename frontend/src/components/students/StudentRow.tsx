import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, MoreVertical, Pencil, Phone, Trash2 } from "lucide-react";
import type { Student } from "../../api/types";
import { formatDate } from "../../lib/format";
import { Avatar } from "../dashboard/Avatar";
import { StatusBadge } from "./StatusBadge";
import { FeeBadge } from "./FeeBadge";

export function StudentRow({
  student,
  selected,
  onToggleSelect,
  onEdit,
  onDeleteRequest,
}: {
  student: Student;
  selected: boolean;
  onToggleSelect: (id: number) => void;
  onEdit: (student: Student) => void;
  onDeleteRequest: (student: Student) => void;
}) {
  const navigate = useNavigate();
  const membership = student.summary.current_membership;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <tr className="group cursor-pointer transition-colors hover:bg-paper-300/70" onClick={() => navigate(`/students/${student.id}`)}>
      <td className="w-10 px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(student.id)}
          className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-400"
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar name={student.full_name} size={32} />
          <div className="min-w-0">
            <Link
              to={`/students/${student.id}`}
              onClick={(e) => e.stopPropagation()}
              className="block truncate text-[13.5px] font-semibold text-slate-800 hover:text-brand-600"
            >
              {student.full_name}
            </Link>
            <p className="text-[11.5px] text-slate-400">{student.student_code}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="flex items-center gap-1.5 text-[13px] text-slate-600">
          <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" strokeWidth={2} />
          {student.phone}
        </span>
      </td>
      <td className="px-4 py-3 text-[13px]">
        {membership ? (
          <div>
            <p className="font-medium text-slate-700">Seat {membership.seat_number}</p>
            <p className="text-[11.5px] text-slate-400">{membership.shifts.map((s) => s.name).join(", ")}</p>
          </div>
        ) : (
          <span className="text-slate-300">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-[13px] text-slate-600">{membership ? formatDate(membership.expiry_date) : <span className="text-slate-300">—</span>}</td>
      <td className="px-4 py-3">
        <FeeBadge status={membership?.payment_status ?? null} balanceDue={membership?.balance_due} />
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={student.summary.status} />
      </td>
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1">
          <Link
            to={`/students/${student.id}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
            aria-label="View student"
          >
            <Eye className="h-[15px] w-[15px]" strokeWidth={2} />
          </Link>
          <button
            onClick={() => onEdit(student)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
            aria-label="Edit student"
          >
            <Pencil className="h-[15px] w-[15px]" strokeWidth={2} />
          </button>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-paper-500 hover:text-slate-600"
              aria-label="More actions"
            >
              <MoreVertical className="h-[15px] w-[15px]" strokeWidth={2} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-9 z-20 w-40 rounded-lg border border-paper-700 bg-white p-1 shadow-card-hover">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDeleteRequest(student);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[12.5px] text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                  Delete student
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
