import { useId, useState, type FormEvent } from "react";
import { CircleAlert, LoaderCircle, UserRound } from "lucide-react";
import { PasswordInput } from "./PasswordInput";

interface FieldErrors {
  username?: string;
  password?: string;
}

export function LoginForm({
  onSubmit,
  apiError,
  onForgotPassword,
}: {
  onSubmit: (username: string, password: string, remember: boolean) => Promise<void>;
  apiError: string | null;
  onForgotPassword: () => void;
}) {
  const usernameId = useId();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errors: FieldErrors = {};
    if (!username.trim()) errors.username = "Username is required.";
    if (!password) errors.password = "Password is required.";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit(username.trim(), password, remember);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {apiError && (
        <div role="alert" className="flex items-start gap-2.5 rounded-[10px] bg-red-50 px-3.5 py-3 text-red-700">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
          <div>
            <p className="text-[13px] font-semibold">Unable to sign in</p>
            <p className="text-[12.5px] leading-relaxed text-red-600">{apiError}</p>
          </div>
        </div>
      )}

      <div>
        <label htmlFor={usernameId} className="mb-2 block text-[14px] font-semibold text-slate-900">
          Username
        </label>
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" strokeWidth={2} />
          <input
            id={usernameId}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
            aria-invalid={!!fieldErrors.username}
            aria-describedby={fieldErrors.username ? `${usernameId}-error` : undefined}
            placeholder="Enter your username"
            className={`h-[54px] w-full rounded-[10px] border bg-white pl-11 pr-4 text-[14.5px] text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-[3px] ${
              fieldErrors.username
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-paper-700 focus:border-brand-400 focus:ring-brand-100"
            }`}
          />
        </div>
        {fieldErrors.username && (
          <p id={`${usernameId}-error`} className="mt-1.5 text-[12.5px] text-red-600">
            {fieldErrors.username}
          </p>
        )}
      </div>

      <PasswordInput value={password} onChange={setPassword} error={fieldErrors.password} />

      <div className="flex items-center justify-between">
        <label className="flex select-none items-center gap-2.5 text-[13.5px] text-slate-700">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-400"
          />
          Remember me
        </label>
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-[13.5px] font-semibold text-[#D97C17] transition-colors hover:text-brand-400"
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex h-[54px] w-full items-center justify-center gap-2 rounded-[10px] bg-brand-400 text-[15px] font-semibold text-[#101820] transition-colors hover:bg-brand-500 active:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? (
          <>
            <LoaderCircle className="h-[18px] w-[18px] animate-spin" strokeWidth={2.4} />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
}
