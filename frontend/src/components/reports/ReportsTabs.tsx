import { useRef } from "react";
import type { ReportTab } from "./types";
import { REPORT_TABS } from "./types";

export function ReportsTabs({ tab, onChange }: { tab: ReportTab; onChange: (tab: ReportTab) => void }) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = e.key === "ArrowRight" ? (index + 1) % REPORT_TABS.length : (index - 1 + REPORT_TABS.length) % REPORT_TABS.length;
    const nextTab = REPORT_TABS[next];
    onChange(nextTab.key);
    refs.current[nextTab.key]?.focus();
  }

  return (
    <div role="tablist" aria-label="Report type" className="inline-flex w-fit gap-1 rounded-lg bg-paper-500 p-1">
      {REPORT_TABS.map((t, i) => (
        <button
          key={t.key}
          ref={(el) => {
            refs.current[t.key] = el;
          }}
          role="tab"
          id={`reports-tab-${t.key}`}
          aria-selected={tab === t.key}
          aria-controls={`reports-panel-${t.key}`}
          tabIndex={tab === t.key ? 0 : -1}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onClick={() => onChange(t.key)}
          className={`rounded-md px-4 py-1.5 text-[13.5px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
            tab === t.key ? "bg-white text-brand-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
