import type { Membership, Payment, Student } from "../../api/types";
import { formatMoney } from "../../lib/format";

export interface ActivityEvent {
  id: string;
  type: "created" | "membership_started" | "membership_renewed" | "vacated" | "payment";
  title: string;
  timestamp: string;
  actor?: string | null;
}

/**
 * Every event here is derived directly from a real timestamped record
 * (student/membership/payment) — nothing here is fabricated.
 */
export function deriveActivityEvents(
  student: Student,
  memberships: Membership[],
  payments: Payment[],
  currencySymbol = "₹"
): ActivityEvent[] {
  const events: ActivityEvent[] = [];

  events.push({
    id: `student-${student.id}`,
    type: "created",
    title: "Student profile created",
    timestamp: student.created_at,
  });

  for (const m of memberships) {
    events.push({
      id: `membership-${m.id}-start`,
      type: m.previous_membership ? "membership_renewed" : "membership_started",
      title: m.previous_membership
        ? `Membership renewed — Seat ${m.seat_number}`
        : `Seat ${m.seat_number} assigned`,
      timestamp: m.created_at,
    });
    if (m.vacated_at) {
      events.push({
        id: `membership-${m.id}-vacated`,
        type: "vacated",
        title: `Seat ${m.seat_number} vacated`,
        timestamp: m.vacated_at,
      });
    }
  }

  for (const p of payments) {
    events.push({
      id: `payment-${p.id}`,
      type: "payment",
      title: `Payment of ${formatMoney(p.amount, currencySymbol)} recorded`,
      timestamp: p.created_at,
      actor: p.created_by_username,
    });
  }

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export interface MonthlyPaymentPoint {
  label: string;
  amount: number;
}

/** Sum of collected payments per calendar month, for the last `months` months (oldest first). */
export function derivePaymentActivity(payments: Payment[], months = 6): MonthlyPaymentPoint[] {
  const now = new Date();
  const buckets: { key: string; label: string }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString(undefined, { month: "short" }) });
  }
  const totals = new Map<string, number>(buckets.map((b) => [b.key, 0]));
  for (const p of payments) {
    const d = new Date(p.payment_date.length <= 10 ? `${p.payment_date}T00:00:00` : p.payment_date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (totals.has(key)) totals.set(key, (totals.get(key) ?? 0) + Number(p.amount));
  }
  return buckets.map((b) => ({ label: b.label, amount: totals.get(b.key) ?? 0 }));
}
