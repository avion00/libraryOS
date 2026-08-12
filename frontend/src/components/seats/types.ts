import type { SeatMapEntry } from "../../api/types";

export type SeatComputedStatus = "available" | "partial" | "full" | "disabled";

export function computeSeatStatus(entry: SeatMapEntry): SeatComputedStatus {
  if (entry.seat.status === "disabled") return "disabled";
  if (entry.occupied_count === 0) return "available";
  if (entry.occupied_count >= entry.total_shifts) return "full";
  return "partial";
}

export const SEAT_STATUS_META: Record<SeatComputedStatus, { label: string; dot: string; text: string; bg: string }> = {
  available: { label: "Fully available", dot: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50" },
  partial: { label: "Partially occupied", dot: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-50" },
  full: { label: "Fully occupied", dot: "bg-rose-500", text: "text-rose-600", bg: "bg-rose-50" },
  disabled: { label: "Disabled", dot: "bg-slate-400", text: "text-slate-500", bg: "bg-slate-100" },
};

export const SEAT_STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "available", label: "Available" },
  { value: "partial", label: "Partially Occupied" },
  { value: "full", label: "Fully Occupied" },
  { value: "disabled", label: "Disabled" },
] as const;

export interface AuditLogEntry {
  id: number;
  user: number | null;
  username: string | null;
  action: string;
  model_name: string;
  object_id: string;
  changes: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}
