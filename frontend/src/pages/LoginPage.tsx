import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage } from "../api/client";
import { Button, Input, Label } from "../components/ui";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? "/";
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-300 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-2 text-4xl">📚</div>
          <h1 className="text-2xl font-semibold text-slate-900">LibraryOS</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to manage seats, students & payments</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-paper-700 bg-white p-6 shadow-sm">
          {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          <div>
            <Label>Username</Label>
            <Input
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
