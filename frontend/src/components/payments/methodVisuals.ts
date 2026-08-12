import { Banknote, Landmark, Smartphone, Wallet, type LucideIcon } from "lucide-react";
import type { PaymentMethod } from "../../api/types";

export const METHOD_VISUAL: Record<PaymentMethod, { icon: LucideIcon; color: string; bar: string }> = {
  cash: { icon: Banknote, color: "text-emerald-600", bar: "bg-emerald-500" },
  online: { icon: Smartphone, color: "text-orange-600", bar: "bg-orange-500" },
  bank_transfer: { icon: Landmark, color: "text-ink-600", bar: "bg-ink-500" },
  other: { icon: Wallet, color: "text-amber-600", bar: "bg-amber-500" },
};
