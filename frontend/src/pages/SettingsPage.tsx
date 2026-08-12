import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { settingsApi } from "../api/endpoints";
import { extractErrorMessage } from "../api/client";
import { useToast } from "../context/ToastContext";
import { ConfirmDialog, ErrorState, PageLoading } from "../components/ui";

import { SettingsSidebar } from "../components/settings/SettingsSidebar";
import { ProfileLibrarySettings } from "../components/settings/ProfileLibrarySettings";
import { MembershipSettings } from "../components/settings/MembershipSettings";
import { BillingSettings } from "../components/settings/BillingSettings";
import { NotificationSettings } from "../components/settings/NotificationSettings";
import { SecuritySettings } from "../components/settings/SecuritySettings";
import { IntegrationSettings } from "../components/settings/IntegrationSettings";
import { BackupSettings } from "../components/settings/BackupSettings";
import { PreferenceSettings } from "../components/settings/PreferenceSettings";
import { AuditLogSettings } from "../components/settings/AuditLogSettings";
import { SettingsActionBar } from "../components/settings/SettingsActionBar";
import type { ThemePreference } from "../components/settings/ThemeSelector";
import { DEFAULT_FORM_VALUES, toFormValues, validateForm, type SettingsFormValues, type SettingsSection } from "../components/settings/types";

const VALID_SECTIONS: SettingsSection[] = ["profile", "membership", "billing", "notifications", "security", "integrations", "backup", "preferences", "audit"];

function buildPayload(values: SettingsFormValues, logoFile: File | null): Record<string, unknown> | FormData {
  const payload: Record<string, unknown> = {
    library_name: values.library_name,
    phone: values.phone,
    email: values.email,
    address: values.address,
    website: values.website,
    tax_id: values.tax_id,
    total_seats: Number(values.total_seats),
    default_monthly_fee: Number(values.default_monthly_fee),
    membership_duration_policy: values.membership_duration_policy,
    expiring_soon_days: Number(values.expiring_soon_days),
    default_payment_method: values.default_payment_method,
    currency: values.currency,
    currency_symbol: values.currency_symbol,
    date_format: values.date_format,
    timezone: values.timezone,
    apply_tax: values.apply_tax,
    tax_label: values.tax_label,
    tax_rate: Number(values.tax_rate),
    receipt_footer_text: values.receipt_footer_text,
    notify_email: values.notify_email,
    notify_whatsapp: values.notify_whatsapp,
    notify_due_payment: values.notify_due_payment,
    notify_expiry: values.notify_expiry,
    notify_daily_summary: values.notify_daily_summary,
  };
  if (!logoFile) return payload;
  const formData = new FormData();
  for (const [key, value] of Object.entries(payload)) formData.append(key, String(value));
  formData.append("logo", logoFile);
  return formData;
}

export default function SettingsPage() {
  const { notify } = useToast();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const rawSection = searchParams.get("section");
  const section: SettingsSection = VALID_SECTIONS.includes(rawSection as SettingsSection) ? (rawSection as SettingsSection) : "profile";

  function setSection(next: SettingsSection) {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("section", next);
      return params;
    });
  }

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsApi.get().then((r) => r.data),
  });

  const [savedValues, setSavedValues] = useState<SettingsFormValues | null>(null);
  const [draft, setDraft] = useState<SettingsFormValues | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [accentColor, setAccentColor] = useState("orange");
  const [theme, setTheme] = useState<ThemePreference>("light");
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  useEffect(() => {
    if (data) {
      const values = toFormValues(data);
      setSavedValues(values);
      setDraft(values);
    }
  }, [data]);

  const errors = useMemo(() => (draft ? validateForm(draft) : {}), [draft]);
  const hasErrors = Object.keys(errors).length > 0;
  const dirty = useMemo(() => {
    if (!draft || !savedValues) return false;
    return logoFile !== null || JSON.stringify(draft) !== JSON.stringify(savedValues);
  }, [draft, savedValues, logoFile]);

  const mutation = useMutation({
    mutationFn: () => settingsApi.update(buildPayload(draft!, logoFile)),
    onSuccess: (resp) => {
      notify("Settings saved successfully", "success");
      const values = toFormValues(resp.data);
      setSavedValues(values);
      setDraft(values);
      setLogoFile(null);
      setLogoPreview(null);
      setIsEditingProfile(false);
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      queryClient.invalidateQueries({ queryKey: ["seats"] });
      queryClient.invalidateQueries({ queryKey: ["seat-map"] });
    },
    onError: (err) => notify(extractErrorMessage(err), "error"),
  });

  function set<K extends keyof SettingsFormValues>(key: K, value: SettingsFormValues[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  function handleLogoSelected(file: File) {
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function handleSave() {
    if (hasErrors) {
      notify("Fix the highlighted fields before saving.", "error");
      return;
    }
    mutation.mutate();
  }

  function handleCancelClick() {
    if (dirty) setCancelConfirmOpen(true);
  }

  function confirmCancel() {
    if (savedValues) setDraft(savedValues);
    setLogoFile(null);
    setLogoPreview(null);
    setIsEditingProfile(false);
    setCancelConfirmOpen(false);
  }

  function confirmReset() {
    setDraft(DEFAULT_FORM_VALUES);
    setResetConfirmOpen(false);
  }

  if (isLoading || !draft) return <PageLoading />;
  if (error || !data) return <ErrorState message="Unable to load settings." onRetry={() => refetch()} />;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-[28px] font-bold leading-tight text-slate-900">Settings</h1>
        <p className="mt-1 text-[14px] text-slate-500">Manage your library preferences, configurations and system settings.</p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <SettingsSidebar section={section} onChange={setSection} />

        <div className="min-w-0 flex-1">
          {section === "profile" && (
            <ProfileLibrarySettings
              values={draft}
              errors={errors}
              onChange={set}
              isEditing={isEditingProfile}
              onToggleEdit={() => setIsEditingProfile((v) => !v)}
              logoUrl={data.logo}
              logoPreview={logoPreview}
              onLogoSelected={handleLogoSelected}
            />
          )}
          {section === "membership" && <MembershipSettings values={draft} errors={errors} onChange={set} />}
          {section === "billing" && <BillingSettings values={draft} errors={errors} onChange={set} />}
          {section === "notifications" && <NotificationSettings values={draft} onChange={set} />}
          {section === "security" && <SecuritySettings onOpenAudit={() => setSection("audit")} />}
          {section === "integrations" && <IntegrationSettings />}
          {section === "backup" && <BackupSettings />}
          {section === "preferences" && (
            <PreferenceSettings
              values={draft}
              onChange={set}
              accentColor={accentColor}
              onAccentColorChange={setAccentColor}
              theme={theme}
              onThemeChange={setTheme}
              density={density}
              onDensityChange={setDensity}
            />
          )}
          {section === "audit" && <AuditLogSettings />}
        </div>
      </div>

      <SettingsActionBar dirty={dirty} saving={mutation.isPending} onReset={() => setResetConfirmOpen(true)} onCancel={handleCancelClick} onSave={handleSave} />

      <ConfirmDialog
        open={resetConfirmOpen}
        title="Reset settings to defaults?"
        message="This will replace your current configuration with the default LibraryOS settings. Nothing is saved until you click Save settings."
        confirmLabel="Reset settings"
        danger
        onConfirm={confirmReset}
        onCancel={() => setResetConfirmOpen(false)}
      />

      <ConfirmDialog
        open={cancelConfirmOpen}
        title="Discard unsaved changes?"
        message="Your recent changes will be lost."
        confirmLabel="Discard changes"
        danger
        onConfirm={confirmCancel}
        onCancel={() => setCancelConfirmOpen(false)}
      />
    </div>
  );
}
