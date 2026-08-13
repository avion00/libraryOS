import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const ACCESS_KEY = "libraryos_access";
const REFRESH_KEY = "libraryos_refresh";

// "Remember me" decides which storage backs the session: localStorage
// persists across browser restarts, sessionStorage clears when the tab/
// browser closes. Whichever one holds the refresh token is treated as the
// active store, so a plain page reload keeps working either way.
function activeStore(): Storage {
  return localStorage.getItem(REFRESH_KEY) !== null ? localStorage : sessionStorage;
}

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_KEY) ?? sessionStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY) ?? sessionStorage.getItem(REFRESH_KEY),
  set: (access: string, refresh: string, remember = true) => {
    const store = remember ? localStorage : sessionStorage;
    const other = remember ? sessionStorage : localStorage;
    other.removeItem(ACCESS_KEY);
    other.removeItem(REFRESH_KEY);
    store.setItem(ACCESS_KEY, access);
    store.setItem(REFRESH_KEY, refresh);
  },
  setAccess: (access: string) => activeStore().setItem(ACCESS_KEY, access),
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    sessionStorage.removeItem(ACCESS_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
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
    // A 401 from the login endpoint itself just means "wrong credentials" —
    // there's no session to refresh, so let it reject normally instead of
    // running the refresh-or-redirect flow (which would hard-reload the page
    // and wipe whatever the user just typed).
    const isLoginRequest = originalRequest?.url?.includes("/auth/login");
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isLoginRequest) {
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
