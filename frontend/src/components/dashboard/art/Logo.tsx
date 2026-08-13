/**
 * `tone="light"` (default) renders a solid-white silhouette — for the
 * always-dark sidebar. `tone="dark"` recolors the same asset to the brand
 * navy via a CSS mask (works regardless of the source PNG's own colors),
 * for use on light surfaces like the login page.
 */
export function LogoMark({ className = "h-10 w-10", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  if (tone === "dark") {
    return (
      <div
        role="img"
        aria-label="LibraryOS Logo"
        className={`shrink-0 bg-[#101820] ${className}`}
        style={{
          WebkitMaskImage: "url(/logo.png)",
          maskImage: "url(/logo.png)",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
    );
  }
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
  tone = "light",
}: {
  markClassName?: string;
  textClassName?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className="flex items-center gap-3">
      <LogoMark className={markClassName ?? "h-10 w-10"} tone={tone} />

      <span
        className={
          textClassName ?? "text-xl font-bold tracking-tight whitespace-nowrap"
        }
      >
        <span className={tone === "dark" ? "text-slate-900" : "text-[#fff]"}>Library</span>
        <span className="text-brand-400">OS</span>
      </span>
    </div>
  );
}
