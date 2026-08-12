import type { PaymentMethod, PaymentStatus } from "../../api/types";

export const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "paid", label: "Paid" },
  { value: "partial", label: "Partial" },
  { value: "pending", label: "Pending" },
] as const;

export const METHOD_FILTER_OPTIONS = [
  { value: "", label: "All methods" },
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "online", label: "Online" },
  { value: "other", label: "Other" },
] as const;

export const METHOD_LABEL: Record<PaymentMethod, string> = {
  cash: "Cash",
  bank_transfer: "Bank Transfer",
  online: "Online",
  other: "Other",
};

export const STATUS_META: Record<PaymentStatus, { label: string; bg: string; text: string; dot: string }> = {
  paid: { label: "Paid", bg: "bg-emerald-50", text: "text-emerald-600", dot: "#10b981" },
  partial: { label: "Partial", bg: "bg-amber-50", text: "text-amber-600", dot: "#f59e0b" },
  pending: { label: "Pending", bg: "bg-amber-50", text: "text-amber-600", dot: "#f59e0b" },
};

export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

export function isSameMonth(dateStr: string, ref: Date): boolean {
  const d = new Date(`${dateStr.slice(0, 10)}T00:00:00`);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

export function derivePaymentRef(paymentId: number, generatedAt: string): string {
  const datePart = generatedAt.slice(0, 10).replace(/-/g, "");
  const hex = paymentId.toString(16).toUpperCase().padStart(6, "0");
  return `PAY-${datePart}-${hex}`;
}
