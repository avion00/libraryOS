import logging

from django.core.exceptions import PermissionDenied, ValidationError as DjangoValidationError
from django.http import Http404
from rest_framework import exceptions as drf_exceptions
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Normalizes all API error responses to:
        {"detail": "human readable message", "errors": {...field errors...}}
    Never leaks internal exception details or stack traces to the client.
    """
    if isinstance(exc, DjangoValidationError):
        exc = drf_exceptions.ValidationError(exc.message_dict if hasattr(exc, "message_dict") else exc.messages)
    if isinstance(exc, Http404):
        exc = drf_exceptions.NotFound()
    if isinstance(exc, PermissionDenied):
        exc = drf_exceptions.PermissionDenied()

    response = drf_exception_handler(exc, context)

    if response is not None:
        data = response.data
        errors = None
        if isinstance(data, dict):
            detail = data.get("detail")
            if detail is None:
                errors = data
                detail = "Validation failed."
        elif isinstance(data, list):
            detail = "; ".join(str(item) for item in data)
            errors = data
        else:
            detail = str(data)

        response.data = {"detail": str(detail), "errors": errors}
        return response

    # Unhandled exception: log full detail server-side, return a safe generic message.
    logger.exception("Unhandled exception in API view", exc_info=exc)
    return Response(
        {"detail": "An unexpected server error occurred. Please try again.", "errors": None},
        status=500,
    )
