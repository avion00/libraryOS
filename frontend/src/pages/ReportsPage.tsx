import { useSearchParams } from "react-router-dom";
import { ReportsTabs } from "../components/reports/ReportsTabs";
import { CollectionsReport } from "../components/reports/CollectionsReport";
import { OccupancyReport } from "../components/reports/OccupancyReport";
import { StudentsReport } from "../components/reports/StudentsReport";
import { PendingFeesReport } from "../components/reports/PendingFeesReport";
import { ExpiryReport } from "../components/reports/ExpiryReport";
import type { ReportTab } from "../components/reports/types";

const VALID_TABS: ReportTab[] = ["collections", "occupancy", "students", "pending-fees", "expiry"];

export default function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get("tab");
  const tab: ReportTab = VALID_TABS.includes(rawTab as ReportTab) ? (rawTab as ReportTab) : "collections";

  function setTab(next: ReportTab) {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("tab", next);
      return params;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-[26px] font-bold leading-tight text-slate-900">Reports</h1>
        <p className="mt-0.5 text-[13.5px] text-slate-500">Operational reports backed by live database queries</p>
      </div>

      <ReportsTabs tab={tab} onChange={setTab} />

      <div role="tabpanel" id={`reports-panel-${tab}`} aria-labelledby={`reports-tab-${tab}`}>
        {tab === "collections" && <CollectionsReport />}
        {tab === "occupancy" && <OccupancyReport />}
        {tab === "students" && <StudentsReport />}
        {tab === "pending-fees" && <PendingFeesReport />}
        {tab === "expiry" && <ExpiryReport />}
      </div>
    </div>
  );
}
