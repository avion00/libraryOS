from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import AuditLogViewSet, BackupView

router = DefaultRouter()
router.register("logs", AuditLogViewSet, basename="auditlog")

urlpatterns = router.urls + [
    path("backup", BackupView.as_view(), name="backup"),
]
