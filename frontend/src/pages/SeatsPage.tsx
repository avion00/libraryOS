import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { seatsApi, shiftsApi } from "../api/endpoints";
import { extractErrorMessage } from "../api/client";
import { useToast } from "../context/ToastContext";
import { Button, ConfirmDialog, ErrorState, PageLoading } from "../components/ui";
import type { Shift, SeatMapEntry } from "../api/types";

import { SeatsTabs } from "../components/seats/SeatsTabs";
import { SeatMapStats } from "../components/seats/SeatMapStats";
import { SeatFilters } from "../components/seats/SeatFilters";
import { SeatLegend } from "../components/seats/SeatLegend";
import { SeatGrid } from "../components/seats/SeatGrid";
import { OccupancyOverview } from "../components/seats/OccupancyOverview";
import { ShiftCoverage } from "../components/seats/ShiftCoverage";
import { ShiftsSummary } from "../components/seats/ShiftsSummary";
import { ShiftsTable } from "../components/seats/ShiftsTable";
import { ShiftTimeline } from "../components/seats/ShiftTimeline";
import { ShiftRules } from "../components/seats/ShiftRules";
import { ShiftUtilization } from "../components/seats/ShiftUtilization";
import { ShiftFormModal } from "../components/seats/ShiftFormModal";
import { SeatDetailsDialog } from "../components/seats/SeatDetailsDialog";
import { AssignStudentDialog } from "../components/seats/AssignStudentDialog";
import { computeSeatStatus } from "../components/seats/types";
import { computeCoveredHoursLabel } from "../components/seats/shiftUtils";

interface AssignRequest {
  entry: SeatMapEntry;
  initialShiftId?: number;
}

export default function SeatsPage() {
  const navigate = useNavigate();
  const { notify } = useToast();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<"map" | "shifts">("map");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<SeatMapEntry | null>(null);
  const [assignRequest, setAssignRequest] = useState<AssignRequest | null>(null);

  const [shiftFormOpen, setShiftFormOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [deleteShiftTarget, setDeleteShiftTarget] = useState<Shift | null>(null);

  const seatMapQuery = useQuery({
    queryKey: ["seat-map"],
    queryFn: () => seatsApi.map().then((r) => r.data),
    refetchInterval: 30_000,
  });

  const shiftsQuery = useQuery({
    queryKey: ["shifts"],
    queryFn: () => shiftsApi.list().then((r) => r.data.results),
  });

  const deleteShiftMutation = useMutation({
    mutationFn: (id: number) => shiftsApi.remove(id),
    onSuccess: () => {
      notify("Shift removed.", "success");
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      queryClient.invalidateQueries({ queryKey: ["seat-map"] });
      setDeleteShiftTarget(null);
    },
    onError: (err) => {
      notify(extractErrorMessage(err), "error");
      setDeleteShiftTarget(null);
    },
  });

  const entries = useMemo(() => seatMapQuery.data ?? [], [seatMapQuery.data]);
  const allShifts = useMemo(() => shiftsQuery.data ?? [], [shiftsQuery.data]);
  const activeShifts = useMemo(() => allShifts.filter((s) => s.is_active), [allShifts]);

  const counts = useMemo(() => {
    const tally = { available: 0, partial: 0, full: 0, disabled: 0 };
    for (const entry of entries) tally[computeSeatStatus(entry)]++;
    return tally;
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (search.trim() && !String(entry.seat.number).includes(search.trim())) return false;
      if (statusFilter && computeSeatStatus(entry) !== statusFilter) return false;
      return true;
    });
  }, [entries, search, statusFilter]);

  const activeSeatsCount = useMemo(() => entries.filter((e) => e.seat.status !== "disabled").length, [entries]);

  const utilizationEntries = useMemo(() => {
    return activeShifts.map((shift) => {
      const occupied = entries.filter((e) => e.slots.find((s) => s.shift_id === shift.id)?.status === "occupied").length;
      const percentage = activeSeatsCount > 0 ? (occupied / activeSeatsCount) * 100 : 0;
      return { shift, percentage };
    });
  }, [activeShifts, entries, activeSeatsCount]);

  const overallUtilization = useMemo(() => {
    if (utilizationEntries.length === 0) return 0;
    return utilizationEntries.reduce((sum, e) => sum + e.percentage, 0) / utilizationEntries.length;
  }, [utilizationEntries]);

  const coveredHoursLabel = useMemo(() => computeCoveredHoursLabel(activeShifts), [activeShifts]);

  function openSeat(entry: SeatMapEntry, el: HTMLButtonElement) {
    el.focus();
    setSelectedEntry(entry);
  }

  function requestAssign(shiftId?: number) {
    if (!selectedEntry) return;
    const entry = selectedEntry;
    setSelectedEntry(null);
    setAssignRequest({ entry, initialShiftId: shiftId });
  }

  function handleViewStudent(studentId: number) {
    setSelectedEntry(null);
    navigate(`/students/${studentId}`);
  }

  const loading = seatMapQuery.isLoading || shiftsQuery.isLoading;
  const failed = seatMapQuery.error || shiftsQuery.error;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-[26px] font-bold leading-tight text-slate-900">Seats & Shifts</h1>
        <p className="mt-0.5 text-[13.5px] text-slate-500">Visual seat map and shift configuration</p>
      </div>

      {loading ? (
        <PageLoading />
      ) : failed ? (
        <ErrorState message="Could not load seat data." onRetry={() => { seatMapQuery.refetch(); shiftsQuery.refetch(); }} />
      ) : (
        <>
          {tab === "map" ? (
            <SeatMapStats total={entries.length} available={counts.available} partial={counts.partial} full={counts.full} />
          ) : (
            <ShiftsSummary
              activeShifts={activeShifts.length}
              coveredHoursLabel={coveredHoursLabel}
              avgSeatsPerShift={activeSeatsCount}
              overallUtilization={overallUtilization}
            />
          )}

          <SeatsTabs
            tab={tab}
            onChange={setTab}
            rightSlot={
              tab === "map" ? (
                <SeatFilters search={search} onSearchChange={setSearch} status={statusFilter} onStatusChange={setStatusFilter} />
              ) : (
                <Button
                  onClick={() => {
                    setEditingShift(null);
                    setShiftFormOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" strokeWidth={2.4} />
                  Add shift
                </Button>
              )
            }
          />

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
            <div className="min-w-0 flex-1 space-y-4">
              {tab === "map" ? (
                <>
                  <SeatLegend />
                  <SeatGrid entries={filteredEntries} onOpenSeat={openSeat} onClearFilters={() => { setSearch(""); setStatusFilter(""); }} />
                </>
              ) : (
                <ShiftsTable
                  shifts={allShifts}
                  assignedSeats={activeSeatsCount}
                  onEdit={(shift) => {
                    setEditingShift(shift);
                    setShiftFormOpen(true);
                  }}
                  onDeleteRequest={setDeleteShiftTarget}
                />
              )}
            </div>

            <div className="flex w-full flex-col gap-4 lg:w-[300px] lg:shrink-0">
              {tab === "map" ? (
                <>
                  <OccupancyOverview available={counts.available} partial={counts.partial} full={counts.full} disabled={counts.disabled} />
                  <ShiftCoverage shifts={activeShifts} onViewAll={() => setTab("shifts")} />
                </>
              ) : (
                <>
                  <ShiftTimeline shifts={activeShifts} />
                  <ShiftRules />
                  <ShiftUtilization entries={utilizationEntries} overall={overallUtilization} />
                </>
              )}
            </div>
          </div>
        </>
      )}

      <SeatDetailsDialog
        entry={selectedEntry}
        shifts={activeShifts}
        onClose={() => setSelectedEntry(null)}
        onChanged={() => seatMapQuery.refetch()}
        onRequestAssign={requestAssign}
        onViewStudent={handleViewStudent}
      />

      {assignRequest && (
        <AssignStudentDialog
          open={!!assignRequest}
          onClose={() => setAssignRequest(null)}
          seatId={assignRequest.entry.seat.id}
          seatNumber={assignRequest.entry.seat.number}
          shifts={activeShifts}
          slots={assignRequest.entry.slots}
          initialShiftId={assignRequest.initialShiftId}
          onAssigned={() => seatMapQuery.refetch()}
        />
      )}

      <ShiftFormModal
        open={shiftFormOpen}
        onClose={() => setShiftFormOpen(false)}
        shift={editingShift}
        activeCount={activeShifts.length}
      />

      <ConfirmDialog
        open={!!deleteShiftTarget}
        title={`Delete ${deleteShiftTarget?.name} shift?`}
        message="Students assigned to this shift may be affected. This is only possible if the shift has never been booked."
        confirmLabel="Delete shift"
        danger
        loading={deleteShiftMutation.isPending}
        onCancel={() => setDeleteShiftTarget(null)}
        onConfirm={() => deleteShiftTarget && deleteShiftMutation.mutate(deleteShiftTarget.id)}
      />
    </div>
  );
}
