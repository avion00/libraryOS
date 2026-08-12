from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from audit.utils import log_action
from library_settings.models import LibrarySettings

from .models import Payment
from .serializers import PaymentSerializer


class PaymentViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    """Payments form an immutable ledger: create + read only. No update or
    delete endpoints — corrections are made by recording a new payment, never
    by mutating or removing history."""

    serializer_class = PaymentSerializer
    filterset_fields = ["status", "method", "student", "membership"]
    search_fields = ["receipt_number", "reference_number", "student__full_name", "student__phone"]

    def get_queryset(self):
        qs = Payment.objects.select_related("student", "membership", "created_by").all()
        date_from = self.request.query_params.get("date_from")
        date_to = self.request.query_params.get("date_to")
        if date_from:
            qs = qs.filter(payment_date__gte=date_from)
        if date_to:
            qs = qs.filter(payment_date__lte=date_to)
        return qs

    def perform_create(self, serializer):
        instance = serializer.save(created_by=self.request.user)
        log_action(self.request.user, "record_payment", instance, request=self.request)

    @action(detail=True, methods=["get"])
    def receipt(self, request, pk=None):
        payment = self.get_object()
        settings_obj = LibrarySettings.load()
        membership = payment.membership
        shifts = []
        seat_number = None
        billing_period = None
        if membership:
            seat_number = membership.seat.number
            membership_shifts = list(membership.membership_shifts.select_related("shift").filter(is_active=True))
            if not membership_shifts:
                membership_shifts = list(membership.membership_shifts.select_related("shift").all())
            shifts = [ms.shift.name for ms in membership_shifts]
            billing_period = {"start_date": membership.start_date, "expiry_date": membership.expiry_date}

        data = {
            "receipt_number": payment.receipt_number,
            "library": {
                "name": settings_obj.library_name,
                "phone": settings_obj.phone,
                "email": settings_obj.email,
                "address": settings_obj.address,
            },
            "student": {
                "id": payment.student_id,
                "full_name": payment.student.full_name,
                "student_code": payment.student.student_code,
                "phone": payment.student.phone,
            },
            "seat_number": seat_number,
            "shifts": shifts,
            "billing_period": billing_period,
            "amount": payment.amount,
            "payment_date": payment.payment_date,
            "method": payment.method,
            "status": payment.status,
            "reference_number": payment.reference_number,
            "notes": payment.notes,
            "currency_symbol": settings_obj.currency_symbol,
            "generated_at": payment.created_at,
        }
        return Response(data, status=status.HTTP_200_OK)
