/**
 * Shared skeleton-loading primitives. Built on the app's existing
 * theme-adaptive `paper` scale (see index.css / tailwind.config.js), so
 * every skeleton automatically renders correctly in both light and dark
 * mode with zero extra work — no separate dark-mode variants needed.
 */
import type { CSSProperties, ReactNode } from "react";

export function SkeletonBlock({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return <div className={`animate-pulse rounded-md bg-paper-600 ${className}`} style={style} />;
}

export function SkeletonText({ width = "100%", className = "" }: { width?: string; className?: string }) {
  return <div className={`h-3 animate-pulse rounded bg-paper-600 ${className}`} style={{ width }} />;
}

export function SkeletonCircle({ size = 36, className = "" }: { size?: number; className?: string }) {
  return <div className={`shrink-0 animate-pulse rounded-full bg-paper-600 ${className}`} style={{ width: size, height: size }} />;
}

export function SkeletonCard({ className = "", children }: { className?: string; children?: ReactNode }) {
  return <div className={`rounded-2xl border border-paper-700 bg-white p-5 shadow-card ${className}`}>{children}</div>;
}

/** Matches StudentStatCard / StudentSummaryTile's icon-chip + label + value shape. */
export function SkeletonStatCard() {
  return (
    <div className="flex h-full flex-col justify-between gap-3 rounded-xl border border-paper-700 bg-white p-4 shadow-card">
      <div className="flex items-center gap-2.5">
        <SkeletonCircle size={36} />
        <SkeletonText width="60%" />
      </div>
      <div>
        <SkeletonBlock className="h-6 w-16" />
        <SkeletonText width="45%" className="mt-2" />
      </div>
    </div>
  );
}

/**
 * `gridClassName` should be the exact grid utility classes the real stat
 * row uses on that page — Tailwind can't see dynamically-built class
 * strings, so the caller passes a literal string (e.g.
 * "grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8") matching its layout.
 */
export function SkeletonStatRow({ count = 4, gridClassName = "grid-cols-2 gap-3 sm:grid-cols-4" }: { count?: number; gridClassName?: string }) {
  return (
    <div className={`grid ${gridClassName}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonStatCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonTableRows({ rows = 6, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="divide-y divide-paper-500">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-4 py-3.5">
          <SkeletonCircle size={30} />
          <div className="min-w-0 flex-1 space-y-1.5">
            <SkeletonText width="55%" />
            <SkeletonText width="35%" />
          </div>
          {Array.from({ length: Math.max(columns - 1, 0) }).map((_, c) => (
            <SkeletonText key={c} width={`${60 + (c % 3) * 15}px`} className="hidden shrink-0 sm:block" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonChartCard({ className = "" }: { className?: string }) {
  return (
    <SkeletonCard className={className}>
      <div className="flex items-center justify-between">
        <SkeletonText width="140px" />
        <SkeletonBlock className="h-8 w-24 rounded-lg" />
      </div>
      <div className="mt-4 flex h-[190px] items-end gap-3">
        {[40, 65, 50, 80, 55, 70, 45].map((h, i) => (
          <SkeletonBlock key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%` }} />
        ))}
      </div>
    </SkeletonCard>
  );
}

export function SkeletonDonutCard({ className = "" }: { className?: string }) {
  return (
    <SkeletonCard className={className}>
      <SkeletonText width="120px" />
      <div className="mt-4 flex justify-center">
        <div className="animate-pulse rounded-full bg-paper-600" style={{ width: 140, height: 140 }} />
      </div>
      <div className="mt-4 space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <SkeletonText width="90px" />
            <SkeletonText width="40px" />
          </div>
        ))}
      </div>
    </SkeletonCard>
  );
}

export function SkeletonListCard({ rows = 4, className = "" }: { rows?: number; className?: string }) {
  return (
    <SkeletonCard className={className}>
      <div className="flex items-center justify-between">
        <SkeletonText width="130px" />
        <SkeletonText width="50px" />
      </div>
      <div className="mt-3 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <SkeletonCircle size={34} />
            <div className="min-w-0 flex-1 space-y-1.5">
              <SkeletonText width="70%" />
              <SkeletonText width="40%" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonCard>
  );
}
