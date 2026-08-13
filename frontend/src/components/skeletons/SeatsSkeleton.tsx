import { SkeletonBlock, SkeletonDonutCard, SkeletonListCard, SkeletonStatRow } from "./Skeleton";

export function SeatsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <SkeletonStatRow count={4} gridClassName="grid-cols-2 gap-3 lg:grid-cols-4" />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-paper-700 pb-3">
        <div className="flex items-center gap-6">
          <SkeletonBlock className="h-5 w-16" />
          <SkeletonBlock className="h-5 w-14" />
        </div>
        <SkeletonBlock className="h-9 w-56 rounded-lg" />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-4 w-24" />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8">
            {Array.from({ length: 32 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-[78px] rounded-[11px]" />
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 lg:w-[300px] lg:shrink-0">
          <SkeletonDonutCard />
          <SkeletonListCard rows={3} />
        </div>
      </div>
    </div>
  );
}
