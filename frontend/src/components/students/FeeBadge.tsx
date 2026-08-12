import { formatMoney } from "../../lib/format";

export function FeeBadge({ status, balanceDue }: { status: "paid" | "pending" | "partial" | null; balanceDue?: number }) {
  if (!status) return <span className="text-slate-300">—</span>;

  if (status === "paid") {
    return (
      <span className="inline-flex h-[23px] items-center rounded-full bg-emerald-50 px-2.5 text-[11.5px] font-semibold text-emerald-600">
        Paid
      </span>
    );
  }

  if (status === "partial") {
    return (
      <div>
        <span className="inline-flex h-[23px] items-center rounded-full bg-amber-50 px-2.5 text-[11.5px] font-semibold text-amber-600">
          Partial
        </span>
        {!!balanceDue && <p className="mt-0.5 text-[11px] font-medium text-red-500">Due {formatMoney(balanceDue)}</p>}
      </div>
    );
  }

  return (
    <div>
      <span className="inline-flex h-[23px] items-center rounded-full bg-rose-50 px-2.5 text-[11.5px] font-semibold text-rose-600">
        Due
      </span>
      {!!balanceDue && <p className="mt-0.5 text-[11px] font-medium text-red-500">Due {formatMoney(balanceDue)}</p>}
    </div>
  );
}
