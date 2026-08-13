import { useQuery } from "@tanstack/react-query";
import { Armchair, GraduationCap, IndianRupee, PieChart, ReceiptText, WalletCards } from "lucide-react";
import { dashboardApi, reportsApi } from "../api/endpoints";
import { ErrorState } from "../components/ui";
import { DashboardSkeleton } from "../components/skeletons/DashboardSkeleton";
import { WelcomeBanner } from "../components/dashboard/WelcomeBanner";
import { StatCard } from "../components/dashboard/StatCard";
import { SeatOccupancyCard } from "../components/dashboard/SeatOccupancyCard";
import { SeatUtilizationChart } from "../components/dashboard/SeatUtilizationChart";
import { RecentPayments } from "../components/dashboard/RecentPayments";
import { ExpiringMemberships } from "../components/dashboard/ExpiringMemberships";
import { MembershipPlanSummary } from "../components/dashboard/MembershipPlanSummary";
import { RecentCheckins } from "../components/dashboard/RecentCheckins";
import { formatMoney } from "../lib/format";
import { useAuth } from "../context/AuthContext";

interface CollectionsSummary {
  payment_count: number;
}

export default function DashboardPage() {
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardApi.get().then((r) => r.data),
    refetchInterval: 60_000,
  });

  const { data: todayCollections } = useQuery({
    queryKey: ["reports", "collections", "today"],
    queryFn: () => reportsApi.collections({ range: "today" }).then((r) => r.data as CollectionsSummary),
  });

  const { data: monthCollections } = useQuery({
    queryKey: ["reports", "collections", "month"],
    queryFn: () => reportsApi.collections({ range: "month" }).then((r) => r.data as CollectionsSummary),
  });

  if (isLoading) return <DashboardSkeleton />;
  if (error || !data) return <ErrorState message="Could not load the dashboard." onRetry={() => refetch()} />;

  const sym = data.currency_symbol;

  return (
    <div className="flex animate-fadeIn flex-col gap-4">
      <WelcomeBanner username={user?.username ?? "admin"} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
        <StatCard
          icon={Armchair}
          iconBg="bg-orange-100"
          iconColor="text-orange-700"
          label="Total Seats"
          value={String(data.seats.total)}
          hint={`${data.seats.disabled} disabled`}
        />
        <StatCard
          icon={Armchair}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
          label="Occupied Seats"
          value={String(data.seats.occupied)}
          hint={`${data.seats.occupancy_percentage}% occupancy`}
          hintColor="text-emerald-600"
        />
        <StatCard
          icon={Armchair}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          label="Vacant Seats"
          value={String(data.seats.vacant)}
        />
        <StatCard
          icon={PieChart}
          iconBg="bg-slate-100"
          iconColor="text-slate-600"
          label="Shift-Slot Occupancy"
          value={`${data.shift_slots.occupancy_percentage}%`}
          hint={`${data.shift_slots.occupied}/${data.shift_slots.total} slots booked`}
        />
        <StatCard
          icon={GraduationCap}
          iconBg="bg-orange-100"
          iconColor="text-orange-700"
          label="Active Students"
          value={String(data.total_active_students)}
        />
        <StatCard
          icon={IndianRupee}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
          label="Today's Collections"
          value={formatMoney(data.collections.today, sym)}
          hint={todayCollections ? `${todayCollections.payment_count} payments` : undefined}
        />
        <StatCard
          icon={WalletCards}
          iconBg="bg-slate-100"
          iconColor="text-slate-600"
          label="This Month's Collections"
          value={formatMoney(data.collections.this_month, sym)}
          hint={monthCollections ? `${monthCollections.payment_count} payments` : undefined}
        />
        <StatCard
          icon={ReceiptText}
          iconBg="bg-red-100"
          iconColor="text-red-600"
          label="Pending Fees"
          value={formatMoney(data.pending_fees.total_due, sym)}
          hint={`${data.pending_fees.students_count} students`}
          hintColor="text-red-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[28fr_38fr_34fr]">
        <SeatOccupancyCard
          occupied={data.seats.occupied}
          vacant={data.seats.vacant}
          disabled={data.seats.disabled}
          occupancyPercentage={data.seats.occupancy_percentage}
          shiftSlotsOccupied={data.shift_slots.occupied}
          shiftSlotsTotal={data.shift_slots.total}
        />
        <SeatUtilizationChart occupancyPercentage={data.seats.occupancy_percentage} />
        <RecentPayments payments={data.recent_payments} currencySymbol={sym} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ExpiringMemberships memberships={data.expiring_memberships} />
        <MembershipPlanSummary currencySymbol={sym} />
        <RecentCheckins />
      </div>
    </div>
  );
}
