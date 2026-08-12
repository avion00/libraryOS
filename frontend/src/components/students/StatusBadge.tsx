const MAP: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: "bg-emerald-50", text: "text-emerald-600", label: "Active" },
  expired: { bg: "bg-rose-50", text: "text-rose-600", label: "Expired" },
  vacated: { bg: "bg-paper-500", text: "text-slate-500", label: "Vacated" },
  no_membership: { bg: "bg-paper-500", text: "text-slate-500", label: "No membership" },
};

export function StatusBadge({ status }: { status: string }) {
  const entry = MAP[status] ?? { bg: "bg-paper-500", text: "text-slate-500", label: status };
  return (
    <span className={`inline-flex h-[23px] items-center rounded-full px-2.5 text-[11.5px] font-semibold ${entry.bg} ${entry.text}`}>
      {entry.label}
    </span>
  );
}
