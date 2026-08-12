export interface StudentsReportSummary {
  total_students: number;
  active: number;
  expired: number;
  vacated: number;
  never_booked: number;
}

export interface ExpiryRow {
  membership_id: number;
  student_id: number;
  student_name: string;
  student_code: string;
  phone: string;
  seat_number: number;
  expiry_date: string;
  is_overdue: boolean;
}

export interface ExpiryReport {
  count: number;
  rows: ExpiryRow[];
}

export interface PendingFeeRow {
  membership_id: number;
  student_id: number;
  student_name: string;
  student_code: string;
  seat_number: number;
  monthly_fee: number;
  amount_collected: number;
  balance_due: number;
  expiry_date: string;
}

export interface PendingFeesReport {
  count: number;
  total_due: number;
  rows: PendingFeeRow[];
}

export const SHIFT_OPTIONS = ["Morning", "Afternoon", "Evening", "Night"] as const;

export const PRIMARY_STATUS_OPTIONS = [
  { value: "", label: "All students" },
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
  { value: "vacated", label: "Vacated" },
  { value: "no_membership", label: "No membership" },
] as const;

export const SECONDARY_STATUS_OPTIONS = [
  { value: "", label: "Membership status" },
  { value: "expiring_soon", label: "Expiring soon" },
  { value: "pending_fees", label: "Pending fees" },
] as const;

export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
