def log_action(user, action, instance, changes=None, request=None, model_name=None):
    """Write a single audit trail entry. Never raises — auditing must not break
    the primary operation it is observing. Runs in its own savepoint so a
    logging failure can never poison the caller's outer transaction."""
    from django.db import transaction

    from .models import AuditLog

    try:
        ip = None
        if request is not None:
            ip = request.META.get("REMOTE_ADDR")
        with transaction.atomic():
            AuditLog.objects.create(
                user=user if user and user.is_authenticated else None,
                action=action,
                model_name=model_name or (instance.__class__.__name__ if instance is not None else ""),
                object_id=str(getattr(instance, "pk", "") or ""),
                changes=changes or {},
                ip_address=ip,
            )
    except Exception:
        import logging

        logging.getLogger(__name__).exception("Failed to write audit log for %s", action)
