import datetime

from django.db.models import Avg, Count, Sum
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView

from memberships.models import Membership, MembershipShift
from memberships.services import sync_expired_memberships
from payments.models import Payment
from payments.services import get_active_memberships_with_balance
from seats.models import Seat
from shifts.models import Shift
from students.models import Student


def _resolve_date_range(request):
    range_key = request.query_params.get("range", "month")
    today = timezone.localdate()
    if range_key == "today":
        return today, today
    if range_key == "week":
        return today - datetime.timedelta(days=today.weekday()), today
    if range_key == "month":
        return today.replace(day=1), today
    if range_key == "custom":
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")
        if not date_from or not date_to:
            raise ValueError("date_from and date_to are required for a custom range.")
        return datetime.date.fromisoformat(date_from), datetime.date.fromisoformat(date_to)
    raise ValueError("range must be one of: today, week, month, custom")


class CollectionsReportView(APIView):
    def get(self, request):
        try:
            date_from, date_to = _resolve_date_range(request)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=400)

        qs = Payment.objects.filter(
            payment_date__gte=date_from, payment_date__lte=date_to, status__in=[Payment.STATUS_PAID, Payment.STATUS_PARTIAL]
        )
        totals = qs.aggregate(total=Sum("amount"), count=Count("id"), avg=Avg("amount"))
        by_method = list(qs.values("method").annotate(total=Sum("amount"), count=Count("id")).order_by("-total"))
        daily = list(
            qs.values("payment_date").annotate(total=Sum("amount"), count=Count("id")).order_by("payment_date")
        )

        return Response(
            {
                "date_from": date_from,
                "date_to": date_to,
                "total_collected": totals["total"] or 0,
                "payment_count": totals["count"] or 0,
                "average_payment": round(totals["avg"], 2) if totals["avg"] else 0,
                "by_method": by_method,
                "daily_breakdown": daily,
            }
        )


class OccupancyReportView(APIView):
    def get(self, request):
        sync_expired_memberships()
        total_seats = Seat.objects.count()
        disabled_seats = Seat.objects.filter(status=Seat.STATUS_DISABLED).count()
        available_seats = total_seats - disabled_seats
        active_shifts = Shift.objects.filter(is_active=True).count()

        total_seat_shifts = available_seats * active_shifts
        occupied_seat_shifts = MembershipShift.objects.filter(is_active=True).count()
        occupancy_percentage = round((occupied_seat_shifts / total_seat_shifts) * 100, 1) if total_seat_shifts else 0

        seat_wise = []
        for seat in Seat.objects.order_by("number"):
            occupied = MembershipShift.objects.filter(seat=seat, is_active=True).count()
            seat_wise.append(
                {
                    "seat_number": seat.number,
                    "status": seat.status,
                    "occupied_shifts": occupied,
                    "total_shifts": active_shifts,
                }
            )

        return Response(
            {
                "total_seats": total_seats,
                "disabled_seats": disabled_seats,
                "available_seat_shifts": total_seat_shifts - occupied_seat_shifts,
                "occupied_seat_shifts": occupied_seat_shifts,
                "total_seat_shifts": total_seat_shifts,
                "occupancy_percentage": occupancy_percentage,
                "seat_wise": seat_wise,
            }
        )


class StudentReportView(APIView):
    def get(self, request):
        sync_expired_memberships()
        total_students = Student.objects.filter(is_deleted=False).count()
        active = Membership.objects.filter(status=Membership.STATUS_ACTIVE).values("student_id").distinct().count()
        expired_only = (
            Student.objects.filter(is_deleted=False)
            .exclude(memberships__status=Membership.STATUS_ACTIVE)
            .filter(memberships__status=Membership.STATUS_EXPIRED)
            .distinct()
            .count()
        )
        vacated_only = (
            Student.objects.filter(is_deleted=False)
            .exclude(memberships__status__in=[Membership.STATUS_ACTIVE, Membership.STATUS_EXPIRED])
            .filter(memberships__status=Membership.STATUS_VACATED)
            .distinct()
            .count()
        )
        never_booked = Student.objects.filter(is_deleted=False, memberships__isnull=True).count()

        return Response(
            {
                "total_students": total_students,
                "active": active,
                "expired": expired_only,
                "vacated": vacated_only,
                "never_booked": never_booked,
            }
        )


class PendingFeesReportView(APIView):
    def get(self, request):
        sync_expired_memberships()
        qs = get_active_memberships_with_balance().filter(balance_due__gt=0).select_related("student", "seat")
        rows = [
            {
                "membership_id": m.id,
                "student_id": m.student_id,
                "student_name": m.student.full_name,
                "student_code": m.student.student_code,
                "seat_number": m.seat.number,
                "monthly_fee": m.monthly_fee,
                "amount_collected": m.amount_collected,
                "balance_due": m.balance_due,
                "expiry_date": m.expiry_date,
            }
            for m in qs.order_by("-balance_due")
        ]
        total_due = sum((r["balance_due"] for r in rows), start=0)
        return Response({"count": len(rows), "total_due": total_due, "rows": rows})


class ExpiryReportView(APIView):
    def get(self, request):
        sync_expired_memberships()
        days = int(request.query_params.get("days", 7))
        today = timezone.localdate()
        cutoff = today + datetime.timedelta(days=days)
        qs = (
            Membership.objects.filter(status=Membership.STATUS_ACTIVE, expiry_date__lte=cutoff)
            .select_related("student", "seat")
            .order_by("expiry_date")
        )
        rows = [
            {
                "membership_id": m.id,
                "student_id": m.student_id,
                "student_name": m.student.full_name,
                "student_code": m.student.student_code,
                "phone": m.student.phone,
                "seat_number": m.seat.number,
                "expiry_date": m.expiry_date,
                "is_overdue": m.expiry_date < today,
            }
            for m in qs
        ]
        return Response({"count": len(rows), "rows": rows})
