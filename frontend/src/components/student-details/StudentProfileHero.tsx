import { useRef } from "react";
import { Armchair, Badge, Calendar, Camera, CalendarDays, IndianRupee, Mail, Phone } from "lucide-react";
import type { CurrentMembership, Student } from "../../api/types";
import { Avatar } from "../dashboard/Avatar";
import { StatusBadge } from "../students/StatusBadge";
import { FeeBadge } from "../students/FeeBadge";
import { formatDate, formatMoney } from "../../lib/format";
import { StudentSummaryTile } from "./StudentSummaryTile";

export function StudentProfileHero({
  student,
  status,
  current,
  currencySymbol,
  onPhotoSelected,
  photoUploading,
}: {
  student: Student;
  status: string;
  current: CurrentMembership | null;
  currencySymbol: string;
  onPhotoSelected: (file: File) => void;
  photoUploading: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    onPhotoSelected(file);
  }

  const shiftLabel = current?.shifts.length ? current.shifts.map((s) => s.name).join(", ") : "—";

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-paper-700 bg-white p-5 shadow-card sm:flex-row sm:items-center sm:p-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative shrink-0">
          {student.photo ? (
            <img
              src={student.photo}
              alt={student.full_name}
              className="h-[100px] w-[100px] rounded-full object-cover"
            />
          ) : (
            <Avatar name={student.full_name} size={100} />
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={photoUploading}
            aria-label="Change student photo"
            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brand-400 text-ink-900 shadow-sm transition-colors hover:bg-brand-500 disabled:opacity-60"
          >
            <Camera className="h-3.5 w-3.5" strokeWidth={2.3} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-[26px] font-bold leading-tight text-slate-900 sm:text-[28px]">{student.full_name}</h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Badge className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
              {student.student_code}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
              {student.phone}
            </span>
            {student.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
                {student.email}
              </span>
            )}
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <StatusBadge status={status} />
            {current && <FeeBadge status={current.payment_status} />}
          </div>
        </div>
      </div>

      <div className="grid w-full shrink-0 grid-cols-2 gap-2.5 sm:w-[380px]">
        <StudentSummaryTile icon={CalendarDays} label="Shift" value={shiftLabel} />
        <StudentSummaryTile icon={IndianRupee} label="Monthly Fee" value={current ? formatMoney(current.monthly_fee, currencySymbol) : "—"} />
        <StudentSummaryTile icon={Calendar} label="Joined On" value={formatDate(student.joining_date)} />
        <StudentSummaryTile
          icon={Armchair}
          label="Seat Status"
          value={current ? `Seat ${current.seat_number}` : "Not assigned"}
          accent={current ? undefined : "orange"}
        />
      </div>
    </div>
  );
}
