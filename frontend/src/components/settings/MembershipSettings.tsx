import { Armchair, CalendarClock } from "lucide-react";
import { SettingsSectionHeader } from "./SettingsSectionHeader";
import { SettingField, settingInputClass } from "./SettingField";
import { SettingsRow } from "./SettingsRow";
import { Switch } from "./Switch";
import type { FormErrors, SettingsFormValues } from "./types";

function GroupTitle({ children }: { children: string }) {
  return <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-slate-400">{children}</h3>;
}

export function MembershipSettings({
  values,
  errors,
  onChange,
}: {
  values: SettingsFormValues;
  errors: FormErrors;
  onChange: <K extends keyof SettingsFormValues>(key: K, value: SettingsFormValues[K]) => void;
}) {
  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-5 sm:p-6">
      <SettingsSectionHeader title="Membership & Seats" subtitle="Manage seat capacity and membership defaults." />

      <GroupTitle>Seat configuration</GroupTitle>
      <SettingField label="Total Seats" htmlFor="m_total_seats" hint="Increasing this number automatically creates the newly available seats." error={errors.total_seats} className="max-w-xs">
        <input id="m_total_seats" type="number" min={1} className={settingInputClass} value={values.total_seats} onChange={(e) => onChange("total_seats", e.target.value)} />
      </SettingField>
      <div className="mt-4 divide-y divide-paper-500 border-t border-paper-500">
        <SettingsRow icon={Armchair} iconBg="bg-emerald-50" iconColor="text-emerald-600" title="Auto-create newly available seats" description="Always on — happens automatically whenever you raise the total above." trailing={<span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">Always on</span>} disabled />
      </div>

      <div className="my-6 border-t border-paper-500" />

      <GroupTitle>Membership defaults</GroupTitle>
      <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        <SettingField label="Default Monthly Fee (₹)" htmlFor="m_fee" error={errors.default_monthly_fee}>
          <input id="m_fee" type="number" min={0} step="0.01" className={settingInputClass} value={values.default_monthly_fee} onChange={(e) => onChange("default_monthly_fee", e.target.value)} />
        </SettingField>
        <SettingField label="Expiring-soon Window (days)" htmlFor="m_window" error={errors.expiring_soon_days}>
          <input id="m_window" type="number" min={1} className={settingInputClass} value={values.expiring_soon_days} onChange={(e) => onChange("expiring_soon_days", e.target.value)} />
        </SettingField>
        <SettingField label="Membership Duration Policy" htmlFor="m_policy" className="sm:col-span-2">
          <select id="m_policy" className={settingInputClass} value={values.membership_duration_policy} onChange={(e) => onChange("membership_duration_policy", e.target.value as SettingsFormValues["membership_duration_policy"])}>
            <option value="calendar_month">Same date next month (e.g. Aug 1 → Aug 31)</option>
            <option value="30_days">Fixed 30 days</option>
          </select>
        </SettingField>
      </div>

      <div className="my-6 border-t border-paper-500" />

      <GroupTitle>Renewal behavior</GroupTitle>
      <div className="divide-y divide-paper-500 border-t border-paper-500">
        <SettingsRow
          icon={CalendarClock}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
          title="Renewal reminders"
          description="Send reminders before membership expiry."
          trailing={<Switch checked={values.notify_expiry} onChange={(v) => onChange("notify_expiry", v)} label="Renewal reminders" />}
        />
      </div>
    </div>
  );
}
