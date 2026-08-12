from rest_framework import serializers

from .models import Seat


class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = ["id", "number", "status", "notes", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class SeatSlotSerializer(serializers.Serializer):
    shift_id = serializers.IntegerField()
    shift_name = serializers.CharField()
    status = serializers.CharField()
    student = serializers.DictField(required=False)
    membership_id = serializers.IntegerField(required=False)
    expiry_date = serializers.DateField(required=False)
    payment_status = serializers.CharField(required=False)


class SeatMapEntrySerializer(serializers.Serializer):
    seat = SeatSerializer()
    occupied_count = serializers.IntegerField()
    total_shifts = serializers.IntegerField()
    slots = SeatSlotSerializer(many=True)
