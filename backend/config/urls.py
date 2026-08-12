from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/settings/", include("library_settings.urls")),
    path("api/shifts/", include("shifts.urls")),
    path("api/seats/", include("seats.urls")),
    path("api/students/", include("students.urls")),
    path("api/memberships/", include("memberships.urls")),
    path("api/payments/", include("payments.urls")),
    path("api/dashboard/", include("dashboard.urls")),
    path("api/reports/", include("reports.urls")),
    path("api/audit/", include("audit.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
