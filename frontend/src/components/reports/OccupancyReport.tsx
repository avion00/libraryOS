import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Armchair, PieChart, Users } from "lucide-react";
import { api } from "../../api/client";
import { ErrorState, PageLoading } from "../ui";
import { StudentStatCard } from "../students/StudentStatCard";
import { ReportDonutCard, type DonutSegment } from "./charts/ReportDonutCard";
import { OccupancyTable } from "./tables/OccupancyTable";
import { OccupancyInsights } from "./OccupancyInsights";
import { ReportsPagination } from "./ReportsPagination";

interface OccupancyReportData {
  total_seats: number;
  disabled_seats: number;
  available_seat_shifts: number;
  occupied_seat_shifts: number;
  total_seat_shifts: number;
  occupancy_percentage: number;
  seat_wise: { seat_number: number; status: string; occupied_shifts: number; total_shifts: number }[];
}

export function OccupancyReport() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["reports", "occupancy"],
    queryFn: () => api.get<OccupancyReportData>("/reports/occupancy").then((r) => r.data),
  });

  const pageRows = useMemo(() => {
    if (!data) return [];
    return data.seat_wise.slice((page - 1) * pageSize, page * pageSize);
  }, [data, page]);

  if (isLoading) return <PageLoading />;
  if (error || !data) return <ErrorState message="Unable to load the occupancy report." onRetry={() => refetch()} />;

  const segments: DonutSegment[] = [
    { key: "occupied", label: "Occupied", value: data.occupied_seat_shifts, color: "#F2AA4C", displayValue: String(data.occupied_seat_shifts) },
    { key: "available", label: "Available", value: data.available_seat_shifts, color: "#10b981", displayValue: String(data.available_seat_shifts) },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StudentStatCard icon={Armchair} iconBg="bg-paper-700" iconColor="text-ink-700" title="Total Seats" value={String(data.total_seats)} footer="All configured seats" />
        <StudentStatCard icon={Users} iconBg="bg-emerald-100" iconColor="text-emerald-600" title="Occupied Seat-Shifts" value={String(data.occupied_seat_shifts)} footer="Currently assigned" />
        <StudentStatCard icon={Armchair} iconBg="bg-paper-700" iconColor="text-ink-700" title="Available Seat-Shifts" value={String(data.available_seat_shifts)} footer="Ready to book" />
        <StudentStatCard icon={PieChart} iconBg="bg-orange-100" iconColor="text-orange-600" title="Occupancy" value={`${data.occupancy_percentage}%`} footer="Of total capacity" />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-paper-700 bg-white shadow-card">
          <OccupancyTable rows={pageRows} />
          {data.seat_wise.length > 0 && (
            <ReportsPagination page={page} pageSize={pageSize} totalItems={data.seat_wise.length} itemLabel="seats" onPageChange={setPage} />
          )}
        </div>

        <div className="flex w-full flex-col gap-4 lg:w-[300px] lg:shrink-0">
          <ReportDonutCard title="Seat-Shift Distribution" centerValue={String(data.total_seat_shifts)} centerLabel="Total Seat-Shifts" segments={segments} />
          <OccupancyInsights rows={data.seat_wise} occupancyPct={data.occupancy_percentage} totalSeatShifts={data.total_seat_shifts} />
        </div>
      </div>
    </div>
  );
}
