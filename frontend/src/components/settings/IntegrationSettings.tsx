import { ChevronRight, Webhook } from "lucide-react";
import { SettingsSectionHeader } from "./SettingsSectionHeader";
import { SettingsRow } from "./SettingsRow";

const ROWS = [
  { title: "Payment Gateway", description: "Accept online payments automatically." },
  { title: "SMS / Email Provider", description: "Power delivery for reminders & alerts." },
  { title: "Webhooks & API", description: "Manage API access & webhooks." },
];

export function IntegrationSettings() {
  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-5 sm:p-6">
      <SettingsSectionHeader title="Integrations" subtitle="Connect LibraryOS with external services." />

      <div className="divide-y divide-paper-500 border-t border-paper-500">
        {ROWS.map((row) => (
          <SettingsRow
            key={row.title}
            icon={Webhook}
            iconBg="bg-paper-500"
            iconColor="text-slate-500"
            title={row.title}
            description={row.description}
            disabled
            trailing={
              <span className="flex items-center gap-2">
                <span className="rounded-full bg-paper-500 px-2 py-0.5 text-[10.5px] font-semibold text-slate-500">Not connected</span>
                <ChevronRight className="h-4 w-4 text-slate-300" strokeWidth={2} />
              </span>
            }
          />
        ))}
      </div>
    </div>
  );
}
