import io

from django.core import serializers as django_serializers
from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from .models import AuditLog
from .serializers import AuditLogSerializer
from .utils import log_action

BACKUP_APP_LABELS = [
    "accounts",
    "library_settings",
    "shifts",
    "seats",
    "students",
    "memberships",
    "payments",
    "audit",
]


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.select_related("user").all()
    serializer_class = AuditLogSerializer
    filterset_fields = ["action", "model_name", "user"]


class BackupView(APIView):
    """Full JSON export of every LibraryOS table (excluding raw password
    hashes are still present on Admin rows — this endpoint is authenticated
    and must never be exposed publicly)."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        from django.apps import apps

        buffer = io.StringIO()
        objects = []
        for label in BACKUP_APP_LABELS:
            for model in apps.get_app_config(label).get_models():
                objects.extend(model.objects.all())

        django_serializers.serialize("json", objects, stream=buffer, indent=2)
        log_action(request.user, "export_backup", None, model_name="Backup", request=request)

        response = HttpResponse(buffer.getvalue(), content_type="application/json")
        response["Content-Disposition"] = "attachment; filename=libraryos_backup.json"
        return response
