from django.conf import settings
from django.core.serializers.json import DjangoJSONEncoder
from django.db import models


class AuditLog(models.Model):
    """Immutable record of an important administrative action.

    Rows are never updated or deleted by application code.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="audit_logs",
    )
    action = models.CharField(max_length=64)
    model_name = models.CharField(max_length=64)
    object_id = models.CharField(max_length=64, blank=True, default="")
    changes = models.JSONField(default=dict, blank=True, encoder=DjangoJSONEncoder)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["model_name", "object_id"]),
            models.Index(fields=["-created_at"]),
        ]

    def __str__(self):
        return f"{self.action} {self.model_name}#{self.object_id} by {self.user_id}"
