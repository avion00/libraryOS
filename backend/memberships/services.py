"""Domain service layer for seat/shift booking.

All membership mutations (create, renew, change seat/shifts, vacate) go
through here so the double-booking guarantee lives in exactly one place,
inside a single DB transaction with row locks — never relied upon from the
frontend alone.
"""
import datetime

from dateutil.relativedelta import relativedelta
from django.db import transaction
from django.utils import timezone

from library_settings.models import LibrarySettings
from seats.models import Seat
from shifts.models import Shift

from .models import Membership, MembershipShift


class BookingConflictError(Exception):
    """Raised when the requested seat+shift is already actively booked."""


class MembershipError(Exception):
    """Raised for any other invalid membership operation."""


def calculate_expiry_date(start_date, policy=None):
    if policy is None:
        policy = LibrarySettings.load().membership_duration_policy
    if policy == LibrarySettings.DURATION_30_DAYS:
        return start_date + datetime.timedelta(days=30)
    # calendar_month: same date next month, minus a day so a month is inclusive
    # e.g. 2026-08-01 -> 2026-08-31 (not 2026-09-01)
    return start_date + relativedelta(months=1) - datetime.timedelta(days=1)


def _lock_and_check_conflicts(seat, shift_ids, exclude_membership_id=None):
    """Must be called inside an outer transaction.atomic() block.

    Locks any existing active MembershipShift rows for this seat+shifts and
    raises BookingConflictError if one is found (excluding the given
    membership, used when renewing/re-saving the same booking).
    """
    conflicts = (
        MembershipShift.objects.select_for_update()
        .filter(seat=seat, shift_id__in=shift_ids, is_active=True)
        .exclude(membership_id=exclude_membership_id)
        .select_related("shift", "membership__student")
    )
    conflict = conflicts.first()
    if conflict:
        raise BookingConflictError(
            f"Seat {seat.number} / {conflict.shift.name} is already booked by "
            f"{conflict.membership.student.full_name} until {conflict.membership.expiry_date}."
        )


def _validate_shifts(shift_ids):
    if not shift_ids:
        raise MembershipError("At least one shift must be selected.")
    if len(set(shift_ids)) != len(shift_ids):
        raise MembershipError("Duplicate shifts selected.")
    active_shifts = list(Shift.objects.filter(id__in=shift_ids, is_active=True))
    if len(active_shifts) != len(shift_ids):
        raise MembershipError("One or more selected shifts are invalid or inactive.")
    if len(shift_ids) > 4:
        raise MembershipError("A seat can support at most 4 shifts.")
    return active_shifts


@transaction.atomic
def create_membership(*, student, seat, shift_ids, start_date=None, monthly_fee=None, expiry_date=None):
    if seat.status != Seat.STATUS_AVAILABLE:
        raise MembershipError(f"Seat {seat.number} is disabled and cannot be assigned.")

    _validate_shifts(shift_ids)

    existing_active = Membership.objects.filter(student=student, status=Membership.STATUS_ACTIVE).exists()
    if existing_active:
        raise MembershipError(
            "This student already has an active membership. Vacate or renew it before creating a new one."
        )

    seat = Seat.objects.select_for_update().get(pk=seat.pk)
    _lock_and_check_conflicts(seat, shift_ids)

    settings_obj = LibrarySettings.load()
    start_date = start_date or timezone.localdate()
    fee = monthly_fee if monthly_fee is not None else settings_obj.default_monthly_fee
    expiry_date = expiry_date or calculate_expiry_date(start_date)

    if expiry_date <= start_date:
        raise MembershipError("Expiry date must be after the start date.")

    membership = Membership.objects.create(
        student=student,
        seat=seat,
        start_date=start_date,
        expiry_date=expiry_date,
        monthly_fee=fee,
        status=Membership.STATUS_ACTIVE,
    )
    MembershipShift.objects.bulk_create(
        [
            MembershipShift(membership=membership, shift_id=sid, seat=seat, is_active=True)
            for sid in shift_ids
        ]
    )
    return membership


@transaction.atomic
def renew_membership(*, membership, start_date=None, monthly_fee=None, expiry_date=None, seat=None, shift_ids=None):
    membership = Membership.objects.select_for_update().get(pk=membership.pk)
    if membership.status == Membership.STATUS_VACATED:
        raise MembershipError("Cannot renew a vacated membership. Create a new membership instead.")

    new_seat = seat or membership.seat
    if new_seat.status != Seat.STATUS_AVAILABLE:
        raise MembershipError(f"Seat {new_seat.number} is disabled and cannot be assigned.")

    current_shift_ids = list(
        membership.membership_shifts.filter(is_active=True).values_list("shift_id", flat=True)
    )
    new_shift_ids = shift_ids if shift_ids is not None else current_shift_ids
    _validate_shifts(new_shift_ids)

    new_seat = Seat.objects.select_for_update().get(pk=new_seat.pk)
    _lock_and_check_conflicts(new_seat, new_shift_ids, exclude_membership_id=membership.pk)

    new_start = start_date or (membership.expiry_date + datetime.timedelta(days=1))
    fee = monthly_fee if monthly_fee is not None else membership.monthly_fee
    new_expiry = expiry_date or calculate_expiry_date(new_start)
    if new_expiry <= new_start:
        raise MembershipError("Expiry date must be after the start date.")

    # Free the outgoing booking before claiming the new one, inside the same
    # transaction, so the unique(seat, shift) WHERE is_active constraint never
    # sees both rows active at once even when seat/shift is unchanged.
    membership.membership_shifts.filter(is_active=True).update(is_active=False)
    membership.status = Membership.STATUS_EXPIRED
    membership.save(update_fields=["status", "updated_at"])

    new_membership = Membership.objects.create(
        student=membership.student,
        seat=new_seat,
        start_date=new_start,
        expiry_date=new_expiry,
        monthly_fee=fee,
        status=Membership.STATUS_ACTIVE,
        previous_membership=membership,
    )
    MembershipShift.objects.bulk_create(
        [
            MembershipShift(membership=new_membership, shift_id=sid, seat=new_seat, is_active=True)
            for sid in new_shift_ids
        ]
    )
    return new_membership


@transaction.atomic
def change_seat_or_shifts(*, membership, seat=None, shift_ids=None):
    membership = Membership.objects.select_for_update().get(pk=membership.pk)
    if membership.status != Membership.STATUS_ACTIVE:
        raise MembershipError("Only an active membership can be moved to a different seat/shift.")

    new_seat = seat or membership.seat
    if new_seat.status != Seat.STATUS_AVAILABLE:
        raise MembershipError(f"Seat {new_seat.number} is disabled and cannot be assigned.")

    current_shift_ids = list(
        membership.membership_shifts.filter(is_active=True).values_list("shift_id", flat=True)
    )
    new_shift_ids = shift_ids if shift_ids is not None else current_shift_ids
    _validate_shifts(new_shift_ids)

    new_seat = Seat.objects.select_for_update().get(pk=new_seat.pk)
    _lock_and_check_conflicts(new_seat, new_shift_ids, exclude_membership_id=membership.pk)

    membership.membership_shifts.filter(is_active=True).update(is_active=False)
    membership.seat = new_seat
    membership.save(update_fields=["seat", "updated_at"])
    MembershipShift.objects.bulk_create(
        [
            MembershipShift(membership=membership, shift_id=sid, seat=new_seat, is_active=True)
            for sid in new_shift_ids
        ]
    )
    return membership


@transaction.atomic
def vacate_membership(*, membership, reason=""):
    membership = Membership.objects.select_for_update().get(pk=membership.pk)
    if membership.status == Membership.STATUS_VACATED:
        raise MembershipError("This membership has already been vacated.")

    membership.membership_shifts.filter(is_active=True).update(is_active=False)
    membership.status = Membership.STATUS_VACATED
    membership.vacated_at = timezone.now()
    membership.vacate_reason = reason
    membership.save(update_fields=["status", "vacated_at", "vacate_reason", "updated_at"])
    return membership


def sync_expired_memberships():
    """Flip any 'active' membership whose expiry has passed to 'expired' and
    free its seat/shift. Cheap and idempotent — safe to call from hot read
    paths (dashboard, lists) so status is always consistent without a cron."""
    today = timezone.localdate()
    with transaction.atomic():
        expired_ids = list(
            Membership.objects.select_for_update()
            .filter(status=Membership.STATUS_ACTIVE, expiry_date__lt=today)
            .values_list("id", flat=True)
        )
        if not expired_ids:
            return 0
        MembershipShift.objects.filter(membership_id__in=expired_ids, is_active=True).update(is_active=False)
        Membership.objects.filter(id__in=expired_ids).update(status=Membership.STATUS_EXPIRED)
    return len(expired_ids)
