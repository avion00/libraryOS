import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { membershipsApi, settingsApi, studentsApi } from "../api/endpoints";
import { extractErrorMessage } from "../api/client";
import { useToast } from "../context/ToastContext";
import { ConfirmDialog, ErrorState } from "../components/ui";
import type { Membership, Payment, Student } from "../api/types";
import StudentFormModal from "../components/StudentFormModal";
import AssignMembershipModal from "../components/AssignMembershipModal";
import RenewMembershipModal from "../components/RenewMembershipModal";
import ChangeMembershipModal from "../components/ChangeMembershipModal";
import RecordPaymentModal from "../components/RecordPaymentModal";
import { ReceiptDialog } from "../components/payments/ReceiptDialog";
import { StudentDetailsActions } from "../components/student-details/StudentDetailsActions";
import { StudentProfileHero } from "../components/student-details/StudentProfileHero";
import { CurrentMembershipCard } from "../components/student-details/CurrentMembershipCard";
import { StudentDetailsCard } from "../components/student-details/StudentDetailsCard";
import { QuickInsightsCard } from "../components/student-details/QuickInsightsCard";
import { ActivityChartCard } from "../components/student-details/ActivityChartCard";
import { MembershipHistoryCard } from "../components/student-details/MembershipHistoryCard";
import { PaymentHistoryCard } from "../components/student-details/PaymentHistoryCard";
import { StudentActivityCard } from "../components/student-details/StudentActivityCard";
import { deriveActivityEvents, derivePaymentActivity } from "../components/student-details/activity";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-paper-500 ${className}`} />;
}

function StudentDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-5 w-32 animate-pulse rounded bg-paper-500" />
      <SkeletonBlock className="h-[164px]" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-9">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-9">
            <SkeletonBlock className="h-[260px] md:col-span-5" />
            <SkeletonBlock className="h-[260px] md:col-span-4" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-9">
            <SkeletonBlock className="h-[260px] md:col-span-5" />
            <SkeletonBlock className="h-[260px] md:col-span-4" />
          </div>
          <SkeletonBlock className="h-[220px]" />
        </div>
        <div className="flex flex-col gap-4 lg:col-span-3">
          <SkeletonBlock className="h-[320px]" />
          <SkeletonBlock className="h-[320px]" />
        </div>
      </div>
    </div>
  );
}

export default function StudentDetailPage() {
  const { id } = useParams();
  const studentId = Number(id);
  const { notify } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editOpen, setEditOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [renewOpen, setRenewOpen] = useState(false);
  const [changeOpen, setChangeOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [vacateConfirmOpen, setVacateConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);

  const studentQuery = useQuery({
    queryKey: ["student", studentId],
    queryFn: () => studentsApi.get(studentId).then((r) => r.data),
  });
  const membershipsQuery = useQuery({
    queryKey: ["student", studentId, "memberships"],
    queryFn: () => studentsApi.memberships(studentId).then((r) => r.data),
  });
  const paymentsQuery = useQuery({
    queryKey: ["student", studentId, "payments"],
    queryFn: () => studentsApi.payments(studentId).then((r) => r.data),
  });
  const settingsQuery = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsApi.get().then((r) => r.data),
  });

  const photoMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("photo", file);
      return studentsApi.update(studentId, formData as unknown as Partial<Student>);
    },
    onSuccess: () => {
      notify("Student photo updated.", "success");
      queryClient.invalidateQueries({ queryKey: ["student", studentId] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (err) => notify(extractErrorMessage(err), "error"),
  });

  const vacateMutation = useMutation({
    mutationFn: (membership: Membership) => membershipsApi.vacate(membership.id, "Vacated by admin"),
    onSuccess: () => {
      notify("Seat vacated.", "success");
      queryClient.invalidateQueries({ queryKey: ["student", studentId] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setVacateConfirmOpen(false);
    },
    onError: (err) => notify(extractErrorMessage(err), "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => studentsApi.remove(studentId),
    onSuccess: () => {
      notify("Student deleted.", "success");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      navigate("/students");
    },
    onError: (err) => {
      notify(extractErrorMessage(err), "error");
      setDeleteConfirmOpen(false);
    },
  });

  const loading = studentQuery.isLoading || membershipsQuery.isLoading || paymentsQuery.isLoading;

  const memberships = useMemo(() => membershipsQuery.data ?? [], [membershipsQuery.data]);
  const paymentsData = paymentsQuery.data;
  const payments: Payment[] = useMemo(
    () => (Array.isArray(paymentsData) ? paymentsData : paymentsData?.results ?? []),
    [paymentsData]
  );
  const activeMembershipObj = useMemo(() => memberships.find((m) => m.status === "active") ?? null, [memberships]);

  const currencySymbol = settingsQuery.data?.currency_symbol ?? "₹";

  const activityEvents = useMemo(() => {
    if (!studentQuery.data) return [];
    return deriveActivityEvents(studentQuery.data, memberships, payments, currencySymbol);
  }, [studentQuery.data, memberships, payments, currencySymbol]);

  const paymentActivity = useMemo(() => derivePaymentActivity(payments), [payments]);

  if (loading) return <StudentDetailSkeleton />;
  if (studentQuery.error || !studentQuery.data)
    return <ErrorState message="Unable to load this student." onRetry={() => studentQuery.refetch()} />;

  const student = studentQuery.data;
  const status = student.summary.status;
  const current = student.summary.current_membership;
  const hasActiveMembership = status === "active";

  return (
    <div className="flex flex-col gap-4">
      <StudentDetailsActions
        hasActiveMembership={hasActiveMembership}
        onEdit={() => setEditOpen(true)}
        onAssignSeat={() => setAssignOpen(true)}
        onRenew={() => setRenewOpen(true)}
        onChangeSeatShift={() => setChangeOpen(true)}
        onVacate={() => setVacateConfirmOpen(true)}
        onDelete={() => setDeleteConfirmOpen(true)}
      />

      <StudentProfileHero
        student={student}
        status={status}
        current={current}
        currencySymbol={currencySymbol}
        onPhotoSelected={(file) => photoMutation.mutate(file)}
        photoUploading={photoMutation.isPending}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start">
        <div className="flex flex-col gap-4 lg:col-span-9">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-9 md:items-start">
            <div className="md:col-span-5">
              <CurrentMembershipCard current={current} currencySymbol={currencySymbol} onAssignSeat={() => setAssignOpen(true)} />
            </div>
            <div className="md:col-span-4">
              <StudentDetailsCard student={student} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-9 md:items-start">
            <div className="md:col-span-5">
              <ActivityChartCard data={paymentActivity} currencySymbol={currencySymbol} />
            </div>
            <div className="md:col-span-4">
              <MembershipHistoryCard memberships={memberships} currencySymbol={currencySymbol} />
            </div>
          </div>

          <PaymentHistoryCard
            payments={payments}
            currencySymbol={currencySymbol}
            onRecordPayment={() => setPaymentOpen(true)}
            onOpenReceipt={setReceiptPayment}
          />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-3">
          <QuickInsightsCard
            current={current}
            currencySymbol={currencySymbol}
            onAssignSeat={() => setAssignOpen(true)}
            onRenew={() => setRenewOpen(true)}
          />
          <StudentActivityCard events={activityEvents} />
        </div>
      </div>

      <StudentFormModal open={editOpen} onClose={() => setEditOpen(false)} student={student} />
      <AssignMembershipModal open={assignOpen} onClose={() => setAssignOpen(false)} student={student} />
      {activeMembershipObj && (
        <>
          <RenewMembershipModal open={renewOpen} onClose={() => setRenewOpen(false)} membership={activeMembershipObj} />
          <ChangeMembershipModal open={changeOpen} onClose={() => setChangeOpen(false)} membership={activeMembershipObj} />
        </>
      )}
      <RecordPaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        student={student}
        membership={activeMembershipObj}
      />
      <ReceiptDialog open={receiptPayment != null} onClose={() => setReceiptPayment(null)} payment={receiptPayment} />

      <ConfirmDialog
        open={vacateConfirmOpen}
        title="Vacate this seat?"
        message="The student's seat and shift booking will be freed immediately. Membership and payment history will be preserved and remain viewable."
        confirmLabel="Vacate seat"
        danger
        loading={vacateMutation.isPending}
        onCancel={() => setVacateConfirmOpen(false)}
        onConfirm={() => activeMembershipObj && vacateMutation.mutate(activeMembershipObj)}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete student"
        message={`Remove ${student.full_name}? This can't be undone if they have no membership history.`}
        confirmLabel="Delete"
        danger
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
}
