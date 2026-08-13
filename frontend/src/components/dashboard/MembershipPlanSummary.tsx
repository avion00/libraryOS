import { Crown, Gem, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { formatMoney } from "../../lib/format";

const PLANS = [
  { key: "basic", name: "Basic Plan", icon: Gem, students: 20, fee: 1000, bg: "bg-orange-50", iconBg: "bg-orange-100", iconColor: "text-orange-700" },
  {
    key: "standard",
    name: "Standard Plan",
    icon: Star,
    students: 45,
    fee: 1500,
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    key: "premium",
    name: "Premium Plan",
    icon: Crown,
    students: 10,
    fee: 2000,
    bg: "bg-paper-500",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
  },
];

export function MembershipPlanSummary({ currencySymbol }: { currencySymbol: string }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-paper-700 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-slate-900">Membership Plan Summary</h2>
        <Link to="/settings" className="text-[12.5px] font-semibold text-brand-600 hover:text-brand-700">
          View all
        </Link>
      </div>

      <div className="mt-3 grid flex-1 grid-cols-1 gap-2.5 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <div key={plan.key} className={`flex flex-col justify-between rounded-xl border border-paper-500 ${plan.bg} p-3.5`}>
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${plan.iconBg}`}>
              <plan.icon className={`h-4 w-4 ${plan.iconColor}`} strokeWidth={2.1} fill="currentColor" fillOpacity={0.15} />
            </span>
            <div className="mt-2.5">
              <p className="text-[12px] font-medium text-slate-500">{plan.name}</p>
              <p className="mt-1 text-xl font-bold leading-none text-slate-900">{plan.students}</p>
              <p className="text-[11.5px] text-slate-400">Students</p>
              <p className="mt-2 text-[12.5px] font-semibold text-slate-700">{formatMoney(plan.fee, currencySymbol)} / month</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
