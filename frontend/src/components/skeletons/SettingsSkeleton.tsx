import { SkeletonBlock, SkeletonCircle, SkeletonText } from "./Skeleton";

/** Matches SettingsSidebar's 9-item nav list. */
function SettingsSidebarSkeleton() {
  return (
    <div className="w-full shrink-0 lg:w-[248px]">
      <div className="flex gap-1 overflow-x-auto pb-2 lg:block lg:space-y-0.5 lg:overflow-visible lg:pb-0">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 lg:w-full">
            <SkeletonCircle size={18} />
            <SkeletonText width={`${80 + (i % 3) * 20}px`} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Matches ProfileLibrarySettings-shaped form: labeled field rows in a card. */
function SettingsFormSkeleton() {
  return (
    <div className="min-w-0 flex-1 rounded-2xl border border-paper-700 bg-white p-5 shadow-card">
      <div className="flex items-center gap-4 border-b border-paper-500 pb-5">
        <SkeletonCircle size={64} />
        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-40" />
          <SkeletonText width="120px" />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <SkeletonText width="90px" />
            <SkeletonBlock className="h-9 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <SkeletonBlock className="h-7 w-32" />
        <SkeletonText width="280px" className="mt-2" />
      </div>

      <div className="flex flex-col gap-4 pb-28 lg:flex-row lg:items-start">
        <SettingsSidebarSkeleton />
        <SettingsFormSkeleton />
      </div>
    </div>
  );
}
