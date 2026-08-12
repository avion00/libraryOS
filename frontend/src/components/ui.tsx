import clsx from "clsx";
import {
  useEffect,
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type RefObject,
  type SelectHTMLAttributes,
} from "react";

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
}) {
  const variants = {
    primary: "bg-brand-400 text-ink-900 hover:bg-brand-500 disabled:bg-brand-200 disabled:text-ink-300",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-paper-300 disabled:text-slate-400",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
    ghost: "bg-transparent text-slate-600 hover:bg-paper-500 disabled:text-slate-300",
  };
  const sizes = { sm: "px-2.5 py-1.5 text-sm", md: "px-4 py-2 text-sm" };
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400",
        "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100",
        "disabled:bg-paper-300 disabled:text-slate-400",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={clsx(
        "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900",
        "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <label className="mb-1 block text-sm font-medium text-slate-700">{children}</label>;
}

export function Field({ label, children, error }: { label: string; children: ReactNode; error?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx("rounded-xl border border-paper-700 bg-white shadow-sm", className)}>{children}</div>;
}

export function Badge({
  children,
  color = "slate",
}: {
  children: ReactNode;
  color?: "slate" | "green" | "amber" | "red" | "blue";
}) {
  const colors = {
    slate: "bg-paper-500 text-slate-700",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-red-100 text-red-700",
    blue: "bg-info-50 text-info-700",
  };
  return (
    <span className={clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", colors[color])}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: "slate" | "green" | "amber" | "red" | "blue"; label: string }> = {
    active: { color: "green", label: "Active" },
    expired: { color: "red", label: "Expired" },
    vacated: { color: "slate", label: "Vacated" },
    no_membership: { color: "slate", label: "No membership" },
    paid: { color: "green", label: "Paid" },
    pending: { color: "amber", label: "Pending" },
    partial: { color: "amber", label: "Partial" },
    available: { color: "green", label: "Available" },
    disabled: { color: "slate", label: "Disabled" },
    occupied: { color: "red", label: "Occupied" },
  };
  const entry = map[status] ?? { color: "slate" as const, label: status };
  return <Badge color={entry.color}>{entry.label}</Badge>;
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={clsx("animate-spin", className)} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

export function PageLoading() {
  return (
    <div className="flex h-64 items-center justify-center text-slate-400">
      <Spinner className="h-8 w-8" />
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-16 text-center">
      <p className="font-medium text-slate-700">{title}</p>
      {description && <p className="max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 py-12 text-center">
      <p className="text-sm font-medium text-red-700">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

/**
 * Low-level accessible dialog shell: backdrop, centering, sizing, and the
 * a11y behaviors (focus trap, initial focus, focus restore, Escape-to-close)
 * shared by every modal in the app. `Modal` and bespoke dialogs (e.g. the
 * Seat Details dialog) both build their own header/body on top of this.
 */
export function DialogShell({
  open,
  onClose,
  children,
  widthClass = "max-w-lg",
  labelledBy,
  describedBy,
  initialFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  widthClass?: string;
  labelledBy?: string;
  describedBy?: string;
  initialFocusRef?: RefObject<HTMLElement | null>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const toFocus = initialFocusRef?.current ?? panelRef.current;
    toFocus?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;
      const list = Array.from(focusables);
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-[2px] animate-fadeIn"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={clsx(
          "max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white shadow-2xl outline-none animate-scaleIn",
          widthClass
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  widthClass = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  widthClass?: string;
}) {
  const titleId = useId();
  return (
    <DialogShell open={open} onClose={onClose} widthClass={widthClass} labelledBy={titleId}>
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 id={titleId} className="text-lg font-semibold text-slate-900">
            {title}
          </h2>
          <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-paper-500 hover:text-slate-600">
            ✕
          </button>
        </div>
        {children}
      </div>
    </DialogShell>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  danger,
  onConfirm,
  onCancel,
  loading,
}: {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onCancel} title={title} widthClass="max-w-md">
      <p className="text-sm text-slate-600">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} disabled={loading}>
          {loading ? <Spinner className="h-4 w-4" /> : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

export function SectionHeading({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
