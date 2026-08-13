import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ChartNoAxesCombined, ShieldCheck, UsersRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { extractErrorMessage } from "../api/client";
import { AuthLayout, type AuthFeatureItem } from "../components/auth/AuthLayout";
import { LoginForm } from "../components/auth/LoginForm";
import { LoginSupport } from "../components/auth/LoginSupport";
import { LogoLockup } from "../components/dashboard/art/Logo";

const FEATURES: AuthFeatureItem[] = [
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    description: "Your account and library data are protected by secure authentication.",
  },
  {
    icon: UsersRound,
    title: "Built for Libraries",
    description: "Manage seats, students and payments with ease.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Insightful & Efficient",
    description: "Powerful tools to help your library grow.",
  },
];

export default function LoginPage() {
  const { user, login } = useAuth();
  const { isDark } = useTheme();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Sign in | LibraryOS";
  }, []);

  if (user) {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? "/";
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(username: string, password: string, remember: boolean) {
    setApiError(null);
    try {
      await login(username, password, remember);
      const redirectTo = (location.state as { from?: string } | null)?.from ?? "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setApiError(extractErrorMessage(err));
    }
  }

  function handleForgotPassword() {
    notify("Password resets aren't self-serve yet — please contact your library administrator.", "info");
  }

  function handleContactSupport() {
    notify("Please reach out to your library administrator for help signing in.", "info");
  }

  return (
    <AuthLayout features={FEATURES}>
      <div className="w-full max-w-[500px] animate-fadeIn">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <LogoLockup tone={isDark ? "light" : "dark"} markClassName="h-11 w-11" textClassName="text-[38px] font-bold tracking-tight" />
          </div>
          <p className="text-[15px] text-slate-500">Sign in to manage seats, students &amp; payments</p>
        </div>

        <div className="animate-scaleIn rounded-2xl border border-paper-700 bg-white p-7 shadow-[0_10px_30px_rgba(16,24,32,0.05)] sm:p-8">
          <LoginForm onSubmit={handleSubmit} apiError={apiError} onForgotPassword={handleForgotPassword} />
        </div>

        <div className="mt-6">
          <LoginSupport onContactSupport={handleContactSupport} />
        </div>

        <p className="mt-8 text-center text-[12.5px] text-slate-400">© {new Date().getFullYear()} LibraryOS. All rights reserved.</p>
      </div>
    </AuthLayout>
  );
}
