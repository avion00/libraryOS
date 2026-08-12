import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const ACCESS_KEY = "libraryos_access";
const REFRESH_KEY = "libraryos_refresh";

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  setAccess: (access: string) => localStorage.setItem(ACCESS_KEY, access),
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refresh = tokenStore.getRefresh();
  if (!refresh) throw new Error("No refresh token available");
  const resp = await axios.post("/api/auth/refresh", { refresh });
  const newAccess = resp.data.access as string;
  tokenStore.setAccess(newAccess);
  return newAccess;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }
        const newAccess = await refreshPromise;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        }
        return api(originalRequest);
      } catch {
        tokenStore.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { detail?: string; errors?: Record<string, string[]> } | undefined;
    if (data?.errors) {
      const firstKey = Object.keys(data.errors)[0];
      const firstVal = data.errors[firstKey];
      if (firstVal) {
        const msg = Array.isArray(firstVal) ? firstVal[0] : String(firstVal);
        return `${firstKey !== "non_field_errors" ? `${firstKey}: ` : ""}${msg}`;
      }
    }
    if (data?.detail) return data.detail;
    if (error.message) return error.message;
  }
  return "Something went wrong. Please try again.";
}
