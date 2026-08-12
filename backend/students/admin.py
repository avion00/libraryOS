from django.contrib import admin

from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ["student_code", "full_name", "phone", "joining_date", "is_deleted"]
    search_fields = ["full_name", "phone", "student_code"]
