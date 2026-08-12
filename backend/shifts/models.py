from django.db import models


class Shift(models.Model):
    name = models.CharField(max_length=50, unique=True)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "shifts"
        ordering = ["display_order", "start_time"]

    def __str__(self):
        return f"{self.name} ({self.start_time}-{self.end_time})"
