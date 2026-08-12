import { QRCodeSVG } from "qrcode.react";
import {
  Armchair,
  Banknote,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Info,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Receipt } from "../../api/types";
import { formatDate } from "../../lib/format";
import { LogoMark } from "../dashboard/art/Logo";
import { Avatar } from "../dashboard/Avatar";
import { METHOD_LABEL, STATUS_META } from "./types";
import { METHOD_VISUAL } from "./methodVisuals";

function formatMoney2(amount: number, symbol: string): string {
  return `${symbol}${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function DetailRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-1.5 text-slate-500">
        <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
        {label}
      </span>
      <span className="text-right font-medium text-slate-700">{value}</span>
    </div>
  );
}

export function ReceiptDocument({
  receipt,
  studentEmail,
  logoUrl,
  issueDate,
  paymentRef,
  collectedBy,
  verificationPayload,
  applyTax = false,
  taxLabel = "Tax",
  taxRate = 0,
  footerText,
}: {
  receipt: Receipt;
  studentEmail?: string;
  logoUrl?: string | null;
  issueDate: string;
  paymentRef: string;
  collectedBy: string | null;
  verificationPayload: string;
  applyTax?: boolean;
  taxLabel?: string;
  taxRate?: number;
  footerText?: string;
}) {
  const statusMeta = STATUS_META[receipt.status] ?? { label: receipt.status, bg: "bg-paper-500", text: "text-slate-500" };
  const methodVisual = METHOD_VISUAL[receipt.method];
  const sym = receipt.currency_symbol;
  // The recorded payment amount is always the actual total collected (the
  // ledger figure shown everywhere else in the app) — tax is decomposed out
  // of it for display, never added on top, so the total never drifts from
  // what was really charged.
  const total = Number(receipt.amount);
  const subtotal = applyTax && taxRate > 0 ? total / (1 + taxRate / 100) : total;
  const taxAmount = total - subtotal;

  return (
    <div id="receipt-print" className="rounded-xl border border-paper-700 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-paper-500 pb-4">
        <div className="flex items-start gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt="" className="h-11 w-11 shrink-0 rounded-xl object-cover" />
          ) : (
            <LogoMark className="h-11 w-11 shrink-0" />
          )}
          <div>
            <p className="text-[19px] font-bold leading-tight text-slate-900">{receipt.library.name}</p>
            {receipt.library.address && <p className="text-[12px] text-slate-500">{receipt.library.address}</p>}
            <p className="text-[12px] text-slate-500">
              {receipt.library.phone}
              {receipt.library.phone && receipt.library.email && "  •  "}
              {receipt.library.email}
            </p>
            <p className="mt-1 text-[12px] text-slate-400">Payment receipt</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2.5">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${statusMeta.bg} ${statusMeta.text}`}>
            <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.2} />
            {statusMeta.label}
          </span>
          <div className="space-y-1.5 text-right">
            <div>
              <p className="text-[10.5px] font-medium uppercase tracking-wide text-slate-400">Receipt No.</p>
              <p className="text-[13px] font-semibold text-slate-700">{receipt.receipt_number}</p>
            </div>
            <div>
              <p className="text-[10.5px] font-medium uppercase tracking-wide text-slate-400">Issue Date</p>
              <p className="text-[13px] font-semibold text-slate-700">{issueDate}</p>
            </div>
            <div>
              <p className="text-[10.5px] font-medium uppercase tracking-wide text-slate-400">Payment Ref.</p>
              <p className="text-[13px] font-semibold text-slate-700">{paymentRef}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-4 sm:grid-cols-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Billed To</p>
          <div className="mt-2 flex items-center gap-2.5">
            <Avatar name={receipt.student.full_name} size={36} />
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-semibold text-slate-800">{receipt.student.full_name}</p>
              <p className="text-[11.5px] text-slate-400">{receipt.student.student_code}</p>
            </div>
          </div>
          <div className="mt-3 space-y-1.5 text-[12px] text-slate-500">
            {studentEmail && (
              <p className="flex items-center gap-1.5">
                <Mail className="h-3 w-3 shrink-0 text-slate-400" strokeWidth={2} />
                <span className="truncate">{studentEmail}</span>
              </p>
            )}
            {receipt.student.phone && (
              <p className="flex items-center gap-1.5">
                <Phone className="h-3 w-3 shrink-0 text-slate-400" strokeWidth={2} />
                {receipt.student.phone}
              </p>
            )}
            <p className="flex items-center gap-1.5">
              <UserRound className="h-3 w-3 shrink-0 text-slate-400" strokeWidth={2} />
              Student
            </p>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Payment Details</p>
          <div className="mt-2 space-y-2 text-[12.5px]">
            <DetailRow icon={Armchair} label="Seat" value={receipt.seat_number != null ? `Seat ${receipt.seat_number}` : "—"} />
            <DetailRow icon={Clock3} label="Shift" value={receipt.shifts.length > 0 ? receipt.shifts.join(", ") : "—"} />
            <DetailRow
              icon={CalendarDays}
              label="Billing Period"
              value={receipt.billing_period ? `${formatDate(receipt.billing_period.start_date)} – ${formatDate(receipt.billing_period.expiry_date)}` : "—"}
            />
            <DetailRow icon={CalendarDays} label="Payment Date" value={formatDate(receipt.payment_date)} />
            <DetailRow icon={methodVisual.icon} label="Method" value={METHOD_LABEL[receipt.method]} />
            <DetailRow icon={UserRound} label="Collected By" value={collectedBy ?? "—"} />
          </div>
        </div>

        <div className="rounded-xl bg-paper-300 p-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Amount Summary</p>
          <div className="mt-2 space-y-1.5 text-[12.5px] text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatMoney2(subtotal, sym)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>{formatMoney2(0, sym)}</span>
            </div>
            <div className="flex justify-between">
              <span>
                {taxLabel} ({applyTax ? taxRate : 0}%)
              </span>
              <span>{formatMoney2(taxAmount, sym)}</span>
            </div>
          </div>
          <div className="mt-2.5 border-t border-paper-700 pt-2.5">
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-400">Total Amount</p>
            <p className="mt-0.5 text-[28px] font-bold leading-none text-brand-600">{formatMoney2(total, sym).replace(/\.00$/, "")}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-emerald-50 px-4 py-3">
        <span className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
            <Banknote className="h-4 w-4" strokeWidth={2} />
          </span>
          <span>
            <span className="block text-[10.5px] font-semibold uppercase tracking-wide text-emerald-700/70">Payment Method</span>
            <span className="block text-[13px] font-semibold text-slate-800">{METHOD_LABEL[receipt.method]}</span>
          </span>
        </span>
        <span className={`inline-flex h-[23px] items-center rounded-full px-2.5 text-[11.5px] font-semibold ${statusMeta.bg} ${statusMeta.text}`}>
          {statusMeta.label}
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-4 rounded-xl border border-paper-700 bg-info-50 p-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-start gap-2.5">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-info-600" strokeWidth={2} />
          <p className="text-[12.5px] leading-relaxed text-info-700">
            This receipt confirms successful payment.
            <br />
            Keep for your records.
          </p>
        </div>
        <div className="flex items-center gap-3 sm:border-l sm:border-paper-700 sm:pl-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-sm">
            <QRCodeSVG value={verificationPayload} size={48} />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-info-700">Verify this receipt</p>
            <p className="text-[11px] leading-snug text-info-600/80">Scan to verify authenticity or contact our support.</p>
          </div>
        </div>
      </div>

      {footerText && <p className="mt-4 text-center text-[12px] italic text-slate-400">{footerText}</p>}
    </div>
  );
}
