import type { LibrarySettingsData, PaymentMethod } from "../../api/types";

export interface SettingsFormValues {
  library_name: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  tax_id: string;
  total_seats: string;
  default_monthly_fee: string;
  membership_duration_policy: "calendar_month" | "30_days";
  expiring_soon_days: string;
  default_payment_method: PaymentMethod;
  currency: string;
  currency_symbol: string;
  date_format: string;
  timezone: string;
  apply_tax: boolean;
  tax_label: string;
  tax_rate: string;
  receipt_footer_text: string;
  notify_email: boolean;
  notify_whatsapp: boolean;
  notify_due_payment: boolean;
  notify_expiry: boolean;
  notify_daily_summary: boolean;
}

export function toFormValues(data: LibrarySettingsData): SettingsFormValues {
  return {
    library_name: data.library_name,
    phone: data.phone,
    email: data.email,
    address: data.address,
    website: data.website,
    tax_id: data.tax_id,
    total_seats: String(data.total_seats),
    default_monthly_fee: String(data.default_monthly_fee),
    membership_duration_policy: data.membership_duration_policy,
    expiring_soon_days: String(data.expiring_soon_days),
    default_payment_method: data.default_payment_method,
    currency: data.currency,
    currency_symbol: data.currency_symbol,
    date_format: data.date_format,
    timezone: data.timezone,
    apply_tax: data.apply_tax,
    tax_label: data.tax_label,
    tax_rate: String(data.tax_rate),
    receipt_footer_text: data.receipt_footer_text,
    notify_email: data.notify_email,
    notify_whatsapp: data.notify_whatsapp,
    notify_due_payment: data.notify_due_payment,
    notify_expiry: data.notify_expiry,
    notify_daily_summary: data.notify_daily_summary,
  };
}

export const DEFAULT_FORM_VALUES: SettingsFormValues = {
  library_name: "LibraryOS",
  phone: "",
  email: "",
  address: "",
  website: "",
  tax_id: "",
  total_seats: "50",
  default_monthly_fee: "1000",
  membership_duration_policy: "calendar_month",
  expiring_soon_days: "3",
  default_payment_method: "cash",
  currency: "INR",
  currency_symbol: "₹",
  date_format: "DD/MM/YYYY",
  timezone: "UTC",
  apply_tax: false,
  tax_label: "GST",
  tax_rate: "0",
  receipt_footer_text: "",
  notify_email: true,
  notify_whatsapp: false,
  notify_due_payment: true,
  notify_expiry: true,
  notify_daily_summary: false,
};

export type FormErrors = Partial<Record<keyof SettingsFormValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/;

export function validateForm(v: SettingsFormValues): FormErrors {
  const errors: FormErrors = {};

  if (!v.library_name.trim()) errors.library_name = "Library name is required.";
  if (v.email && !EMAIL_RE.test(v.email)) errors.email = "Enter a valid email address.";
  if (v.phone && v.phone.replace(/[^\d]/g, "").length < 7) errors.phone = "Enter a valid phone number.";
  if (v.website && !URL_RE.test(v.website)) errors.website = "Enter a valid website URL.";

  const seats = Number(v.total_seats);
  if (!Number.isInteger(seats) || seats < 1) errors.total_seats = "Total seats must be a positive whole number.";

  const fee = Number(v.default_monthly_fee);
  if (Number.isNaN(fee) || fee < 0) errors.default_monthly_fee = "Enter a valid non-negative fee.";

  const window_ = Number(v.expiring_soon_days);
  if (!Number.isInteger(window_) || window_ < 1) errors.expiring_soon_days = "Enter a positive whole number of days.";

  if (v.currency.trim().length !== 3) errors.currency = "Currency code must be 3 characters (e.g. INR).";
  if (!v.currency_symbol.trim()) errors.currency_symbol = "Currency symbol is required.";

  if (v.apply_tax) {
    const rate = Number(v.tax_rate);
    if (Number.isNaN(rate) || rate < 0 || rate > 100) errors.tax_rate = "Enter a valid percentage between 0 and 100.";
    if (!v.tax_label.trim()) errors.tax_label = "Tax label is required when tax is enabled.";
  }

  return errors;
}

export type SettingsSection =
  | "profile"
  | "membership"
  | "billing"
  | "notifications"
  | "security"
  | "integrations"
  | "backup"
  | "preferences"
  | "audit";

export const ACCENT_COLORS = [
  { key: "blue", hex: "#2563eb" },
  { key: "violet", hex: "#7c3aed" },
  { key: "emerald", hex: "#10b981" },
  { key: "teal", hex: "#0d9488" },
  { key: "orange", hex: "#F2AA4C" },
  { key: "red", hex: "#ef4444" },
] as const;

export const SESSION_TIMEOUT_OPTIONS = [
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "240", label: "4 hours" },
  { value: "never", label: "Never" },
];
