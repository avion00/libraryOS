import { CalendarDays, Sun } from "lucide-react";
import { LibraryHeroArt } from "./art/LibraryHeroArt";

export function WelcomeBanner({
  username,
  openHours = "7:00 AM – 10:00 PM",
  weather = "32°C  ·  Clear",
}: {
  username: string;
  openHours?: string;
  weather?: string;
}) {
  const today = new Date();
  const todayLabel = today.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="relative overflow-hidden rounded-2xl border border-paper-700 bg-gradient-to-br from-orange-50 via-paper-300 to-paper-500 sm:h-[200px]">
      <div className="absolute inset-y-0 right-0 hidden w-[54%] sm:block">
        <LibraryHeroArt className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-r from-paper-500 via-paper-500/50 to-transparent" style={{ width: "38%" }} />
      </div>

      <div className="relative z-10 flex w-full flex-col justify-center gap-4 px-6 py-6 sm:h-full sm:max-w-[58%] sm:px-8">
        <div>
          <h1 className="text-[22px] font-bold leading-tight text-slate-900 sm:text-[29px]">
            Welcome back, {username} <span aria-hidden>👋</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">Here&apos;s what&apos;s happening at your library today.</p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <div className="inline-flex items-center gap-2.5 rounded-xl border border-paper-700/80 bg-white px-3.5 py-2 shadow-card">
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            <span className="leading-tight">
              <span className="block text-[13px] font-semibold text-slate-800">Open now</span>
              <span className="block text-[11.5px] text-slate-400">{openHours}</span>
            </span>
          </div>
          <div className="inline-flex items-center gap-2.5 rounded-xl border border-paper-700/80 bg-white px-3.5 py-2 shadow-card">
            <CalendarDays className="h-4 w-4 shrink-0 text-ink-300" strokeWidth={2} />
            <span className="leading-tight">
              <span className="block text-[13px] font-semibold text-slate-800">Today</span>
              <span className="block text-[11.5px] text-slate-400">{todayLabel}</span>
            </span>
          </div>
          <div className="inline-flex items-center gap-2.5 rounded-xl border border-paper-700/80 bg-white px-3.5 py-2 shadow-card">
            <Sun className="h-4 w-4 shrink-0 text-amber-500" strokeWidth={2} />
            <span className="leading-tight">
              <span className="block text-[13px] font-semibold text-slate-800">Weather</span>
              <span className="block text-[11.5px] text-slate-400">{weather}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
