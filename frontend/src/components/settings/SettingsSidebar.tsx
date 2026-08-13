import {
  Bell,
  CreditCard,
  DatabaseBackup,
  History,
  Landmark,
  Puzzle,
  ShieldCheck,
  SlidersHorizontal,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { SettingsSection } from "./types";

const ITEMS: { key: SettingsSection; label: string; icon: LucideIcon }[] = [
  { key: "profile", label: "Profile & Library", icon: Landmark },
  { key: "membership", label: "Membership & Seats", icon: UsersRound },
  { key: "billing", label: "Billing & Payments", icon: CreditCard },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: ShieldCheck },
  { key: "integrations", label: "Integrations", icon: Puzzle },
  { key: "backup", label: "Backup & Data", icon: DatabaseBackup },
  { key: "preferences", label: "Preferences", icon: SlidersHorizontal },
  { key: "audit", label: "Audit Logs", icon: History },
];

export function SettingsSidebar({ section, onChange }: { section: SettingsSection; onChange: (s: SettingsSection) => void }) {
  return (
    <nav aria-label="Settings categories" className="w-full shrink-0 lg:w-[248px]">
      <div className="flex gap-1 overflow-x-auto pb-2 lg:block lg:space-y-0.5 lg:overflow-visible lg:pb-0">
        {ITEMS.map((item) => {
          const active = item.key === section;
          return (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              aria-current={active ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors lg:w-full ${
                active ? "bg-white text-brand-600 shadow-sm" : "text-slate-600 hover:bg-paper-500"
              }`}
            >
              <item.icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-brand-600" : "text-slate-400"}`} strokeWidth={2} />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
