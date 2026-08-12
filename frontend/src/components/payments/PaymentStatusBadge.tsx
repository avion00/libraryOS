import type { PaymentStatus } from "../../api/types";
import { STATUS_META } from "./types";

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const meta = STATUS_META[status] ?? { label: status, bg: "bg-paper-500", text: "text-slate-500" };
  return (
    <span className={`inline-flex h-[23px] items-center rounded-full px-2.5 text-[11.5px] font-semibold ${meta.bg} ${meta.text}`}>
      {meta.label}
    </span>
  );
}
