from django.db.models import Prefetch
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from audit.utils import log_action
from memberships.models import Membership
from memberships.services import sync_expired_memberships
from payments.models import Payment
from payments.serializers import PaymentSerializer
from payments.services import get_collected_amounts_bulk

from .models import Student
from .serializers import StudentSerializer
from .services import annotate_students_with_latest_membership, filter_students_by_status


class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    search_fields = ["full_name", "phone", "student_code"]
    ordering_fields = ["created_at", "full_name", "joining_date"]

    def get_queryset(self):
        sync_expired_memberships()
        qs = Student.objects.filter(is_deleted=False).prefetch_related(
            Prefetch(
                "memberships",
                queryset=Membership.objects.select_related("seat").prefetch_related("membership_shifts__shift").order_by(
                    "-start_date", "-id"
                ),
            )
        )
        qs = annotate_students_with_latest_membership(qs)

        status_filter = self.request.query_params.get("status")
        if status_filter:
            qs = filter_students_by_status(qs, status_filter)

        seat_number = self.request.query_params.get("seat_number")
        if seat_number:
            qs = qs.filter(latest_seat_number=seat_number)

        search = self.request.query_params.get("search")
        if search:
            from django.db.models import Q

            qs = qs.filter(
                Q(full_name__icontains=search) | Q(phone__icontains=search) | Q(student_code__icontains=search)
            )

        return qs

    def get_serializer_context(self):
        context = super().get_serializer_context()
        page_membership_ids = [
            s.latest_membership_id for s in getattr(self, "_page_objects", []) if getattr(s, "latest_membership_id", None)
        ]
        context["collected_by_membership_id"] = get_collected_amounts_bulk(page_membership_ids) if page_membership_ids else {}
        return context

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        self._page_objects = page if page is not None else queryset
        serializer = self.get_serializer(self._page_objects, many=True)
        if page is not None:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)

    def perform_create(self, serializer):
        instance = serializer.save()
        log_action(self.request.user, "create_student", instance, request=self.request)

    def perform_update(self, serializer):
        instance = serializer.save()
        log_action(self.request.user, "update_student", instance, request=self.request)

    def perform_destroy(self, instance):
        active = instance.memberships.filter(status=Membership.STATUS_ACTIVE).exists()
        if active:
            raise ValidationError("This student has an active membership. Vacate it before removing the student.")
        # Soft-delete only: membership/payment history must remain queryable for reports.
        instance.is_deleted = True
        instance.save(update_fields=["is_deleted", "updated_at"])
        log_action(self.request.user, "delete_student", instance, request=self.request)

    @action(detail=True, methods=["get"])
    def memberships(self, request, pk=None):
        from memberships.serializers import MembershipSerializer

        student = self.get_object()
        qs = student.memberships.select_related("seat").prefetch_related("membership_shifts__shift")
        return Response(MembershipSerializer(qs, many=True, context={"active_shifts_only": False}).data)

    @action(detail=True, methods=["get"])
    def payments(self, request, pk=None):
        student = self.get_object()
        qs = Payment.objects.filter(student=student).select_related("membership")
        page = self.paginate_queryset(qs)
        serializer = PaymentSerializer(page if page is not None else qs, many=True)
        if page is not None:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)
