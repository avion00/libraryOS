import { api } from "./client";
import type {
  AdminUser,
  DashboardData,
  LibrarySettingsData,
  Membership,
  Paginated,
  Payment,
  Receipt,
  Seat,
  SeatMapEntry,
  Shift,
  Student,
} from "./types";

export const authApi = {
  login: (username: string, password: string) =>
    api.post<{ access: string; refresh: string; user: AdminUser }>("/auth/login", { username, password }),
  logout: (refresh: string) => api.post("/auth/logout", { refresh }),
  me: () => api.get<AdminUser>("/auth/me"),
  changePassword: (current_password: string, new_password: string) =>
    api.post("/auth/change-password", { current_password, new_password }),
};

export const studentsApi = {
  list: (params: Record<string, string | number | undefined>) =>
    api.get<Paginated<Student>>("/students/", { params }),
  get: (id: number) => api.get<Student>(`/students/${id}/`),
  create: (data: Partial<Student>) => api.post<Student>("/students/", data),
  update: (id: number, data: Partial<Student>) => api.patch<Student>(`/students/${id}/`, data),
  remove: (id: number) => api.delete(`/students/${id}/`),
  memberships: (id: number) => api.get<Membership[]>(`/students/${id}/memberships/`),
  payments: (id: number) => api.get<Paginated<Payment> | Payment[]>(`/students/${id}/payments/`),
};

export const seatsApi = {
  list: (params?: Record<string, string | number | undefined>) => api.get<Paginated<Seat>>("/seats/", { params }),
  create: (data: Partial<Seat>) => api.post<Seat>("/seats/", data),
  update: (id: number, data: Partial<Seat>) => api.patch<Seat>(`/seats/${id}/`, data),
  remove: (id: number) => api.delete(`/seats/${id}/`),
  map: () => api.get<SeatMapEntry[]>("/seats/map/"),
  occupancy: (id: number) => api.get<SeatMapEntry>(`/seats/${id}/occupancy/`),
};

export const shiftsApi = {
  list: () => api.get<Paginated<Shift>>("/shifts/"),
  create: (data: Partial<Shift>) => api.post<Shift>("/shifts/", data),
  update: (id: number, data: Partial<Shift>) => api.patch<Shift>(`/shifts/${id}/`, data),
  remove: (id: number) => api.delete(`/shifts/${id}/`),
};

export const membershipsApi = {
  list: (params: Record<string, string | number | undefined>) =>
    api.get<Paginated<Membership>>("/memberships/", { params }),
  get: (id: number) => api.get<Membership>(`/memberships/${id}/`),
  create: (data: { student_id: number; seat_id: number; shift_ids: number[]; start_date?: string; monthly_fee?: number }) =>
    api.post<Membership>("/memberships/", data),
  renew: (
    id: number,
    data: {
      start_date?: string;
      expiry_date?: string;
      monthly_fee?: number;
      seat_id?: number;
      shift_ids?: number[];
      payment_amount?: number;
      payment_method?: string;
      payment_reference?: string;
      payment_notes?: string;
    }
  ) => api.post<Membership>(`/memberships/${id}/renew/`, data),
  change: (id: number, data: { seat_id?: number; shift_ids?: number[] }) =>
    api.post<Membership>(`/memberships/${id}/change/`, data),
  vacate: (id: number, reason?: string) => api.post<Membership>(`/memberships/${id}/vacate/`, { reason }),
};

export const paymentsApi = {
  list: (params: Record<string, string | number | undefined>) => api.get<Paginated<Payment>>("/payments/", { params }),
  create: (data: {
    student: number;
    membership?: number;
    amount: number;
    payment_date: string;
    method: string;
    status: string;
    reference_number?: string;
    notes?: string;
  }) => api.post<Payment>("/payments/", data),
  receipt: (id: number) => api.get<Receipt>(`/payments/${id}/receipt/`),
};

export const dashboardApi = {
  get: () => api.get<DashboardData>("/dashboard/"),
};

export const reportsApi = {
  collections: (params: Record<string, string | undefined>) => api.get("/reports/collections", { params }),
  occupancy: () => api.get("/reports/occupancy"),
  students: () => api.get("/reports/students"),
  pendingFees: () => api.get("/reports/pending-fees"),
  expiry: (days?: number) => api.get("/reports/expiry", { params: { days } }),
};

export const settingsApi = {
  get: () => api.get<LibrarySettingsData>("/settings/"),
  update: (data: Partial<LibrarySettingsData> | FormData) => api.patch<LibrarySettingsData>("/settings/", data),
};

export const auditApi = {
  logs: (params: Record<string, string | number | undefined>) => api.get("/audit/logs/", { params }),
  backupUrl: () => "/api/audit/backup",
};

export function exportUrl(kind: "students" | "memberships" | "payments" | "seats"): string {
  return `/api/reports/export/${kind}`;
}
