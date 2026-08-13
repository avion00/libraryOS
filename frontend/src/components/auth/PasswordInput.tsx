import { useId, useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

export function PasswordInput({
  value,
  onChange,
  error,
  autoComplete = "current-password",
  autoFocus,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  autoFocus?: boolean;
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[14px] font-semibold text-slate-900">
        Password
      </label>
      <div className="relative">
        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" strokeWidth={2} />
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          placeholder="Enter your password"
          className={`h-[54px] w-full rounded-[10px] border bg-white pl-11 pr-12 text-[14.5px] text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-[3px] ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-paper-700 focus:border-brand-400 focus:ring-brand-100"
          }`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-paper-300 hover:text-slate-600"
        >
          {visible ? <EyeOff className="h-[18px] w-[18px]" strokeWidth={2} /> : <Eye className="h-[18px] w-[18px]" strokeWidth={2} />}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[12.5px] text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
