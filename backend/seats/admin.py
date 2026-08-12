from django.contrib import admin

from .models import Seat


@admin.register(Seat)
class SeatAdmin(admin.ModelAdmin):
    list_display = ["number", "status", "created_at"]
    list_filter = ["status"]
    search_fields = ["number"]
