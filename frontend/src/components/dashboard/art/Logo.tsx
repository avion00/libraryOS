import { BookOpen } from "lucide-react";

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-brand-300 to-brand-500 shadow-sm ${className}`}
    >
      <BookOpen className="h-[55%] w-[55%] text-ink-900" strokeWidth={2.25} />
    </div>
  );
}

export function LogoLockup({ markClassName, textClassName }: { markClassName?: string; textClassName?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark className={markClassName} />
      <span className={textClassName ?? "text-lg font-bold tracking-tight"}>
        <span className="text-white">Library</span>
        <span className="text-brand-400">OS</span>
      </span>
    </div>
  );
}
