from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from audit.utils import log_action
from memberships.models import MembershipShift

from . import services
from .models import Seat
from .serializers import SeatMapEntrySerializer, SeatSerializer


class SeatViewSet(viewsets.ModelViewSet):
    queryset = Seat.objects.all()
    serializer_class = SeatSerializer
    filterset_fields = ["status", "number"]

    def perform_create(self, serializer):
        instance = serializer.save()
        log_action(self.request.user, "create_seat", instance, request=self.request)

    def perform_update(self, serializer):
        if serializer.validated_data.get("status") == Seat.STATUS_DISABLED:
            instance = self.get_object()
            if MembershipShift.objects.filter(seat=instance, is_active=True).exists():
                raise ValidationError(
                    "Cannot disable a seat with active bookings. Vacate the seat first."
                )
        instance = serializer.save()
        log_action(self.request.user, "update_seat", instance, request=self.request)

    def perform_destroy(self, instance):
        if MembershipShift.objects.filter(seat=instance, is_active=True).exists():
            raise ValidationError("Cannot delete a seat with active bookings. Vacate the seat first.")
        if instance.memberships.exists():
            raise ValidationError(
                "This seat has membership/payment history and cannot be deleted. Disable it instead."
            )
        log_action(self.request.user, "delete_seat", instance, request=self.request)
        instance.delete()

    @action(detail=False, methods=["get"])
    def map(self, request):
        entries = services.get_seat_map()
        return Response(SeatMapEntrySerializer(entries, many=True).data)

    @action(detail=True, methods=["get"])
    def occupancy(self, request, pk=None):
        entries = services.get_seat_map(seat_ids=[int(pk)])
        if not entries:
            return Response({"detail": "Seat not found."}, status=404)
        return Response(SeatMapEntrySerializer(entries[0]).data)
