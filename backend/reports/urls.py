from django.urls import path

from . import export_views, views

urlpatterns = [
    path("collections", views.CollectionsReportView.as_view(), name="report_collections"),
    path("occupancy", views.OccupancyReportView.as_view(), name="report_occupancy"),
    path("students", views.StudentReportView.as_view(), name="report_students"),
    path("pending-fees", views.PendingFeesReportView.as_view(), name="report_pending_fees"),
    path("expiry", views.ExpiryReportView.as_view(), name="report_expiry"),
    path("export/students", export_views.ExportStudentsView.as_view(), name="export_students"),
    path("export/memberships", export_views.ExportMembershipsView.as_view(), name="export_memberships"),
    path("export/payments", export_views.ExportPaymentsView.as_view(), name="export_payments"),
    path("export/seats", export_views.ExportSeatsView.as_view(), name="export_seats"),
]
