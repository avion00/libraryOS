import datetime

from django.db.models import Sum
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView

from library_settings.models import LibrarySettings
from memberships.models import Membership
from memberships.services import sync_expired_memberships
from payments.models import Payment
from payments.serializers import PaymentSerializer
from payments.services import get_active_memberships_with_balance
from seats.models import Seat
from shifts.models import Shift
from students.models import Student
from students.serializers import StudentSerializer


class DashboardView(APIView):
    def get(self, request):
        sync_expired_memberships()
        today = timezone.localdate()
        month_start = today.replace(day=1)
        settings_obj = LibrarySettings.load()

        total_seats = Seat.objects.count()
        disabled_seats = Seat.objects.filter(status=Seat.STATUS_DISABLED).count()
        active_shift_count = Shift.objects.filter(is_active=True).count()

        occupied_seat_ids = set(
            Membership.objects.filter(status=Membership.STATUS_ACTIVE).values_list("seat_id", flat=True).distinct()
        )
        occupied_seats = len(occupied_seat_ids)
        vacant_seats = max(total_seats - disabled_seats - occupied_seats, 0)
        occupancy_percentage = round((occupied_seats / total_seats) * 100, 1) if total_seats else 0

        from memberships.models import MembershipShift

        total_slots = (total_seats - disabled_seats) * active_shift_count
        occupied_slot_count = MembershipShift.objects.filter(is_active=True).count()
        slot_occupancy_percentage = round((occupied_slot_count / total_slots) * 100, 1) if total_slots else 0

        total_active_students = (
            Membership.objects.filter(status=Membership.STATUS_ACTIVE).values("student_id").distinct().count()
        )

        today_collections = Payment.objects.filter(
            payment_date=today, status__in=[Payment.STATUS_PAID, Payment.STATUS_PARTIAL]
        ).aggregate(s=Sum("amount"))["s"] or 0
        month_collections = Payment.objects.filter(
            payment_date__gte=month_start, payment_date__lte=today, status__in=[Payment.STATUS_PAID, Payment.STATUS_PARTIAL]
        ).aggregate(s=Sum("amount"))["s"] or 0

        active_with_balance = get_active_memberships_with_balance()
        pending_fees_total = active_with_balance.aggregate(s=Sum("balance_due"))["s"] or 0
        pending_fees_count = active_with_balance.filter(balance_due__gt=0).count()

        expiring_cutoff = today + datetime.timedelta(days=settings_obj.expiring_soon_days)
        expiring_memberships = (
            Membership.objects.filter(
                status=Membership.STATUS_ACTIVE, expiry_date__gte=today, expiry_date__lte=expiring_cutoff
            )
            .select_related("student", "seat")
            .order_by("expiry_date")[:10]
        )

        recent_students = Student.objects.filter(is_deleted=False).order_by("-created_at")[:5]
        recent_payments = Payment.objects.select_related("student", "membership").order_by("-created_at")[:5]

        return Response(
            {
                "seats": {
                    "total": total_seats,
                    "disabled": disabled_seats,
                    "occupied": occupied_seats,
                    "vacant": vacant_seats,
                    "occupancy_percentage": occupancy_percentage,
                },
                "shift_slots": {
                    "total": total_slots,
                    "occupied": occupied_slot_count,
                    "occupancy_percentage": slot_occupancy_percentage,
                },
                "total_active_students": total_active_students,
                "collections": {
                    "today": today_collections,
                    "this_month": month_collections,
                },
                "pending_fees": {
                    "total_due": pending_fees_total,
                    "students_count": pending_fees_count,
                },
                "expiring_memberships": [
                    {
                        "membership_id": m.id,
                        "student_id": m.student_id,
                        "student_name": m.student.full_name,
                        "student_code": m.student.student_code,
                        "seat_number": m.seat.number,
                        "expiry_date": m.expiry_date,
                    }
                    for m in expiring_memberships
                ],
                "recently_registered_students": StudentSerializer(recent_students, many=True).data,
                "recent_payments": PaymentSerializer(recent_payments, many=True).data,
                "currency_symbol": settings_obj.currency_symbol,
            }
        )
