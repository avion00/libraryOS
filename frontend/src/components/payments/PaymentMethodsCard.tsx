import type { PaymentMethod } from "../../api/types";
import { formatMoney } from "../../lib/format";
import { METHOD_LABEL } from "./types";
import { METHOD_VISUAL } from "./methodVisuals";

export function PaymentMethodsCard({ breakdown }: { breakdown: { method: PaymentMethod; total: number }[] }) {
  const grandTotal = Math.max(breakdown.reduce((sum, b) => sum + b.total, 0), 1);

  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-4 shadow-card">
      <h3 className="text-[13.5px] font-semibold text-slate-900">Payment Methods</h3>

      {breakdown.length === 0 ? (
        <p className="py-4 text-center text-[12.5px] text-slate-400">No payments recorded yet.</p>
      ) : (
        <div className="mt-2.5 space-y-3">
          {breakdown.map(({ method, total }) => {
            const visual = METHOD_VISUAL[method];
            const pct = Math.round((total / grandTotal) * 1000) / 10;
            return (
              <div key={method}>
                <div className="mb-1 flex items-center justify-between text-[12.5px]">
                  <span className="flex items-center gap-1.5 font-medium text-slate-600">
                    <visual.icon className={`h-3.5 w-3.5 ${visual.color}`} strokeWidth={2} />
                    {METHOD_LABEL[method]}
                  </span>
                  <span className="text-slate-700">
                    <span className="font-semibold">{formatMoney(total)}</span> <span className="text-slate-400">{pct}%</span>
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper-500">
                  <div className={`h-full rounded-full ${visual.bar} transition-[width] duration-700`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
