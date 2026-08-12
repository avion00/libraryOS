const COLUMNS = ["Seat", "Status", "Occupied Shifts", "Utilization"];

interface SeatRow {
  seat_number: number;
  status: string;
  occupied_shifts: number;
  total_shifts: number;
}

export function OccupancyTable({ rows }: { rows: SeatRow[] }) {
  if (rows.length === 0) {
    return <p className="py-14 text-center text-[13px] text-slate-400">No seat data available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-paper-300/80">
          <tr>
            {COLUMNS.map((c) => (
              <th key={c} className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-paper-500">
          {rows.map((s) => {
            const pct = s.total_shifts > 0 ? (s.occupied_shifts / s.total_shifts) * 100 : 0;
            return (
              <tr key={s.seat_number} className="transition-colors hover:bg-paper-300/70">
                <td className="px-4 py-3 text-[13.5px] font-semibold text-slate-800">Seat {s.seat_number}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex h-[23px] items-center rounded-full px-2.5 text-[11.5px] font-semibold ${
                      s.status === "available" ? "bg-emerald-50 text-emerald-600" : "bg-paper-500 text-slate-500"
                    }`}
                  >
                    {s.status === "available" ? "Available" : "Disabled"}
                  </span>
                </td>
                <td className="px-4 py-3 text-[13px] text-slate-600">
                  {s.occupied_shifts} / {s.total_shifts}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-paper-500">
                      <div className="h-full rounded-full bg-brand-400" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[11.5px] text-slate-400">{Math.round(pct)}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
