import { Pencil, X } from "lucide-react";
import { SettingsSectionHeader } from "./SettingsSectionHeader";
import { SettingField, settingInputClass } from "./SettingField";
import { LogoUploader } from "./LogoUploader";
import type { FormErrors, SettingsFormValues } from "./types";

const TIMEZONES = ["UTC", "Asia/Kolkata", "Asia/Dubai", "Asia/Singapore", "Asia/Karachi", "Asia/Dhaka", "Europe/London", "America/New_York", "America/Los_Angeles"];

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12px] font-medium text-slate-400">{label}</p>
      <p className="mt-1 text-[14.5px] text-slate-800">{value || <span className="text-slate-300">—</span>}</p>
    </div>
  );
}

export function ProfileLibrarySettings({
  values,
  errors,
  onChange,
  isEditing,
  onToggleEdit,
  logoUrl,
  logoPreview,
  onLogoSelected,
}: {
  values: SettingsFormValues;
  errors: FormErrors;
  onChange: <K extends keyof SettingsFormValues>(key: K, value: SettingsFormValues[K]) => void;
  isEditing: boolean;
  onToggleEdit: () => void;
  logoUrl: string | null;
  logoPreview: string | null;
  onLogoSelected: (file: File) => void;
}) {
  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-5 sm:p-6">
      <SettingsSectionHeader
        title="Profile & Library"
        subtitle="Update your library information and contact details."
        action={
          <button
            onClick={onToggleEdit}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-paper-700 px-3.5 text-[13px] font-medium text-slate-600 transition-colors hover:bg-paper-300"
          >
            {isEditing ? <X className="h-3.5 w-3.5" strokeWidth={2} /> : <Pencil className="h-3.5 w-3.5" strokeWidth={2} />}
            {isEditing ? "Cancel editing" : "Edit"}
          </button>
        }
      />

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="shrink-0">
          {isEditing ? (
            <LogoUploader currentUrl={logoUrl} previewUrl={logoPreview} onFileSelected={onLogoSelected} />
          ) : (
            <div className="flex h-[130px] w-[130px] items-center justify-center overflow-hidden rounded-[22px] bg-gradient-to-br from-brand-300 to-brand-500">
              {logoUrl ? <img src={logoUrl} alt="" className="h-full w-full object-cover" /> : <span className="text-[42px] font-bold text-ink-900">{values.library_name.charAt(0) || "L"}</span>}
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="grid flex-1 grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            <SettingField label="Library Name" htmlFor="p_library_name" error={errors.library_name} className="sm:col-span-2">
              <input id="p_library_name" className={settingInputClass} value={values.library_name} onChange={(e) => onChange("library_name", e.target.value)} />
            </SettingField>
            <SettingField label="Phone" htmlFor="p_phone" error={errors.phone}>
              <input id="p_phone" className={settingInputClass} value={values.phone} onChange={(e) => onChange("phone", e.target.value)} />
            </SettingField>
            <SettingField label="Address" htmlFor="p_address">
              <input id="p_address" className={settingInputClass} value={values.address} onChange={(e) => onChange("address", e.target.value)} />
            </SettingField>
            <SettingField label="Email" htmlFor="p_email" error={errors.email}>
              <input id="p_email" type="email" className={settingInputClass} value={values.email} onChange={(e) => onChange("email", e.target.value)} />
            </SettingField>
            <SettingField label="Website" htmlFor="p_website" error={errors.website}>
              <input id="p_website" className={settingInputClass} placeholder="www.example.com" value={values.website} onChange={(e) => onChange("website", e.target.value)} />
            </SettingField>
            <SettingField label="Timezone" htmlFor="p_timezone" className="sm:col-span-2">
              <select id="p_timezone" className={settingInputClass} value={values.timezone} onChange={(e) => onChange("timezone", e.target.value)}>
                {!TIMEZONES.includes(values.timezone) && <option value={values.timezone}>{values.timezone}</option>}
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </SettingField>
          </div>
        ) : (
          <div className="grid flex-1 grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            <InfoField label="Library Name" value={values.library_name} />
            <InfoField label="Address" value={values.address} />
            <InfoField label="Phone" value={values.phone} />
            <InfoField label="Website" value={values.website} />
            <InfoField label="Email" value={values.email} />
            <InfoField label="Timezone" value={values.timezone} />
          </div>
        )}
      </div>

      <div className="my-6 border-t border-paper-500" />

      <h3 className="mb-4 text-[14.5px] font-semibold text-slate-900">Business Information</h3>
      {isEditing ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          <SettingField label="Business / Tax ID" htmlFor="p_tax_id">
            <input id="p_tax_id" className={settingInputClass} placeholder="Optional" value={values.tax_id} onChange={(e) => onChange("tax_id", e.target.value)} />
          </SettingField>
          <SettingField label="Currency Code" htmlFor="p_currency" error={errors.currency}>
            <input id="p_currency" maxLength={3} className={`${settingInputClass} uppercase`} value={values.currency} onChange={(e) => onChange("currency", e.target.value.toUpperCase())} />
          </SettingField>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          <InfoField label="Business / Tax ID" value={values.tax_id || "Not configured"} />
          <InfoField label="Currency" value={`${values.currency} (${values.currency_symbol})`} />
          <InfoField label="Date Format" value={values.date_format} />
        </div>
      )}
    </div>
  );
}
