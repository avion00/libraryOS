import { useState } from "react";
import { History, KeyRound, ShieldCheck, UserCog } from "lucide-react";
import { SettingsSectionHeader } from "./SettingsSectionHeader";
import { SettingField, settingInputClass } from "./SettingField";
import { SettingsRow } from "./SettingsRow";
import { Switch } from "./Switch";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { SESSION_TIMEOUT_OPTIONS } from "./types";

export function SecuritySettings({ onOpenAudit }: { onOpenAudit: () => void }) {
  const [passwordOpen, setPasswordOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-5 sm:p-6">
      <SettingsSectionHeader title="Security" subtitle="Manage administrator security and session protection." />

      <div className="divide-y divide-paper-500 border-t border-paper-500">
        <SettingsRow
          icon={ShieldCheck}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
          title="Two-Factor Authentication"
          description="Add an extra layer of security. Coming soon."
          trailing={<Switch checked={false} label="Two-Factor Authentication" disabled />}
        />
        <SettingsRow
          icon={KeyRound}
          iconBg="bg-slate-100"
          iconColor="text-slate-600"
          title="Password"
          description="Update your admin account password."
          trailing={<span className="text-[12.5px] font-semibold text-brand-600">Change password</span>}
          onClick={() => setPasswordOpen(true)}
        />
        <SettingsRow
          icon={UserCog}
          iconBg="bg-paper-500"
          iconColor="text-slate-500"
          title="Staff Access Roles"
          description="Manage roles & permissions."
          trailing={<span className="rounded-full bg-paper-500 px-2 py-0.5 text-[10.5px] font-semibold text-slate-500">Coming soon</span>}
          disabled
        />
        <SettingsRow
          icon={History}
          iconBg="bg-slate-100"
          iconColor="text-slate-600"
          title="Audit access"
          description="Review recent administrator activity."
          trailing={<span className="text-[12.5px] font-semibold text-brand-600">Review logs</span>}
          onClick={onOpenAudit}
        />
      </div>

      <div className="mt-4 border-t border-paper-500 pt-4">
        <SettingField label="Session Timeout" htmlFor="s_timeout" hint="Configured by your administrator." className="max-w-xs">
          <select id="s_timeout" disabled className={settingInputClass} value="60">
            {SESSION_TIMEOUT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </SettingField>
      </div>

      <ChangePasswordDialog open={passwordOpen} onClose={() => setPasswordOpen(false)} />
    </div>
  );
}
