import { SettingsSectionHeader } from "./SettingsSectionHeader";
import { SettingField, settingInputClass } from "./SettingField";
import { AccentColorPicker } from "./AccentColorPicker";
import { ThemeSelector } from "./ThemeSelector";
import type { SettingsFormValues } from "./types";

const TIMEZONES = ["UTC", "Asia/Kolkata", "Asia/Dubai", "Asia/Singapore", "Asia/Karachi", "Asia/Dhaka", "Europe/London", "America/New_York", "America/Los_Angeles"];

function GroupTitle({ children }: { children: string }) {
  return <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-slate-400">{children}</h3>;
}

export function PreferenceSettings({
  values,
  onChange,
  accentColor,
  onAccentColorChange,
  density,
  onDensityChange,
}: {
  values: SettingsFormValues;
  onChange: <K extends keyof SettingsFormValues>(key: K, value: SettingsFormValues[K]) => void;
  accentColor: string;
  onAccentColorChange: (key: string) => void;
  density: "comfortable" | "compact";
  onDensityChange: (v: "comfortable" | "compact") => void;
}) {
  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-5 sm:p-6">
      <SettingsSectionHeader title="Preferences" subtitle="Personalize how LibraryOS looks and behaves." />

      <GroupTitle>Appearance</GroupTitle>
      <div className="space-y-4">
        <ThemeSelector />
        <AccentColorPicker value={accentColor} onChange={onAccentColorChange} />

        <div>
          <p className="mb-1.5 text-[12.5px] font-medium text-slate-600">Density</p>
          <div className="inline-flex rounded-lg border border-paper-700 p-1">
            {(["comfortable", "compact"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => onDensityChange(d)}
                className={`rounded-md px-3 py-1.5 text-[12.5px] font-medium capitalize transition-colors ${
                  density === d ? "bg-brand-50 text-brand-700 ring-1 ring-brand-200" : "text-slate-500 hover:bg-paper-300"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400">Applies once layout density support ships.</p>
        </div>
      </div>

      <div className="my-6 border-t border-paper-500" />

      <GroupTitle>Regional</GroupTitle>
      <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        <SettingField label="Date Format" htmlFor="pr_date_format">
          <select id="pr_date_format" className={settingInputClass} value={values.date_format} onChange={(e) => onChange("date_format", e.target.value)}>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </SettingField>
        <SettingField label="Timezone" htmlFor="pr_timezone">
          <select id="pr_timezone" className={settingInputClass} value={values.timezone} onChange={(e) => onChange("timezone", e.target.value)}>
            {!TIMEZONES.includes(values.timezone) && <option value={values.timezone}>{values.timezone}</option>}
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </SettingField>
      </div>
    </div>
  );
}
