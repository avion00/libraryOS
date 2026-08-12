from django.contrib import admin

from .models import Membership, MembershipShift


class MembershipShiftInline(admin.TabularInline):
    model = MembershipShift
    extra = 0


@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ["id", "student", "seat", "start_date", "expiry_date", "status", "monthly_fee"]
    list_filter = ["status"]
    inlines = [MembershipShiftInline]
