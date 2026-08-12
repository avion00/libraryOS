from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Admin


@admin.register(Admin)
class AdminUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + ((None, {"fields": ("role", "phone")}),)
    list_display = ["username", "email", "role", "is_active", "is_staff"]
