import { CreditCard, IndianRupee, ReceiptText, TrendingDown, TrendingUp, Clock3 } from "lucide-react";
import { StudentStatCard } from "../students/StudentStatCard";
import { formatMoney } from "../../lib/format";

function TrendBadge({ pct }: { pct: number }) {
  const up = pct >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11.5px] font-semibold ${up ? "text-emerald-600" : "text-rose-600"}`}>
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {Math.abs(pct).toFixed(1)}% from last month
    </span>
  );
}

export function PaymentsSummary({
  totalThisMonth,
  trendPct,
  paidThisMonth,
  paidPct,
  pendingThisMonth,
  pendingPct,
  countThisMonth,
}: {
  totalThisMonth: number;
  trendPct: number;
  paidThisMonth: number;
  paidPct: number;
  pendingThisMonth: number;
  pendingPct: number;
  countThisMonth: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StudentStatCard
        icon={IndianRupee}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
        title="Total Collection"
        value={formatMoney(totalThisMonth)}
        footer="This month"
        rightSlot={<TrendBadge pct={trendPct} />}
      />
      <StudentStatCard
        icon={CreditCard}
        iconBg="bg-paper-700"
        iconColor="text-ink-700"
        title="Paid Amount"
        value={formatMoney(paidThisMonth)}
        footer={`${paidPct.toFixed(1)}% of total`}
      />
      <StudentStatCard
        icon={Clock3}
        iconBg="bg-orange-100"
        iconColor="text-orange-600"
        title="Pending Amount"
        value={formatMoney(pendingThisMonth)}
        footer={`${pendingPct.toFixed(1)}% of total`}
      />
      <StudentStatCard
        icon={ReceiptText}
        iconBg="bg-paper-700"
        iconColor="text-ink-700"
        title="Total Payments"
        value={String(countThisMonth)}
        footer="This month"
      />
    </div>
  );
}
