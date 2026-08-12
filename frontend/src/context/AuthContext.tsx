import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi } from "../api/endpoints";
import { tokenStore } from "../api/client";
import type { AdminUser } from "../api/types";

interface AuthContextValue {
  user: AdminUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasToken = !!tokenStore.getAccess();
    if (!hasToken) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((resp) => setUser(resp.data))
      .catch(() => {
        tokenStore.clear();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(username: string, password: string) {
    const resp = await authApi.login(username, password);
    tokenStore.set(resp.data.access, resp.data.refresh);
    setUser(resp.data.user);
  }

  async function logout() {
    const refresh = tokenStore.getRefresh();
    try {
      if (refresh) await authApi.logout(refresh);
    } catch {
      // ignore network errors on logout — we clear local state regardless
    }
    tokenStore.clear();
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
