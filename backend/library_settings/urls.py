from django.urls import path

from .views import LibrarySettingsView

urlpatterns = [
    path("", LibrarySettingsView.as_view(), name="settings"),
]
