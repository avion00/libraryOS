import type { LucideIcon } from "lucide-react";

export function AuthFeature({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 py-5">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-brand-600">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
      <div className="min-w-0 pt-1">
        <p className="text-[14.5px] font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{description}</p>
      </div>
    </div>
  );
}
