import { Headphones } from "lucide-react";

export function LoginSupport({ onContactSupport }: { onContactSupport: () => void }) {
  return (
    <div className="flex items-center justify-center gap-1.5 text-[13px] text-slate-500">
      <Headphones className="h-4 w-4 shrink-0" strokeWidth={2} />
      Need help?
      <button type="button" onClick={onContactSupport} className="font-semibold text-brand-600 hover:text-brand-700">
        Contact support
      </button>
    </div>
  );
}
