"""Shared helpers for the Django test suite (plain unittest/TestCase based)."""
import datetime

from rest_framework.test import APIClient

from accounts.models import Admin
from library_settings.models import LibrarySettings
from seats.models import Seat
from shifts.models import Shift
from students.models import Student


def create_admin(username="tester", password="Test@12345", role=Admin.ROLE_ADMIN):
    return Admin.objects.create_user(username=username, password=password, role=role, email=f"{username}@example.com")


def authed_client(admin=None):
    admin = admin or create_admin()
    client = APIClient()
    resp = client.post("/api/auth/login", {"username": admin.username, "password": "Test@12345"}, format="json")
    token = resp.data["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    return client, admin


def make_shift(name="Morning", start=datetime.time(6, 0), end=datetime.time(12, 0), order=1):
    return Shift.objects.create(name=name, start_time=start, end_time=end, is_active=True, display_order=order)


def make_seat(number=1):
    return Seat.objects.create(number=number)


def make_student(full_name="Alice Test", phone="9000000001"):
    return Student.objects.create(full_name=full_name, phone=phone)


def ensure_settings():
    return LibrarySettings.load()
