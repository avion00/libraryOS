from rest_framework import serializers

from .models import Student
from .services import get_latest_membership, get_student_summary


class StudentSerializer(serializers.ModelSerializer):
    summary = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = [
            "id",
            "student_code",
            "full_name",
            "phone",
            "email",
            "address",
            "joining_date",
            "photo",
            "id_proof",
            "notes",
            "summary",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "student_code", "joining_date", "created_at", "updated_at"]

    def get_summary(self, obj):
        collected = self.context.get("collected_by_membership_id", {})
        latest = getattr(obj, "_prefetched_latest_membership", None)
        if latest is None:
            memberships = list(obj.memberships.all())
            latest = memberships[0] if memberships else None
        return get_student_summary(obj, latest_membership=latest, collected=collected.get(latest.id) if latest else None)

    def validate_phone(self, value):
        qs = Student.objects.filter(phone=value, is_deleted=False)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("A student with this phone number already exists.")
        return value
