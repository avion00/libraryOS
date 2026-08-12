import { useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  Armchair,
  ChartNoAxesCombined,
  ChevronDown,
  CreditCard,
  GraduationCap,
  House,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { SidebarPromoCard } from "../components/dashboard/SidebarPromoCard";
import { LogoLockup } from "../components/dashboard/art/Logo";

const NAV = [
  { to: "/", label: "Dashboard", icon: House, end: true },
  { to: "/students", label: "Students", icon: GraduationCap },
  { to: "/seats", label: "Seats & Shifts", icon: Armchair },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/reports", label: "Reports", icon: ChartNoAxesCombined },
  { to: "/settings", label: "Settings", icon: Settings },
];

const ROLE_LABEL: Record<string, string> = {
  superadmin: "Administrator",
  admin: "Administrator",
  staff: "Staff",
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const roleLabel = user ? ROLE_LABEL[user.role] ?? user.role : "";

  return (
    <div className="flex h-screen overflow-hidden bg-paper-300">
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={clsx(
          "fixed z-40 flex h-full w-64 flex-col bg-ink-900 transition-transform lg:static lg:z-auto lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-5 py-4">
          <LogoLockup />
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1 text-ink-100 hover:bg-white/5 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                clsx(
                  "relative flex items-center gap-3 rounded-[9px] px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-brand-400/[0.12] text-brand-400" : "text-ink-50 hover:bg-white/5"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-brand-400" aria-hidden="true" />
                  )}
                  <item.icon className={clsx("h-[19px] w-[19px]", isActive ? "text-brand-400" : "text-ink-100")} strokeWidth={2} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <SidebarPromoCard />

        <div className="border-t border-white/10 p-3">
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-white/5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-ink-50">
                <ShieldCheck className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-sm font-semibold text-white">{user?.username}</span>
                <span className="block text-xs text-ink-200">{roleLabel}</span>
              </span>
              <ChevronDown className={clsx("h-4 w-4 shrink-0 text-ink-200 transition-transform", userMenuOpen && "rotate-180")} />
            </button>
            {userMenuOpen && (
              <div className="absolute bottom-12 left-0 z-20 w-full rounded-xl border border-paper-700 bg-white p-1.5 shadow-card-hover">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate("/settings");
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-600 hover:bg-paper-300"
                >
                  <Settings className="h-4 w-4" strokeWidth={2} /> Settings
                </button>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="mt-1.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-100 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center border-b border-paper-700 bg-white px-4 py-2.5 lg:hidden">
          <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 hover:bg-paper-500" aria-label="Open menu">
            <Menu className="h-5 w-5 text-slate-600" />
          </button>
        </div>
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
