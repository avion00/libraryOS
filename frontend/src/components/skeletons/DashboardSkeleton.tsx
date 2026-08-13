import { SkeletonBlock, SkeletonChartCard, SkeletonDonutCard, SkeletonListCard, SkeletonStatRow } from "./Skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <SkeletonBlock className="h-[164px] rounded-2xl" />

      <SkeletonStatRow count={8} gridClassName="grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[28fr_38fr_34fr]">
        <SkeletonDonutCard />
        <SkeletonChartCard />
        <SkeletonListCard rows={5} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SkeletonListCard rows={3} />
        <SkeletonListCard rows={3} />
        <SkeletonListCard rows={3} />
      </div>
    </div>
  );
}
