import { SkeletonBlock, SkeletonListCard, SkeletonStatRow, SkeletonTableRows, SkeletonText } from "./Skeleton";

export function StudentsListSkeleton() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1">
        <SkeletonStatRow count={4} gridClassName="grid-cols-2 gap-3 lg:grid-cols-4" />

        <div className="mt-4 overflow-hidden rounded-2xl border border-paper-700 bg-white shadow-card">
          <div className="flex flex-wrap items-center gap-2.5 border-b border-paper-500 p-4">
            <SkeletonBlock className="h-10 min-w-[220px] flex-1 basis-[42%] rounded-lg" />
            <SkeletonBlock className="h-10 w-[150px] rounded-lg" />
            <SkeletonBlock className="h-10 w-[170px] rounded-lg" />
            <SkeletonBlock className="h-10 w-[140px] rounded-lg" />
          </div>
          <StudentsTableSkeleton />
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 lg:w-[300px] lg:shrink-0">
        <SkeletonListCard rows={3} />
        <SkeletonListCard rows={3} />
      </div>
    </div>
  );
}

export function StudentsTableSkeleton() {
  return (
    <div>
      <div className="flex items-center gap-4 border-b border-paper-500 px-4 py-2.5">
        <SkeletonText width="14px" />
        {["Student", "Phone", "Seat / Shifts", "Expiry", "Fee Status", "Status"].map((c) => (
          <SkeletonText key={c} width="70px" className="hidden sm:block" />
        ))}
      </div>
      <SkeletonTableRows rows={7} columns={6} />
    </div>
  );
}
