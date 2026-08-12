import datetime
from decimal import Decimal

from django.db.models import DecimalField, OuterRef, Subquery, Sum
from django.db.models.functions import Coalesce
from django.utils import timezone

from library_settings.models import LibrarySettings
from memberships.models import Membership
from payments.models import Payment
from payments.services import get_membership_payment_summary


def get_latest_membership(student):
    return (
        student.memberships.select_related("seat")
        .prefetch_related("membership_shifts__shift")
        .order_by("-start_date", "-id")
        .first()
    )


def get_student_summary(student, latest_membership=None, collected=None):
    """Returns the derived, always-consistent view of a student's current
    seat/shift/membership/payment state, based solely on Membership + Payment
    records (never a separately-stored, driftable status field).

    `collected` may be passed in (e.g. from a bulk-computed dict) to avoid an
    extra query per student when rendering a list.
    """
    membership = latest_membership if latest_membership is not None else get_latest_membership(student)
    if membership is None:
        return {
            "status": "no_membership",
            "current_membership": None,
        }

    payment_summary = get_membership_payment_summary(membership, collected=collected)
    # Shifts booked by this membership, shown regardless of the seat-lock
    # is_active flag so vacated/expired history still displays what was booked.
    shifts = [{"id": ms.shift.id, "name": ms.shift.name} for ms in membership.membership_shifts.all()]
    return {
        "status": membership.status,
        "current_membership": {
            "id": membership.id,
            "seat_id": membership.seat_id,
            "seat_number": membership.seat.number,
            "shifts": shifts,
            "start_date": membership.start_date,
            "expiry_date": membership.expiry_date,
            "monthly_fee": membership.monthly_fee,
            "status": membership.status,
            **payment_summary,
        },
    }


def annotate_students_with_latest_membership(queryset):
    """Annotates each Student row with its latest membership's key fields via
    correlated subqueries — O(1) extra queries regardless of page size, no
    N+1, safe at thousands of students."""
    latest = Membership.objects.filter(student=OuterRef("pk")).order_by("-start_date", "-id")
    collected_subquery = (
        Payment.objects.filter(
            membership_id=OuterRef("latest_membership_id"), status__in=[Payment.STATUS_PAID, Payment.STATUS_PARTIAL]
        )
        .values("membership_id")
        .annotate(s=Sum("amount"))
        .values("s")
    )
    qs = queryset.annotate(
        latest_membership_id=Subquery(latest.values("id")[:1]),
        latest_status=Subquery(latest.values("status")[:1]),
        latest_expiry_date=Subquery(latest.values("expiry_date")[:1]),
        latest_seat_number=Subquery(latest.values("seat__number")[:1]),
    ).annotate(
        latest_collected=Coalesce(
            Subquery(collected_subquery, output_field=DecimalField(max_digits=10, decimal_places=2)),
            Decimal("0"),
        ),
        latest_fee=Subquery(latest.values("monthly_fee")[:1]),
    )
    return qs


def filter_students_by_status(queryset, status_filter):
    today = timezone.localdate()
    if status_filter == "active":
        return queryset.filter(latest_status=Membership.STATUS_ACTIVE)
    if status_filter == "expired":
        return queryset.filter(latest_status=Membership.STATUS_EXPIRED)
    if status_filter == "vacated":
        return queryset.filter(latest_status=Membership.STATUS_VACATED)
    if status_filter == "expiring_soon":
        days = LibrarySettings.load().expiring_soon_days
        cutoff = today + datetime.timedelta(days=days)
        return queryset.filter(
            latest_status=Membership.STATUS_ACTIVE, latest_expiry_date__gte=today, latest_expiry_date__lte=cutoff
        )
    if status_filter == "pending_fees":
        from django.db.models import F

        return queryset.filter(latest_status=Membership.STATUS_ACTIVE, latest_collected__lt=F("latest_fee"))
    return queryset
