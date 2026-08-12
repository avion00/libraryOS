import { formatDate } from "../../lib/format";

export function MembershipTimeline({ startDate, endDate }: { startDate: string; endDate: string }) {
  const start = new Date(`${startDate}T00:00:00`).getTime();
  const end = new Date(`${endDate}T00:00:00`).getTime();
  const now = Date.now();
  const total = Math.max(end - start, 1);
  const progress = Math.min(100, Math.max(0, ((now - start) / total) * 100));

  return (
    <div className="mt-4">
      <div className="relative h-1.5 w-full rounded-full bg-paper-500">
        <div className="absolute inset-y-0 left-0 rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
        <span className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-emerald-500" />
        <span
          className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-white bg-paper-700"
          style={{ left: "100%" }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-[11.5px]">
        <span>
          <span className="block font-semibold text-slate-700">{formatDate(startDate)}</span>
          <span className="text-slate-400">Membership started</span>
        </span>
        <span className="text-right">
          <span className="block font-semibold text-slate-700">{formatDate(endDate)}</span>
          <span className="text-slate-400">Membership ends</span>
        </span>
      </div>
    </div>
  );
}
