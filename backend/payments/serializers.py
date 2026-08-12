from rest_framework import serializers

from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.full_name", read_only=True)
    student_code = serializers.CharField(source="student.student_code", read_only=True)
    created_by_username = serializers.CharField(source="created_by.username", read_only=True, default=None)

    class Meta:
        model = Payment
        fields = [
            "id",
            "receipt_number",
            "student",
            "student_name",
            "student_code",
            "membership",
            "amount",
            "payment_date",
            "method",
            "status",
            "reference_number",
            "notes",
            "created_by",
            "created_by_username",
            "created_at",
        ]
        read_only_fields = ["id", "receipt_number", "created_by", "created_at"]

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value

    def validate(self, attrs):
        membership = attrs.get("membership")
        student = attrs.get("student")
        if membership and student and membership.student_id != student.id:
            raise serializers.ValidationError("Membership does not belong to the selected student.")
        return attrs
