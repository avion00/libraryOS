const MAP: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: "bg-emerald-50", text: "text-emerald-600", label: "Active" },
  expired: { bg: "bg-red-50", text: "text-red-600", label: "Expired" },
  vacated: { bg: "bg-paper-500", text: "text-ink-300", label: "Vacated" },
  no_membership: { bg: "bg-paper-500", text: "text-slate-500", label: "Never Booked" },
};

export function ReportStudentStatusBadge({ status }: { status: string }) {
  const meta = MAP[status] ?? { bg: "bg-paper-500", text: "text-slate-500", label: status };
  return (
    <span className={`inline-flex h-[23px] items-center rounded-full px-2.5 text-[11.5px] font-semibold ${meta.bg} ${meta.text}`}>
      {meta.label}
    </span>
  );
}
