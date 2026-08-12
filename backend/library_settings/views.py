from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from audit.utils import log_action

from .models import LibrarySettings
from .serializers import LibrarySettingsSerializer


class LibrarySettingsView(APIView):
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request):
        settings_obj = LibrarySettings.load()
        return Response(LibrarySettingsSerializer(settings_obj).data)

    def patch(self, request):
        settings_obj = LibrarySettings.load()
        serializer = LibrarySettingsSerializer(settings_obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        new_total = settings_obj.total_seats
        if "total_seats" in request.data:
            from seats.models import Seat

            existing_numbers = set(Seat.objects.values_list("number", flat=True))
            to_create = [
                Seat(number=n) for n in range(1, new_total + 1) if n not in existing_numbers
            ]
            if to_create:
                Seat.objects.bulk_create(to_create)

        log_action(
            request.user,
            "update_settings",
            settings_obj,
            changes={"total_seats": new_total},
            request=request,
        )
        return Response(LibrarySettingsSerializer(settings_obj).data)
