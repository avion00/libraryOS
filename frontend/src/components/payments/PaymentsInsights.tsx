import type { PaymentMethod } from "../../api/types";
import type { PendingFeeRow } from "../students/types";
import { PaymentOverview } from "./PaymentOverview";
import { PaymentMethodsCard } from "./PaymentMethodsCard";
import { RecentPendingPayments } from "./RecentPendingPayments";
import { CollectionTrend } from "./CollectionTrend";

export function PaymentsInsights({
  paid,
  pending,
  partial,
  methodBreakdown,
  pendingFeeRows,
  trendData,
}: {
  paid: number;
  pending: number;
  partial: number;
  methodBreakdown: { method: PaymentMethod; total: number }[];
  pendingFeeRows: PendingFeeRow[];
  trendData: { label: string; amount: number }[];
}) {
  return (
    <div className="flex w-full flex-col gap-4 lg:w-[300px] lg:shrink-0">
      <PaymentOverview paid={paid} pending={pending} partial={partial} />
      <PaymentMethodsCard breakdown={methodBreakdown} />
      <RecentPendingPayments rows={pendingFeeRows} />
      <CollectionTrend data={trendData} />
    </div>
  );
}
