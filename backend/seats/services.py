from django.utils import timezone

from memberships.models import MembershipShift
from payments.services import get_membership_payment_summary
from shifts.models import Shift


def get_seat_map(seat_ids=None):
    """Returns a list of {seat, occupied_count, total_shifts, shift_slots:[...]}
    for the given seats (or all seats), in a small constant number of queries —
    no N+1 regardless of seat count."""
    from .models import Seat

    seats_qs = Seat.objects.all()
    if seat_ids is not None:
        seats_qs = seats_qs.filter(id__in=seat_ids)
    seats = list(seats_qs.order_by("number"))

    active_shifts = list(Shift.objects.filter(is_active=True).order_by("display_order", "start_time"))

    bookings = (
        MembershipShift.objects.filter(is_active=True, seat_id__in=[s.id for s in seats])
        .select_related("shift", "membership", "membership__student")
    )
    bookings_by_seat = {}
    for b in bookings:
        bookings_by_seat.setdefault(b.seat_id, {})[b.shift_id] = b

    result = []
    for seat in seats:
        seat_bookings = bookings_by_seat.get(seat.id, {})
        slots = []
        for shift in active_shifts:
            booking = seat_bookings.get(shift.id)
            if booking:
                membership = booking.membership
                slots.append(
                    {
                        "shift_id": shift.id,
                        "shift_name": shift.name,
                        "status": "occupied",
                        "student": {
                            "id": membership.student_id,
                            "full_name": membership.student.full_name,
                            "student_code": membership.student.student_code,
                        },
                        "membership_id": membership.id,
                        "expiry_date": membership.expiry_date,
                        "payment_status": get_membership_payment_summary(membership)["payment_status"],
                    }
                )
            else:
                slots.append({"shift_id": shift.id, "shift_name": shift.name, "status": "available"})
        result.append(
            {
                "seat": seat,
                "occupied_count": len(seat_bookings),
                "total_shifts": len(active_shifts),
                "slots": slots,
            }
        )
    return result
