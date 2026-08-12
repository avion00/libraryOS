import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRightLeft, DoorOpen, MoreVertical, Pencil, Printer, Trash2, UserPlus } from "lucide-react";
import { Button } from "../ui";

export function StudentDetailsActions({
  hasActiveMembership,
  onEdit,
  onAssignSeat,
  onRenew,
  onChangeSeatShift,
  onVacate,
  onDelete,
}: {
  hasActiveMembership: boolean;
  onEdit: () => void;
  onAssignSeat: () => void;
  onRenew: () => void;
  onChangeSeatShift: () => void;
  onVacate: () => void;
  onDelete: () => void;
}) {
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
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Link
        to="/students"
        className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-brand-600 hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
        Back to students
      </Link>

      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
          Edit
        </Button>
        {hasActiveMembership ? (
          <Button size="sm" onClick={onRenew}>
            Renew
          </Button>
        ) : (
          <Button size="sm" onClick={onAssignSeat}>
            <UserPlus className="h-3.5 w-3.5" strokeWidth={2.2} />
            Assign seat
          </Button>
        )}
        <div className="relative" ref={menuRef}>
          <Button variant="secondary" size="sm" onClick={() => setMenuOpen((v) => !v)} aria-label="More actions" aria-haspopup="menu" aria-expanded={menuOpen}>
            <MoreVertical className="h-3.5 w-3.5" strokeWidth={2} />
            More
          </Button>
          {menuOpen && (
            <div role="menu" className="absolute right-0 top-10 z-20 w-52 rounded-xl border border-paper-700 bg-white p-1.5 shadow-card-hover">
              {hasActiveMembership && (
                <button
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onChangeSeatShift();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] text-slate-600 hover:bg-paper-300"
                >
                  <ArrowRightLeft className="h-3.5 w-3.5" strokeWidth={2} /> Change seat/shift
                </button>
              )}
              {hasActiveMembership && (
                <button
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onVacate();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] text-slate-600 hover:bg-paper-300"
                >
                  <DoorOpen className="h-3.5 w-3.5" strokeWidth={2} /> Vacate seat
                </button>
              )}
              <button
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  window.print();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] text-slate-600 hover:bg-paper-300"
              >
                <Printer className="h-3.5 w-3.5" strokeWidth={2} /> Print profile
              </button>
              <div className="my-1 border-t border-paper-500" />
              <button
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={2} /> Delete student
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
