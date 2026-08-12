from django.db import models


class Seat(models.Model):
    STATUS_AVAILABLE = "available"
    STATUS_DISABLED = "disabled"
    STATUS_CHOICES = [
        (STATUS_AVAILABLE, "Available"),
        (STATUS_DISABLED, "Disabled"),
    ]

    number = models.PositiveIntegerField(unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_AVAILABLE)
    notes = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "seats"
        ordering = ["number"]
        indexes = [models.Index(fields=["number"]), models.Index(fields=["status"])]

    def __str__(self):
        return f"Seat {self.number}"
