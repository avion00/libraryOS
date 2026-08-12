import { CreditCard } from "lucide-react";
import { SettingsSectionHeader } from "./SettingsSectionHeader";
import { SettingField, settingInputClass } from "./SettingField";
import { SettingsRow } from "./SettingsRow";
import { Switch } from "./Switch";
import type { FormErrors, SettingsFormValues } from "./types";

function GroupTitle({ children }: { children: string }) {
  return <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-slate-400">{children}</h3>;
}

export function BillingSettings({
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
      <SettingsSectionHeader title="Billing & Payments" subtitle="Configure payment defaults, receipts and billing preferences." />

      <GroupTitle>Payment defaults</GroupTitle>
      <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-3">
        <SettingField label="Default Payment Method" htmlFor="b_method">
          <select id="b_method" className={settingInputClass} value={values.default_payment_method} onChange={(e) => onChange("default_payment_method", e.target.value as SettingsFormValues["default_payment_method"])}>
            <option value="cash">Cash</option>
            <option value="online">Online</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="other">Other</option>
          </select>
        </SettingField>
        <SettingField label="Currency Code" htmlFor="b_currency" error={errors.currency}>
          <input id="b_currency" maxLength={3} className={`${settingInputClass} uppercase`} value={values.currency} onChange={(e) => onChange("currency", e.target.value.toUpperCase())} />
        </SettingField>
        <SettingField label="Currency Symbol" htmlFor="b_symbol" error={errors.currency_symbol}>
          <input id="b_symbol" className={settingInputClass} value={values.currency_symbol} onChange={(e) => onChange("currency_symbol", e.target.value)} />
        </SettingField>
      </div>

      <div className="my-6 border-t border-paper-500" />

      <GroupTitle>Receipt configuration</GroupTitle>
      <SettingField label="Receipt Footer Text" htmlFor="b_footer" hint="Shown at the bottom of every generated receipt.">
        <input id="b_footer" className={settingInputClass} placeholder="Thank you for being with us. Happy reading!" value={values.receipt_footer_text} onChange={(e) => onChange("receipt_footer_text", e.target.value)} />
      </SettingField>

      <div className="my-6 border-t border-paper-500" />

      <GroupTitle>Tax</GroupTitle>
      <div className="divide-y divide-paper-500 border-t border-paper-500">
        <SettingsRow
          icon={CreditCard}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
          title="Apply Tax (GST)"
          description="Include tax in invoices & receipts."
          trailing={<Switch checked={values.apply_tax} onChange={(v) => onChange("apply_tax", v)} label="Apply Tax (GST)" />}
        />
      </div>
      {values.apply_tax && (
        <div className="mt-1 grid grid-cols-2 gap-3 rounded-lg bg-paper-300 p-3">
          <SettingField label="Tax Label" htmlFor="b_tax_label" error={errors.tax_label}>
            <input id="b_tax_label" className={settingInputClass} value={values.tax_label} onChange={(e) => onChange("tax_label", e.target.value)} />
          </SettingField>
          <SettingField label="Tax Rate (%)" htmlFor="b_tax_rate" error={errors.tax_rate}>
            <input id="b_tax_rate" type="number" min={0} max={100} step="0.01" className={settingInputClass} value={values.tax_rate} onChange={(e) => onChange("tax_rate", e.target.value)} />
          </SettingField>
        </div>
      )}
    </div>
  );
}
