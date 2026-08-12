import { ReceiptText } from "lucide-react";
import type { Payment } from "../../api/types";
import { formatDate, formatMoney, formatTimeOnly } from "../../lib/format";
import { Avatar } from "../dashboard/Avatar";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { METHOD_LABEL } from "./types";
import { METHOD_VISUAL } from "./methodVisuals";

export function PaymentRow({ payment, onOpenReceipt }: { payment: Payment; onOpenReceipt: (payment: Payment) => void }) {
  const visual = METHOD_VISUAL[payment.method];
  const time = formatTimeOnly(payment.created_at);

  return (
    <tr className="transition-colors hover:bg-paper-300/70">
      <td className="px-4 py-3">
        <button onClick={() => onOpenReceipt(payment)} className="font-mono text-[12.5px] text-slate-500 hover:text-brand-600 hover:underline">
          {payment.receipt_number}
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={payment.student_name} size={32} />
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-semibold text-slate-800">{payment.student_name}</p>
            <p className="text-[11.5px] text-slate-400">{payment.student_code}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="text-[13px] text-slate-600">{formatDate(payment.payment_date)}</p>
        {time && <p className="text-[11px] text-slate-400">{time}</p>}
      </td>
      <td className="px-4 py-3 text-[13.5px] font-semibold text-slate-800">{formatMoney(payment.amount)}</td>
      <td className="px-4 py-3">
        <span className="flex items-center gap-1.5 text-[13px] text-slate-600">
          <visual.icon className={`h-3.5 w-3.5 shrink-0 ${visual.color}`} strokeWidth={2} />
          {METHOD_LABEL[payment.method]}
        </span>
      </td>
      <td className="px-4 py-3">
        <PaymentStatusBadge status={payment.status} />
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => onOpenReceipt(payment)}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-600 hover:text-brand-700"
        >
          <ReceiptText className="h-3.5 w-3.5" strokeWidth={2} />
          Receipt
        </button>
      </td>
    </tr>
  );
}
