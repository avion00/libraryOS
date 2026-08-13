import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { LibraryPromoArt } from "./art/LibraryPromoArt";

export function SidebarPromoCard() {
  return (
    <div className="mx-3 mb-3 overflow-hidden rounded-2xl border border-[rgba(242,170,76,0.18)] bg-brand-50">
      <LibraryPromoArt className="h-24 w-full" />
      <div className="px-4 pb-4 pt-3">
        <p className="text-sm font-semibold leading-snug text-slate-900">
          Smart Library. Smarter
          <br />
          Management.
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
          Manage seats, students and payments seamlessly.
        </p>
        <Link
          to="/reports"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
        >
          Explore Reports
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}
