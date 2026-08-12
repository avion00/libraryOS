import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { seatsApi, shiftsApi } from "../api/endpoints";
import { Select, Spinner } from "./ui";

export default function SeatShiftPicker({
  seatId,
  shiftIds,
  onSeatChange,
  onShiftIdsChange,
  excludeMembershipId,
}: {
  seatId: number | null;
  shiftIds: number[];
  onSeatChange: (seatId: number) => void;
  onShiftIdsChange: (ids: number[]) => void;
  excludeMembershipId?: number;
}) {
  const { data: seats } = useQuery({
    queryKey: ["seats", "available"],
    queryFn: () => seatsApi.list({ status: "available", page_size: 500 } as never).then((r) => r.data.results),
  });
  const { data: shifts } = useQuery({
    queryKey: ["shifts"],
    queryFn: () => shiftsApi.list().then((r) => r.data.results.filter((s) => s.is_active)),
  });
  const { data: occupancy, isFetching } = useQuery({
    queryKey: ["seat-occupancy", seatId],
    queryFn: () => seatsApi.occupancy(seatId!).then((r) => r.data),
    enabled: !!seatId,
  });

  function toggleShift(id: number, occupiedByOther: boolean) {
    if (occupiedByOther) return;
    if (shiftIds.includes(id)) {
      onShiftIdsChange(shiftIds.filter((s) => s !== id));
    } else {
      if (shiftIds.length >= 4) return;
      onShiftIdsChange([...shiftIds, id]);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Seat</label>
        <Select
          value={seatId ?? ""}
          onChange={(e) => {
            onSeatChange(Number(e.target.value));
            onShiftIdsChange([]);
          }}
        >
          <option value="">Select a seat…</option>
          {seats?.map((seat) => (
            <option key={seat.id} value={seat.id}>
              Seat {seat.number}
            </option>
          ))}
        </Select>
      </div>

      {seatId && (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Shifts (up to 4)</label>
          {isFetching ? (
            <Spinner className="h-5 w-5 text-slate-400" />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {shifts?.map((shift) => {
                const slot = occupancy?.slots.find((s) => s.shift_id === shift.id);
                const occupiedByOther =
                  slot?.status === "occupied" && slot.membership_id !== excludeMembershipId;
                const selected = shiftIds.includes(shift.id);
                return (
                  <button
                    key={shift.id}
                    type="button"
                    disabled={occupiedByOther}
                    onClick={() => toggleShift(shift.id, !!occupiedByOther)}
                    className={clsx(
                      "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                      occupiedByOther && "cursor-not-allowed border-paper-700 bg-paper-300 text-slate-400",
                      !occupiedByOther && selected && "border-brand-500 bg-brand-50 text-brand-700",
                      !occupiedByOther && !selected && "border-slate-300 text-slate-700 hover:bg-paper-300"
                    )}
                  >
                    <div className="font-medium">{shift.name}</div>
                    <div className="text-xs opacity-70">
                      {shift.start_time.slice(0, 5)}–{shift.end_time.slice(0, 5)}
                    </div>
                    {occupiedByOther && <div className="mt-0.5 text-xs">Booked by {slot?.student?.full_name}</div>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
