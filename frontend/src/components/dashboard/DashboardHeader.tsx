import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, CalendarDays, ChevronDown, KeyRound, LogOut, Search, Settings as SettingsIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Avatar } from "./Avatar";

const ROLE_LABEL: Record<string, string> = {
  superadmin: "Administrator",
  admin: "Administrator",
  staff: "Staff",
};

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const dateLabel = now.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  const dayLabel = now.toLocaleDateString(undefined, { weekday: "long" });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setNotifOpen(false);
        setUserOpen(false);
      }
    }
    function onClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`/students?search=${encodeURIComponent(q)}`);
  }

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const roleLabel = user ? ROLE_LABEL[user.role] ?? user.role : "";

  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between gap-4 border-b border-paper-700 bg-white px-4 sm:px-6">
      <form onSubmit={handleSearchSubmit} className="hidden min-w-0 flex-1 max-w-md md:block">
        <div className="flex items-center gap-2 rounded-lg border border-paper-700 bg-paper-300 px-3 py-2 text-sm text-slate-500 transition-colors focus-within:border-brand-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-100">
          <Search className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={2} />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search students, seats, payments..."
            className="w-full min-w-0 bg-transparent text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
          <kbd className="hidden shrink-0 items-center gap-0.5 rounded border border-paper-700 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-400 sm:inline-flex">
            Ctrl + K
          </kbd>
        </div>
      </form>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-paper-500 hover:text-slate-700"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" strokeWidth={2} />
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white ring-2 ring-white">
              3
            </span>
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-12 z-20 w-72 rounded-xl border border-paper-700 bg-white p-2 shadow-card-hover">
              <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Notifications</p>
              <div className="rounded-lg px-2 py-2 text-sm text-slate-600 hover:bg-paper-300">3 memberships expiring this week</div>
              <div className="rounded-lg px-2 py-2 text-sm text-slate-600 hover:bg-paper-300">3 students have pending fees</div>
              <div className="rounded-lg px-2 py-2 text-sm text-slate-600 hover:bg-paper-300">Daily backup completed successfully</div>
            </div>
          )}
        </div>

        <div className="hidden items-center gap-2 border-l border-paper-700 pl-3 text-right sm:flex">
          <CalendarDays className="h-4 w-4 text-ink-300" strokeWidth={2} />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-800">{dateLabel}</p>
            <p className="text-xs text-slate-400">{dayLabel}</p>
          </div>
        </div>

        <div className="relative border-l border-paper-700 pl-3" ref={userRef}>
          <button onClick={() => setUserOpen((v) => !v)} className="flex items-center gap-2.5 rounded-lg py-1 pr-1 hover:bg-paper-300">
            <span className="relative">
              <Avatar name={user?.username ?? "Admin"} size={38} />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </span>
            <span className="hidden text-left leading-tight lg:block">
              <span className="block text-sm font-semibold text-slate-800">{user?.username}</span>
              <span className="block text-xs text-slate-400">{roleLabel}</span>
            </span>
            <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" strokeWidth={2} />
          </button>
          {userOpen && (
            <div className="absolute right-0 top-14 z-20 w-56 rounded-xl border border-paper-700 bg-white p-1.5 shadow-card-hover">
              <div className="px-2.5 py-2">
                <p className="text-sm font-semibold text-slate-800">{user?.username}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
              <div className="my-1 border-t border-paper-500" />
              <Link
                to="/settings"
                onClick={() => setUserOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-600 hover:bg-paper-300"
              >
                <SettingsIcon className="h-4 w-4" strokeWidth={2} /> Settings
              </Link>
              <Link
                to="/settings"
                onClick={() => setUserOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-600 hover:bg-paper-300"
              >
                <KeyRound className="h-4 w-4" strokeWidth={2} /> Change password
              </Link>
              <div className="my-1 border-t border-paper-500" />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" strokeWidth={2} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
