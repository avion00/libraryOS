from django.contrib import admin

from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ["receipt_number", "student", "amount", "payment_date", "method", "status"]
    list_filter = ["status", "method"]
    search_fields = ["receipt_number", "student__full_name"]
