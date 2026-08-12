import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import clsx from "clsx";

import { Check, CircleAlert, Info, TriangleAlert, X } from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type ToastVariant = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  message: string;
  title?: string;
  variant: ToastVariant;
  duration: number;
  leaving?: boolean;
}

interface ToastOptions {
  variant?: ToastVariant;
  title?: string;
  duration?: number;
}

interface ToastContextValue {
  notify: (
    message: string,
    variantOrOptions?: ToastVariant | ToastOptions,
  ) => void;
}

/* =========================================================
   CONTEXT
========================================================= */

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let counter = 0;

const DEFAULT_DURATION = 4000;

/* =========================================================
   VISUAL CONFIG
========================================================= */

const toastStyles = {
  success: {
    icon: Check,
    iconBg: "bg-emerald-500",
    iconColor: "text-white",
  },

  error: {
    icon: CircleAlert,
    iconBg: "bg-red-500",
    iconColor: "text-white",
  },

  warning: {
    icon: TriangleAlert,
    iconBg: "bg-amber-500",
    iconColor: "text-white",
  },

  info: {
    icon: Info,
    iconBg: "bg-blue-500",
    iconColor: "text-white",
  },
};

/* =========================================================
   PROVIDER
========================================================= */

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  /* ---------------------------------------------------------
     REMOVE
  --------------------------------------------------------- */

  const removeToast = useCallback((id: number) => {
    const timer = timers.current.get(id);

    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }

    /*
     * Trigger exit animation first
     */
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id
          ? {
              ...toast,
              leaving: true,
            }
          : toast,
      ),
    );

    /*
     * Remove after animation
     */
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 220);
  }, []);

  /* ---------------------------------------------------------
     CREATE
  --------------------------------------------------------- */

  const notify = useCallback(
    (
      message: string,
      variantOrOptions: ToastVariant | ToastOptions = "info",
    ) => {
      const id = ++counter;

      const options: ToastOptions =
        typeof variantOrOptions === "string"
          ? {
              variant: variantOrOptions,
            }
          : variantOrOptions;

      const variant = options.variant ?? "info";

      const duration = options.duration ?? DEFAULT_DURATION;

      const newToast: Toast = {
        id,
        message,
        title: options.title,
        variant,
        duration,
      };

      setToasts((prev) => {
        /*
         * Apple-style notifications shouldn't
         * fill the entire screen.
         *
         * Keep only the newest 3.
         */
        return [...prev, newToast].slice(-3);
      });

      const timer = window.setTimeout(() => {
        removeToast(id);
      }, duration);

      timers.current.set(id, timer);
    },
    [removeToast],
  );

  /* ---------------------------------------------------------
     CLEANUP
  --------------------------------------------------------- */

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => {
        clearTimeout(timer);
      });

      timers.current.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}

      {/* =====================================================
          TOAST CONTAINER
          TOP CENTER
      ===================================================== */}

      <div
        aria-live="polite"
        aria-atomic="false"
        className="
          pointer-events-none

          fixed
          left-1/2
          top-4
          z-[99999]

          flex
          w-[calc(100%-24px)]
          max-w-[520px]
          -translate-x-1/2
          flex-col
          items-center
          gap-2.5

          sm:top-5
          sm:w-auto
          sm:min-w-[420px]
        "
      >
        {toasts.map((toast) => {
          const config = toastStyles[toast.variant];

          const Icon = config.icon;

          return (
            <div
              key={toast.id}
              role={toast.variant === "error" ? "alert" : "status"}
              className={clsx(
                `
                apple-toast

                pointer-events-auto
                relative

                flex
                w-full
                min-w-0
                items-center

                overflow-hidden

                rounded-[18px]

                border
                border-black/[0.07]

                bg-white/[0.88]

                px-4
                py-3.5
                pr-12

                shadow-
                [0_12px_40px_rgba(15,23,42,0.13),
                0_2px_8px_rgba(15,23,42,0.06),
                inset_0_1px_0_rgba(255,255,255,0.8)]

                backdrop-blur-[24px]
                backdrop-saturate-[180%]

                sm:min-w-[420px]
                sm:max-w-[520px]
                `,
                toast.leaving ? "apple-toast-exit" : "apple-toast-enter",
              )}
            >
              {/* =============================================
                  ICON
              ============================================= */}

              <div
                className={clsx(
                  `
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center

                  rounded-full

                  shadow-sm
                  `,
                  config.iconBg,
                  config.iconColor,
                )}
              >
                <Icon className="h-[17px] w-[17px]" strokeWidth={2.4} />
              </div>

              {/* =============================================
                  TEXT
              ============================================= */}

              <div
                className="
                  ml-3
                  min-w-0
                  flex-1
                "
              >
                {toast.title && (
                  <div
                    className="
                      truncate

                      text-[13.5px]
                      font-semibold
                      leading-[18px]

                      tracking-[-0.015em]

                      text-slate-950
                    "
                  >
                    {toast.title}
                  </div>
                )}

                <div
                  className={clsx(
                    `
                    text-[13px]
                    leading-[18px]

                    tracking-[-0.01em]

                    text-slate-600
                    `,
                    !toast.title && "font-medium text-slate-800",
                  )}
                >
                  {toast.message}
                </div>
              </div>

              {/* =============================================
                  CLOSE BUTTON
                  RIGHT TOP
              ============================================= */}

              <button
                type="button"
                aria-label="Close notification"
                onClick={() => removeToast(toast.id)}
                className="
                  absolute
                  right-2
                  top-2

                  flex
                  h-7
                  w-7
                  items-center
                  justify-center

                  rounded-full

                  text-slate-400

                  transition-all
                  duration-150

                  hover:bg-black/[0.055]
                  hover:text-slate-700

                  active:scale-90

                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-black/10
                "
              >
                <X className="h-[14px] w-[14px]" strokeWidth={2.2} />
              </button>
            </div>
          );
        })}
      </div>

      {/* =====================================================
          ANIMATION
      ===================================================== */}

      <style>{`
        @keyframes appleToastEnter {
          0% {
            opacity: 0;
            transform:
              translate3d(0, -14px, 0)
              scale(0.96);
            filter: blur(4px);
          }

          55% {
            opacity: 1;
          }

          100% {
            opacity: 1;
            transform:
              translate3d(0, 0, 0)
              scale(1);
            filter: blur(0);
          }
        }

        @keyframes appleToastExit {
          0% {
            opacity: 1;
            transform:
              translate3d(0, 0, 0)
              scale(1);
            filter: blur(0);
          }

          100% {
            opacity: 0;
            transform:
              translate3d(0, -8px, 0)
              scale(0.97);
            filter: blur(3px);
          }
        }

        .apple-toast-enter {
          animation:
            appleToastEnter
            340ms
            cubic-bezier(0.16, 1, 0.3, 1)
            both;
        }

        .apple-toast-exit {
          animation:
            appleToastExit
            200ms
            cubic-bezier(0.4, 0, 1, 1)
            both;
        }

        @media (prefers-reduced-motion: reduce) {
          .apple-toast-enter,
          .apple-toast-exit {
            animation-duration: 1ms !important;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
