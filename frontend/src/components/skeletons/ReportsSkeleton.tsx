import { SkeletonChartCard, SkeletonDonutCard, SkeletonListCard, SkeletonStatRow, SkeletonTableRows } from "./Skeleton";

/**
 * Shared shape for every Reports tab: a stat row, then a main region
 * (table or chart) alongside a 300px insights sidebar. Each tab passes its
 * own stat count/grid so the skeleton lines up with the real content.
 */
export function ReportsSkeleton({
  statCount = 3,
  gridClassName = "grid-cols-1 gap-3 sm:grid-cols-3",
  main = "table",
}: {
  statCount?: number;
  gridClassName?: string;
  main?: "table" | "chart";
}) {
  return (
    <div className="flex flex-col gap-4">
      <SkeletonStatRow count={statCount} gridClassName={gridClassName} />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {main === "chart" ? (
          <SkeletonChartCard className="min-w-0 flex-1" />
        ) : (
          <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-paper-700 bg-white shadow-card">
            <SkeletonTableRows rows={6} columns={5} />
          </div>
        )}

        <div className="flex w-full flex-col gap-4 lg:w-[300px] lg:shrink-0">
          <SkeletonDonutCard />
          <SkeletonListCard rows={3} />
        </div>
      </div>
    </div>
  );
}
