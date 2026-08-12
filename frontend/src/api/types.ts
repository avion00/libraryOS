export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "superadmin" | "admin" | "staff";
  phone: string;
  is_active: boolean;
  date_joined: string;
}

export interface Shift {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Seat {
  id: number;
  number: number;
  status: "available" | "disabled";
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface SeatSlot {
  shift_id: number;
  shift_name: string;
  status: "occupied" | "available";
  student?: { id: number; full_name: string; student_code: string };
  membership_id?: number;
  expiry_date?: string;
  payment_status?: string;
}

export interface SeatMapEntry {
  seat: Seat;
  occupied_count: number;
  total_shifts: number;
  slots: SeatSlot[];
}

export type PaymentStatus = "paid" | "pending" | "partial";
export type MembershipStatus = "active" | "expired" | "vacated";
export type PaymentMethod = "cash" | "bank_transfer" | "online" | "other";

export interface PaymentSummary {
  monthly_fee: number;
  amount_collected: number;
  balance_due: number;
  payment_status: PaymentStatus;
}

export interface CurrentMembership extends PaymentSummary {
  id: number;
  seat_id: number;
  seat_number: number;
  shifts: { id: number; name: string }[];
  start_date: string;
  expiry_date: string;
  monthly_fee: number;
  status: MembershipStatus;
}

export interface StudentSummary {
  status: MembershipStatus | "no_membership";
  current_membership: CurrentMembership | null;
}

export interface Student {
  id: number;
  student_code: string;
  full_name: string;
  phone: string;
  email: string;
  address: string;
  joining_date: string;
  photo: string | null;
  id_proof: string | null;
  notes: string;
  summary: StudentSummary;
  created_at: string;
  updated_at: string;
}

export interface MembershipShiftEntry {
  id: number;
  shift: Shift;
  is_active: boolean;
}

export interface Membership {
  id: number;
  student: { id: number; student_code: string; full_name: string; phone: string };
  seat: number;
  seat_number: number;
  shifts: MembershipShiftEntry[];
  start_date: string;
  expiry_date: string;
  monthly_fee: number;
  status: MembershipStatus;
  previous_membership: number | null;
  vacated_at: string | null;
  vacate_reason: string;
  payment_summary: PaymentSummary;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  receipt_number: string;
  student: number;
  student_name: string;
  student_code: string;
  membership: number | null;
  amount: number;
  payment_date: string;
  method: PaymentMethod;
  status: PaymentStatus;
  reference_number: string;
  notes: string;
  created_by: number | null;
  created_by_username: string | null;
  created_at: string;
}

export interface Receipt {
  receipt_number: string;
  library: { name: string; phone: string; email: string; address: string };
  student: { id: number; full_name: string; student_code: string; phone: string };
  seat_number: number | null;
  shifts: string[];
  billing_period: { start_date: string; expiry_date: string } | null;
  amount: number;
  payment_date: string;
  method: PaymentMethod;
  status: PaymentStatus;
  reference_number: string;
  notes: string;
  currency_symbol: string;
  generated_at: string;
}

export interface LibrarySettingsData {
  id: number;
  library_name: string;
  logo: string | null;
  phone: string;
  email: string;
  address: string;
  website: string;
  tax_id: string;
  total_seats: number;
  default_monthly_fee: number;
  membership_duration_policy: "calendar_month" | "30_days";
  expiring_soon_days: number;
  default_payment_method: PaymentMethod;
  currency: string;
  currency_symbol: string;
  date_format: string;
  timezone: string;
  apply_tax: boolean;
  tax_label: string;
  tax_rate: number;
  receipt_footer_text: string;
  notify_email: boolean;
  notify_whatsapp: boolean;
  notify_due_payment: boolean;
  notify_expiry: boolean;
  notify_daily_summary: boolean;
  updated_at: string;
}

export interface DashboardData {
  seats: { total: number; disabled: number; occupied: number; vacant: number; occupancy_percentage: number };
  shift_slots: { total: number; occupied: number; occupancy_percentage: number };
  total_active_students: number;
  collections: { today: number; this_month: number };
  pending_fees: { total_due: number; students_count: number };
  expiring_memberships: {
    membership_id: number;
    student_id: number;
    student_name: string;
    student_code: string;
    seat_number: number;
    expiry_date: string;
  }[];
  recently_registered_students: Student[];
  recent_payments: Payment[];
  currency_symbol: string;
}
