from django.conf import settings
from django.db import models


class Membership(models.Model):
    STATUS_ACTIVE = "active"
    STATUS_EXPIRED = "expired"
    STATUS_VACATED = "vacated"
    STATUS_CHOICES = [
        (STATUS_ACTIVE, "Active"),
        (STATUS_EXPIRED, "Expired"),
        (STATUS_VACATED, "Vacated"),
    ]

    student = models.ForeignKey("students.Student", on_delete=models.PROTECT, related_name="memberships")
    seat = models.ForeignKey("seats.Seat", on_delete=models.PROTECT, related_name="memberships")
    start_date = models.DateField()
    expiry_date = models.DateField()
    monthly_fee = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_ACTIVE)
    previous_membership = models.OneToOneField(
        "self", null=True, blank=True, on_delete=models.SET_NULL, related_name="renewed_into"
    )
    vacated_at = models.DateTimeField(null=True, blank=True)
    vacate_reason = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "memberships"
        ordering = ["-start_date", "-id"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["expiry_date"]),
            models.Index(fields=["student", "status"]),
            models.Index(fields=["seat", "status"]),
        ]

    def __str__(self):
        return f"Membership#{self.pk} {self.student_id} seat={self.seat_id} [{self.status}]"


class MembershipShift(models.Model):
    """Through table linking a membership to its booked shift(s).

    `seat` and `is_active` are denormalized from the parent membership so a
    single-table unique constraint can prevent double-booking a seat+shift
    without relying on frontend validation alone.
    """

    membership = models.ForeignKey(Membership, on_delete=models.CASCADE, related_name="membership_shifts")
    shift = models.ForeignKey("shifts.Shift", on_delete=models.PROTECT, related_name="membership_shifts")
    seat = models.ForeignKey("seats.Seat", on_delete=models.PROTECT, related_name="membership_shifts")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "membership_shifts"
        constraints = [
            models.UniqueConstraint(
                fields=["seat", "shift"],
                condition=models.Q(is_active=True),
                name="unique_active_seat_shift",
            )
        ]
        indexes = [
            models.Index(fields=["seat", "shift", "is_active"]),
            models.Index(fields=["membership"]),
        ]

    def __str__(self):
        return f"seat={self.seat_id} shift={self.shift_id} active={self.is_active}"
