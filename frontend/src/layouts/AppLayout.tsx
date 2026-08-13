import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  Armchair,
  ChartNoAxesCombined,
  CreditCard,
  GraduationCap,
  House,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
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

export default function AppLayout() {
  const { logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-paper-300">
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-[#0B1117]/40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={clsx(
          "fixed z-40 flex h-full w-64 flex-col border-r border-paper-700 bg-white transition-transform lg:static lg:z-auto lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-paper-700 px-5 py-4">
          <LogoLockup tone={isDark ? "light" : "dark"} />
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-paper-500 hover:text-slate-600 lg:hidden"
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
                  isActive ? "bg-brand-50 text-brand-600" : "text-slate-600 hover:bg-paper-500"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-brand-500" aria-hidden="true" />
                  )}
                  <item.icon className={clsx("h-[19px] w-[19px]", isActive ? "text-brand-600" : "text-slate-400")} strokeWidth={2} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <SidebarPromoCard />

        <div className="border-t border-paper-700 p-3">
          <button
            onClick={handleLogout}
            className="mt-1.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-red-500/10 hover:text-red-600"
          >
            <LogOut className="h-4 w-4 ml-2 mr-1" strokeWidth={2} />
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
