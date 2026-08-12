import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reportsApi, studentsApi } from "../api/endpoints";
import { api, extractErrorMessage } from "../api/client";
import { useDebounce } from "../lib/useDebounce";
import { daysUntil } from "../lib/format";
import { ConfirmDialog, ErrorState, PageLoading } from "../components/ui";
import { useToast } from "../context/ToastContext";
import StudentFormModal from "../components/StudentFormModal";
import { StudentsHeader } from "../components/students/StudentsHeader";
import { StudentStats } from "../components/students/StudentStats";
import { StudentFilters } from "../components/students/StudentFilters";
import { BulkActions } from "../components/students/BulkActions";
import { StudentsTable } from "../components/students/StudentsTable";
import { StudentsPagination } from "../components/students/StudentsPagination";
import { StudentsInsights } from "../components/students/StudentsInsights";
import type { ExpiryReport, PendingFeesReport, StudentsReportSummary } from "../components/students/types";
import type { Student } from "../api/types";

function isSameMonth(dateStr: string, ref: Date): boolean {
  const d = new Date(`${dateStr.length <= 10 ? dateStr : dateStr.slice(0, 10)}T00:00:00`);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function studentsToCsv(students: Student[]): string {
  const header = ["student_code", "full_name", "phone", "seat", "shifts", "expiry_date", "fee_status", "status"];
  const rows = students.map((s) => {
    const m = s.summary.current_membership;
    return [
      s.student_code,
      s.full_name,
      s.phone,
      m ? `Seat ${m.seat_number}` : "",
      m ? m.shifts.map((sh) => sh.name).join("; ") : "",
      m ? m.expiry_date : "",
      m ? m.payment_status : "",
      s.summary.status,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",");
  });
  return [header.join(","), ...rows].join("\n");
}

export default function StudentsListPage() {
  const { notify } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [primaryStatus, setPrimaryStatus] = useState("");
  const [secondaryStatus, setSecondaryStatus] = useState("");
  const [shift, setShift] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const [addOpen, setAddOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [exportingAll, setExportingAll] = useState(false);

  useEffect(() => {
    setPage(1);
    setSelectedIds(new Set());
  }, [debouncedSearch, primaryStatus, secondaryStatus, shift, pageSize]);

  const reportSummaryQuery = useQuery({
    queryKey: ["reports", "students-summary"],
    queryFn: () => reportsApi.students().then((r) => r.data as StudentsReportSummary),
  });

  const globalStudentsQuery = useQuery({
    queryKey: ["students", "global-list"],
    queryFn: () => studentsApi.list({ page_size: 1000 }).then((r) => r.data),
  });

  const searchStudentsQuery = useQuery({
    queryKey: ["students", "search-list", debouncedSearch],
    queryFn: () => studentsApi.list({ search: debouncedSearch || undefined, page_size: 1000 }).then((r) => r.data),
  });

  const expiryQuery = useQuery({
    queryKey: ["reports", "expiry-45"],
    queryFn: () => reportsApi.expiry(45).then((r) => r.data as ExpiryReport),
  });

  const pendingFeesQuery = useQuery({
    queryKey: ["reports", "pending-fees"],
    queryFn: () => reportsApi.pendingFees().then((r) => r.data as PendingFeesReport),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => studentsApi.remove(id),
    onSuccess: () => {
      notify("Student deleted.", "success");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      setDeleteTarget(null);
    },
    onError: (err) => notify(extractErrorMessage(err), "error"),
  });

  const today = useMemo(() => new Date(), []);

  const newStudentsThisMonth = useMemo(() => {
    const results = globalStudentsQuery.data?.results ?? [];
    return results.filter((s) => isSameMonth(s.joining_date, today)).length;
  }, [globalStudentsQuery.data, today]);

  const newActiveThisMonth = useMemo(() => {
    const results = globalStudentsQuery.data?.results ?? [];
    return results.filter((s) => {
      const m = s.summary.current_membership;
      return m?.status === "active" && isSameMonth(m.start_date, today);
    }).length;
  }, [globalStudentsQuery.data, today]);

  const expiringSoonCount = useMemo(() => {
    const rows = expiryQuery.data?.rows ?? [];
    return rows.filter((r) => !r.is_overdue && daysUntil(r.expiry_date) <= 30).length;
  }, [expiryQuery.data]);

  const expiringThisMonthRows = useMemo(() => {
    const rows = expiryQuery.data?.rows ?? [];
    return rows.filter((r) => !r.is_overdue && isSameMonth(r.expiry_date, today));
  }, [expiryQuery.data, today]);

  const filteredStudents = useMemo(() => {
    const results = searchStudentsQuery.data?.results ?? [];
    return results.filter((s) => {
      if (primaryStatus && s.summary.status !== primaryStatus) return false;
      const m = s.summary.current_membership;
      if (secondaryStatus === "expiring_soon") {
        if (!m || m.status !== "active" || daysUntil(m.expiry_date) < 0 || daysUntil(m.expiry_date) > 30) return false;
      }
      if (secondaryStatus === "pending_fees") {
        if (!m || m.status !== "active" || !(m.balance_due > 0)) return false;
      }
      if (shift) {
        if (!m || !m.shifts.some((sh) => sh.name === shift)) return false;
      }
      return true;
    });
  }, [searchStudentsQuery.data, primaryStatus, secondaryStatus, shift]);

  const pageItems = useMemo(
    () => filteredStudents.slice((page - 1) * pageSize, page * pageSize),
    [filteredStudents, page, pageSize]
  );

  const allSelected = pageItems.length > 0 && pageItems.every((s) => selectedIds.has(s.id));
  const someSelected = pageItems.some((s) => selectedIds.has(s.id));

  function toggleSelect(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) pageItems.forEach((s) => next.delete(s.id));
      else pageItems.forEach((s) => next.add(s.id));
      return next;
    });
  }

  function clearFilters() {
    setSearch("");
    setPrimaryStatus("");
    setSecondaryStatus("");
    setShift("");
  }

  async function handleExportAll() {
    setExportingAll(true);
    try {
      const resp = await api.get("/reports/export/students", { responseType: "blob" });
      downloadBlob(resp.data as Blob, "students.csv");
    } catch (err) {
      notify(extractErrorMessage(err), "error");
    } finally {
      setExportingAll(false);
    }
  }

  function handleExportSelected() {
    const selected = (searchStudentsQuery.data?.results ?? []).filter((s) => selectedIds.has(s.id));
    if (selected.length === 0) return;
    const csv = studentsToCsv(selected);
    downloadBlob(new Blob([csv], { type: "text/csv" }), "students-selected.csv");
  }

  const summaryReady = reportSummaryQuery.data && pendingFeesQuery.data;

  return (
    <div className="flex flex-col gap-4">
      <StudentsHeader onAddStudent={() => setAddOpen(true)} />

      {summaryReady ? (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            <StudentStats
              totalStudents={reportSummaryQuery.data!.total_students}
              newStudentsThisMonth={newStudentsThisMonth}
              activeMemberships={reportSummaryQuery.data!.active}
              newActiveThisMonth={newActiveThisMonth}
              expiringSoonCount={expiringSoonCount}
              pendingFeesTotal={pendingFeesQuery.data!.total_due}
              pendingFeesStudents={pendingFeesQuery.data!.count}
            />

            <div className="mt-4 overflow-hidden rounded-2xl border border-paper-700 bg-white shadow-card">
              <StudentFilters
                search={search}
                onSearchChange={setSearch}
                primaryStatus={primaryStatus}
                onPrimaryStatusChange={setPrimaryStatus}
                secondaryStatus={secondaryStatus}
                onSecondaryStatusChange={setSecondaryStatus}
                shift={shift}
                onShiftChange={setShift}
                onExport={handleExportAll}
                exporting={exportingAll}
              />
              <BulkActions
                allSelected={allSelected}
                someSelected={someSelected}
                onToggleAll={toggleAll}
                selectedCount={selectedIds.size}
                onExportSelected={handleExportSelected}
              />

              {searchStudentsQuery.isLoading ? (
                <PageLoading />
              ) : searchStudentsQuery.error ? (
                <ErrorState message="Could not load students." onRetry={() => searchStudentsQuery.refetch()} />
              ) : (
                <>
                  <StudentsTable
                    students={pageItems}
                    selectedIds={selectedIds}
                    allSelected={allSelected}
                    someSelected={someSelected}
                    onToggleSelect={toggleSelect}
                    onToggleAll={toggleAll}
                    onEdit={setEditingStudent}
                    onDeleteRequest={setDeleteTarget}
                    onClearFilters={clearFilters}
                  />
                  {filteredStudents.length > 0 && (
                    <StudentsPagination
                      page={page}
                      pageSize={pageSize}
                      totalItems={filteredStudents.length}
                      onPageChange={setPage}
                      onPageSizeChange={setPageSize}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          <StudentsInsights
            report={reportSummaryQuery.data!}
            expiringRows={expiringThisMonthRows}
            pendingTotal={pendingFeesQuery.data!.total_due}
            pendingCount={pendingFeesQuery.data!.count}
          />
        </div>
      ) : reportSummaryQuery.error || pendingFeesQuery.error ? (
        <ErrorState message="Could not load student data." onRetry={() => reportSummaryQuery.refetch()} />
      ) : (
        <PageLoading />
      )}

      <StudentFormModal
        open={addOpen || !!editingStudent}
        student={editingStudent}
        onClose={() => {
          setAddOpen(false);
          setEditingStudent(null);
        }}
        onSaved={() => {
          queryClient.invalidateQueries({ queryKey: ["students"] });
          queryClient.invalidateQueries({ queryKey: ["reports"] });
        }}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete student"
        message={`Remove ${deleteTarget?.full_name}? This can't be undone if they have no membership history.`}
        confirmLabel="Delete"
        danger
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
