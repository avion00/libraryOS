from django.contrib import admin

from .models import Shift


@admin.register(Shift)
class ShiftAdmin(admin.ModelAdmin):
    list_display = ["name", "start_time", "end_time", "is_active", "display_order"]
