from rest_framework import viewsets

from audit.utils import log_action

from .models import Shift
from .serializers import ShiftSerializer


class ShiftViewSet(viewsets.ModelViewSet):
    queryset = Shift.objects.all()
    serializer_class = ShiftSerializer
    filterset_fields = ["is_active"]

    def perform_create(self, serializer):
        instance = serializer.save()
        log_action(self.request.user, "create_shift", instance, changes=serializer.validated_data, request=self.request)

    def perform_update(self, serializer):
        instance = serializer.save()
        log_action(self.request.user, "update_shift", instance, changes=serializer.validated_data, request=self.request)

    def perform_destroy(self, instance):
        from memberships.models import MembershipShift

        if MembershipShift.objects.filter(shift=instance, is_active=True).exists():
            from rest_framework.exceptions import ValidationError

            raise ValidationError("Cannot delete a shift that currently has active bookings. Disable it instead.")
        log_action(self.request.user, "delete_shift", instance, request=self.request)
        instance.delete()
