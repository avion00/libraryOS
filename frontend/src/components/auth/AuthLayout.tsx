import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { AuthFeature } from "./AuthFeature";
import { LibraryLoginArt } from "./art/LibraryLoginArt";
import { ThemeToggle } from "../ThemeToggle";

export interface AuthFeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function AuthLayout({ features, children }: { features: AuthFeatureItem[]; children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-paper-300">
      {/* Subtle decorative background shapes — nearly invisible, calm. */}
      <div className="pointer-events-none absolute -left-24 -top-32 h-[420px] w-[420px] rounded-full bg-[#F2AA4C]/[0.05]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[520px] w-[520px] rounded-full bg-[#101820]/[0.03] dark:bg-[#fff]/[0.03]" />

      <div className="absolute right-5 top-5 z-20 sm:right-8 sm:top-8">
        <ThemeToggle />
      </div>

      {/* Left feature column */}
      <div className="relative z-10 hidden shrink-0 flex-col justify-center px-10 lg:flex lg:w-[24%] xl:px-14">
        <div className="animate-fadeIn divide-y divide-paper-700" style={{ animationDelay: "120ms", animationFillMode: "backwards" }}>
          {features.map((f) => (
            <AuthFeature key={f.title} icon={f.icon} title={f.title} description={f.description} />
          ))}
        </div>
      </div>

      {/* Center login experience */}
      <div className="relative z-10 flex min-h-screen flex-1 items-center justify-center px-5 py-10 sm:px-8">
        {children}
      </div>

      {/* Right curved library image */}
      <div className="relative hidden shrink-0 lg:block lg:w-[26%] xl:w-[28%]">
        <div className="animate-fadeIn h-full w-full overflow-hidden" style={{ animationDuration: "450ms" }}>
          <LibraryLoginArt className="h-full w-full object-cover" />
        </div>
        {/* Large circular cutout creates the smooth inward curve on the image's left edge. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-1/2 -translate-x-[78%] -translate-y-1/2 rounded-full bg-paper-300"
          style={{ width: "62vh", height: "62vh" }}
        />
      </div>
    </div>
  );
}
