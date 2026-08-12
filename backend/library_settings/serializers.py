from rest_framework import serializers

from .models import LibrarySettings


class LibrarySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LibrarySettings
        fields = [
            "id",
            "library_name",
            "logo",
            "phone",
            "email",
            "address",
            "website",
            "tax_id",
            "total_seats",
            "default_monthly_fee",
            "membership_duration_policy",
            "expiring_soon_days",
            "default_payment_method",
            "currency",
            "currency_symbol",
            "date_format",
            "timezone",
            "apply_tax",
            "tax_label",
            "tax_rate",
            "receipt_footer_text",
            "notify_email",
            "notify_whatsapp",
            "notify_due_payment",
            "notify_expiry",
            "notify_daily_summary",
            "updated_at",
        ]
        read_only_fields = ["id", "updated_at"]

    def validate_total_seats(self, value):
        if value < 1:
            raise serializers.ValidationError("Total seats must be at least 1.")
        from seats.models import Seat

        highest = Seat.objects.order_by("-number").values_list("number", flat=True).first()
        if highest and value < highest:
            raise serializers.ValidationError(
                f"Cannot reduce total seats below the highest existing seat number ({highest}). Disable or remove seats first."
            )
        return value
