import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

/** Compact icon-only light/dark switch — no text, no menu. Matches the one in DashboardHeader. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { isDark, setTheme } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative inline-flex h-[26px] w-[46px] shrink-0 items-center rounded-full border transition-colors duration-300 ${
        isDark ? "border-transparent bg-[#1B2530]" : "border-[#E5E0D7] bg-[#EDE9E2]"
      } ${className}`}
    >
      <span
        className={`absolute left-[2px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#fff] shadow-sm transition-transform duration-300 ${
          isDark ? "translate-x-[20px]" : "translate-x-0"
        }`}
      >
        {isDark ? <Moon className="h-3 w-3 text-ink-700" strokeWidth={2.2} /> : <Sun className="h-3 w-3 text-brand-500" strokeWidth={2.2} />}
      </span>
    </button>
  );
}
