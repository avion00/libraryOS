export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <div className={`flex shrink-0 items-center justify-center ${className}`}>
      <img
        src="/logo.png"
        alt="LibraryOS Logo"
        className="h-full w-full object-contain brightness-0 invert"
      />
    </div>
  );
}

export function LogoLockup({
  markClassName,
  textClassName,
}: {
  markClassName?: string;
  textClassName?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <LogoMark className={markClassName ?? "h-10 w-10"} />

      <span
        className={
          textClassName ?? "text-xl font-bold tracking-tight whitespace-nowrap"
        }
      >
        <span className="text-white">Library</span>
        <span className="text-brand-400">OS</span>
      </span>
    </div>
  );
}
