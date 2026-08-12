from rest_framework import serializers

from payments.services import get_membership_payment_summary
from seats.models import Seat
from shifts.models import Shift
from shifts.serializers import ShiftSerializer

from .models import Membership, MembershipShift


class MembershipShiftSerializer(serializers.ModelSerializer):
    shift = ShiftSerializer(read_only=True)

    class Meta:
        model = MembershipShift
        fields = ["id", "shift", "is_active"]


class StudentMiniSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    student_code = serializers.CharField()
    full_name = serializers.CharField()
    phone = serializers.CharField()


class MembershipSerializer(serializers.ModelSerializer):
    shifts = serializers.SerializerMethodField()
    student = StudentMiniSerializer(read_only=True)
    seat_number = serializers.IntegerField(source="seat.number", read_only=True)
    payment_summary = serializers.SerializerMethodField()

    class Meta:
        model = Membership
        fields = [
            "id",
            "student",
            "seat",
            "seat_number",
            "shifts",
            "start_date",
            "expiry_date",
            "monthly_fee",
            "status",
            "previous_membership",
            "vacated_at",
            "vacate_reason",
            "payment_summary",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields

    def get_shifts(self, obj):
        active_only = self.context.get("active_shifts_only", obj.status == Membership.STATUS_ACTIVE)
        qs = obj.membership_shifts.select_related("shift")
        if active_only:
            qs = qs.filter(is_active=True)
        return MembershipShiftSerializer(qs, many=True).data

    def get_payment_summary(self, obj):
        return get_membership_payment_summary(obj)


class MembershipCreateSerializer(serializers.Serializer):
    student_id = serializers.IntegerField()
    seat_id = serializers.IntegerField()
    shift_ids = serializers.ListField(child=serializers.IntegerField(), min_length=1, max_length=4)
    start_date = serializers.DateField(required=False)
    monthly_fee = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)

    def validate_seat_id(self, value):
        if not Seat.objects.filter(pk=value).exists():
            raise serializers.ValidationError("Seat not found.")
        return value

    def validate_shift_ids(self, value):
        found = Shift.objects.filter(id__in=value).count()
        if found != len(set(value)):
            raise serializers.ValidationError("One or more shifts not found.")
        return value


class MembershipRenewSerializer(serializers.Serializer):
    start_date = serializers.DateField(required=False)
    expiry_date = serializers.DateField(required=False)
    monthly_fee = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    seat_id = serializers.IntegerField(required=False)
    shift_ids = serializers.ListField(child=serializers.IntegerField(), required=False, max_length=4)
    payment_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    payment_method = serializers.ChoiceField(choices=["cash", "bank_transfer", "online", "other"], required=False)
    payment_reference = serializers.CharField(required=False, allow_blank=True)
    payment_notes = serializers.CharField(required=False, allow_blank=True)


class MembershipChangeSerializer(serializers.Serializer):
    seat_id = serializers.IntegerField(required=False)
    shift_ids = serializers.ListField(child=serializers.IntegerField(), required=False, max_length=4)

    def validate(self, attrs):
        if "seat_id" not in attrs and "shift_ids" not in attrs:
            raise serializers.ValidationError("Provide seat_id and/or shift_ids to change.")
        return attrs


class MembershipVacateSerializer(serializers.Serializer):
    reason = serializers.CharField(required=False, allow_blank=True)
