import random
import string

from django.conf import settings
from django.db import models
from django.utils import timezone


def generate_receipt_number():
    date_part = timezone.localdate().strftime("%Y%m%d")
    rand_part = "".join(random.choices(string.digits, k=5))
    return f"RCPT-{date_part}-{rand_part}"


class Payment(models.Model):
    STATUS_PAID = "paid"
    STATUS_PENDING = "pending"
    STATUS_PARTIAL = "partial"
    STATUS_CHOICES = [
        (STATUS_PAID, "Paid"),
        (STATUS_PENDING, "Pending"),
        (STATUS_PARTIAL, "Partial"),
    ]

    METHOD_CASH = "cash"
    METHOD_BANK_TRANSFER = "bank_transfer"
    METHOD_ONLINE = "online"
    METHOD_OTHER = "other"
    METHOD_CHOICES = [
        (METHOD_CASH, "Cash"),
        (METHOD_BANK_TRANSFER, "Bank Transfer"),
        (METHOD_ONLINE, "Online"),
        (METHOD_OTHER, "Other"),
    ]

    receipt_number = models.CharField(max_length=32, unique=True, editable=False)
    student = models.ForeignKey("students.Student", on_delete=models.PROTECT, related_name="payments")
    membership = models.ForeignKey(
        "memberships.Membership", on_delete=models.PROTECT, related_name="payments", null=True, blank=True
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField()
    method = models.CharField(max_length=20, choices=METHOD_CHOICES, default=METHOD_CASH)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PAID)
    reference_number = models.CharField(max_length=100, blank=True, default="")
    notes = models.TextField(blank=True, default="")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="payments_created"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "payments"
        ordering = ["-payment_date", "-id"]
        indexes = [
            models.Index(fields=["student"]),
            models.Index(fields=["membership"]),
            models.Index(fields=["status"]),
            models.Index(fields=["-payment_date"]),
        ]

    def save(self, *args, **kwargs):
        if not self.receipt_number:
            self.receipt_number = generate_receipt_number()
        return super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.receipt_number} - {self.amount}"
