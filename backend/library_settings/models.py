from django.db import models


class LibrarySettings(models.Model):
    """Singleton configuration row. Enforced via pk=1 in save()."""

    DURATION_CALENDAR_MONTH = "calendar_month"
    DURATION_30_DAYS = "30_days"
    DURATION_CHOICES = [
        (DURATION_CALENDAR_MONTH, "Same date next month"),
        (DURATION_30_DAYS, "Fixed 30 days"),
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

    library_name = models.CharField(max_length=200, default="LibraryOS")
    logo = models.ImageField(upload_to="logos/", null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True, default="")
    email = models.EmailField(blank=True, default="")
    address = models.TextField(blank=True, default="")
    website = models.CharField(max_length=200, blank=True, default="")
    tax_id = models.CharField(max_length=50, blank=True, default="")

    total_seats = models.PositiveIntegerField(default=50)

    default_monthly_fee = models.DecimalField(max_digits=10, decimal_places=2, default=1000)
    membership_duration_policy = models.CharField(
        max_length=20, choices=DURATION_CHOICES, default=DURATION_CALENDAR_MONTH
    )
    expiring_soon_days = models.PositiveIntegerField(default=3)

    default_payment_method = models.CharField(max_length=20, choices=METHOD_CHOICES, default=METHOD_CASH)
    currency = models.CharField(max_length=8, default="INR")
    currency_symbol = models.CharField(max_length=4, default="₹")

    date_format = models.CharField(max_length=20, default="DD/MM/YYYY")
    timezone = models.CharField(max_length=64, default="UTC")

    apply_tax = models.BooleanField(default=False)
    tax_label = models.CharField(max_length=20, default="GST")
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    receipt_footer_text = models.CharField(max_length=200, blank=True, default="")

    notify_email = models.BooleanField(default=True)
    notify_whatsapp = models.BooleanField(default=False)
    notify_due_payment = models.BooleanField(default=True)
    notify_expiry = models.BooleanField(default=True)
    notify_daily_summary = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "library_settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return self.library_name
