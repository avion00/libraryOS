import { SkeletonBlock, SkeletonDonutCard, SkeletonListCard, SkeletonStatRow, SkeletonTableRows } from "./Skeleton";

export function PaymentsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <SkeletonStatRow count={4} gridClassName="grid-cols-2 gap-3 sm:grid-cols-4" />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-paper-700 bg-white shadow-card">
          <div className="flex flex-wrap items-center gap-2.5 border-b border-paper-500 p-4">
            <SkeletonBlock className="h-10 min-w-[200px] flex-1 basis-[26%] rounded-lg" />
            <SkeletonBlock className="h-10 w-[142px] rounded-lg" />
            <SkeletonBlock className="h-10 w-[150px] rounded-lg" />
            <SkeletonBlock className="h-10 w-[152px] rounded-lg" />
            <SkeletonBlock className="h-10 w-[152px] rounded-lg" />
          </div>
          <SkeletonTableRows rows={7} columns={6} />
        </div>

        <div className="flex w-full flex-col gap-4 lg:w-[300px] lg:shrink-0">
          <SkeletonDonutCard />
          <SkeletonListCard rows={3} />
        </div>
      </div>
    </div>
  );
}
