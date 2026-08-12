export type ReportTab = "collections" | "occupancy" | "students" | "pending-fees" | "expiry";

export const REPORT_TABS: { key: ReportTab; label: string }[] = [
  { key: "collections", label: "Collections" },
  { key: "occupancy", label: "Occupancy" },
  { key: "students", label: "Students" },
  { key: "pending-fees", label: "Pending Fees" },
  { key: "expiry", label: "Expiry" },
];

export const TIMEFRAME_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "last_month", label: "Last month" },
  { value: "last_30", label: "Last 30 days" },
  { value: "year", label: "This year" },
  { value: "custom", label: "Custom range" },
] as const;

function toIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function computeTimeframeRange(key: string, customFrom?: string, customTo?: string): { from: string; to: string } {
  const today = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  switch (key) {
    case "today":
      return { from: toIso(today), to: toIso(today) };
    case "week": {
      const day = today.getDay();
      const diffToMonday = (day + 6) % 7;
      const start = startOfDay(today);
      start.setDate(start.getDate() - diffToMonday);
      return { from: toIso(start), to: toIso(today) };
    }
    case "month": {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: toIso(start), to: toIso(today) };
    }
    case "last_month": {
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0);
      return { from: toIso(start), to: toIso(end) };
    }
    case "last_30": {
      const start = startOfDay(today);
      start.setDate(start.getDate() - 29);
      return { from: toIso(start), to: toIso(today) };
    }
    case "year": {
      const start = new Date(today.getFullYear(), 0, 1);
      return { from: toIso(start), to: toIso(today) };
    }
    case "custom":
      return { from: customFrom || toIso(today), to: customTo || toIso(today) };
    default:
      return { from: toIso(today), to: toIso(today) };
  }
}

export function computePreviousRange(from: string, to: string): { from: string; to: string } {
  const fromDate = new Date(`${from}T00:00:00`);
  const toDate = new Date(`${to}T00:00:00`);
  const days = Math.round((toDate.getTime() - fromDate.getTime()) / 86400000) + 1;
  const prevTo = new Date(fromDate);
  prevTo.setDate(prevTo.getDate() - 1);
  const prevFrom = new Date(prevTo);
  prevFrom.setDate(prevFrom.getDate() - (days - 1));
  return { from: toIso(prevFrom), to: toIso(prevTo) };
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadCsv(rows: (string | number)[][], header: string[], filename: string) {
  const csv = [header, ...rows]
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  downloadBlob(new Blob([csv], { type: "text/csv" }), filename);
}
