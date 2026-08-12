import { CalendarClock, ChartNoAxesCombined, IndianRupee, Mail, MessageCircle } from "lucide-react";
import { SettingsSectionHeader } from "./SettingsSectionHeader";
import { SettingsRow } from "./SettingsRow";
import { Switch } from "./Switch";
import type { SettingsFormValues } from "./types";

export function NotificationSettings({
  values,
  onChange,
}: {
  values: SettingsFormValues;
  onChange: <K extends keyof SettingsFormValues>(key: K, value: SettingsFormValues[K]) => void;
}) {
  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-5 sm:p-6">
      <SettingsSectionHeader title="Notifications" subtitle="Choose which operational alerts you want to receive." />

      <div className="divide-y divide-paper-500 border-t border-paper-500">
        <SettingsRow
          icon={Mail}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
          title="Email reminders"
          description="Send email notifications to members."
          trailing={<Switch checked={values.notify_email} onChange={(v) => onChange("notify_email", v)} label="Email reminders" />}
        />
        <SettingsRow
          icon={MessageCircle}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          title="WhatsApp reminders"
          description="Send renewal/payment reminders via WhatsApp."
          trailing={<Switch checked={values.notify_whatsapp} onChange={(v) => onChange("notify_whatsapp", v)} label="WhatsApp reminders" />}
        />
        <SettingsRow
          icon={IndianRupee}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          title="Payment alerts"
          description="Notify about pending payments."
          trailing={<Switch checked={values.notify_due_payment} onChange={(v) => onChange("notify_due_payment", v)} label="Payment alerts" />}
        />
        <SettingsRow
          icon={CalendarClock}
          iconBg="bg-paper-700"
          iconColor="text-ink-700"
          title="Membership expiry reminders"
          description="Alert before membership expires."
          trailing={<Switch checked={values.notify_expiry} onChange={(v) => onChange("notify_expiry", v)} label="Membership expiry reminders" />}
        />
        <SettingsRow
          icon={ChartNoAxesCombined}
          iconBg="bg-paper-700"
          iconColor="text-ink-700"
          title="Daily summary"
          description="Receive a daily activity summary email."
          trailing={<Switch checked={values.notify_daily_summary} onChange={(v) => onChange("notify_daily_summary", v)} label="Daily summary" />}
        />
      </div>
    </div>
  );
}
