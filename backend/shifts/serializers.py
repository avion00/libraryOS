from django.conf import settings
from rest_framework import serializers

from .models import Shift


class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = ["id", "name", "start_time", "end_time", "is_active", "display_order", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate(self, attrs):
        start = attrs.get("start_time", getattr(self.instance, "start_time", None))
        end = attrs.get("end_time", getattr(self.instance, "end_time", None))
        if start and end and start == end:
            raise serializers.ValidationError("Start time and end time cannot be identical.")

        is_active = attrs.get("is_active", getattr(self.instance, "is_active", True))
        if is_active:
            qs = Shift.objects.filter(is_active=True)
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            max_shifts = settings.MAX_SHIFTS_PER_LIBRARY
            if qs.count() >= max_shifts:
                raise serializers.ValidationError(
                    f"A library can have at most {max_shifts} active shifts. Disable another shift first."
                )
        return attrs
