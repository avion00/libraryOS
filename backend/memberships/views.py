from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from audit.utils import log_action
from payments.models import Payment
from seats.models import Seat
from students.models import Student

from . import services
from .models import Membership
from .serializers import (
    MembershipChangeSerializer,
    MembershipCreateSerializer,
    MembershipRenewSerializer,
    MembershipSerializer,
    MembershipVacateSerializer,
)


def _service_error_response(exc):
    return Response({"detail": str(exc), "errors": None}, status=status.HTTP_409_CONFLICT)


class MembershipViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MembershipSerializer
    filterset_fields = ["status", "student", "seat"]
    search_fields = []

    def get_queryset(self):
        services.sync_expired_memberships()
        return (
            Membership.objects.select_related("student", "seat")
            .prefetch_related("membership_shifts__shift")
            .all()
        )

    def create(self, request, *args, **kwargs):
        serializer = MembershipCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        student = get_object_or_404(Student, pk=data["student_id"])
        seat = get_object_or_404(Seat, pk=data["seat_id"])

        try:
            membership = services.create_membership(
                student=student,
                seat=seat,
                shift_ids=data["shift_ids"],
                start_date=data.get("start_date"),
                monthly_fee=data.get("monthly_fee"),
            )
        except (services.BookingConflictError,) as exc:
            return _service_error_response(exc)
        except services.MembershipError as exc:
            raise ValidationError(str(exc))

        log_action(request.user, "create_membership", membership, request=request)
        return Response(MembershipSerializer(membership).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def renew(self, request, pk=None):
        membership = self.get_object()
        serializer = MembershipRenewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        seat = None
        if "seat_id" in data:
            seat = get_object_or_404(Seat, pk=data["seat_id"])

        try:
            new_membership = services.renew_membership(
                membership=membership,
                start_date=data.get("start_date"),
                expiry_date=data.get("expiry_date"),
                monthly_fee=data.get("monthly_fee"),
                seat=seat,
                shift_ids=data.get("shift_ids"),
            )
        except services.BookingConflictError as exc:
            return _service_error_response(exc)
        except services.MembershipError as exc:
            raise ValidationError(str(exc))

        payment_amount = data.get("payment_amount")
        if payment_amount:
            Payment.objects.create(
                student=new_membership.student,
                membership=new_membership,
                amount=payment_amount,
                payment_date=new_membership.start_date,
                method=data.get("payment_method", "cash"),
                status=Payment.STATUS_PAID
                if payment_amount >= new_membership.monthly_fee
                else Payment.STATUS_PARTIAL,
                reference_number=data.get("payment_reference", ""),
                notes=data.get("payment_notes", ""),
                created_by=request.user,
            )

        log_action(request.user, "renew_membership", new_membership, request=request)
        return Response(MembershipSerializer(new_membership).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def change(self, request, pk=None):
        membership = self.get_object()
        serializer = MembershipChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        seat = None
        if "seat_id" in data:
            seat = get_object_or_404(Seat, pk=data["seat_id"])

        try:
            membership = services.change_seat_or_shifts(
                membership=membership, seat=seat, shift_ids=data.get("shift_ids")
            )
        except services.BookingConflictError as exc:
            return _service_error_response(exc)
        except services.MembershipError as exc:
            raise ValidationError(str(exc))

        log_action(request.user, "change_membership", membership, request=request)
        return Response(MembershipSerializer(membership).data)

    @action(detail=True, methods=["post"])
    def vacate(self, request, pk=None):
        membership = self.get_object()
        serializer = MembershipVacateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            membership = services.vacate_membership(
                membership=membership, reason=serializer.validated_data.get("reason", "")
            )
        except services.MembershipError as exc:
            raise ValidationError(str(exc))

        log_action(request.user, "vacate_membership", membership, request=request)
        return Response(MembershipSerializer(membership).data)
