import { Armchair, Clock, ShieldCheck, Users } from "lucide-react";

const RULES = [
  { icon: Users, text: "Up to 4 active shifts at a time" },
  { icon: Armchair, text: "Assign seats per shift" },
  { icon: Clock, text: "Edit timing anytime" },
  { icon: ShieldCheck, text: "Ensure continuous coverage" },
];

export function ShiftRules() {
  return (
    <div className="rounded-2xl border border-paper-700 bg-white p-4 shadow-card">
      <h3 className="text-[13.5px] font-semibold text-slate-900">Shift Rules</h3>
      <div className="mt-2.5 space-y-2.5">
        {RULES.map((rule) => (
          <div key={rule.text} className="flex items-center gap-2.5 text-[12.5px] text-slate-600">
            <rule.icon className="h-3.5 w-3.5 shrink-0 text-ink-300" strokeWidth={2} />
            {rule.text}
          </div>
        ))}
      </div>
    </div>
  );
}
