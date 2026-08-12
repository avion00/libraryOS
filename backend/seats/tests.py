from django.test import TestCase

from library_settings.models import LibrarySettings
from testing_utils import authed_client, make_seat, make_shift


class SeatTests(TestCase):
    def setUp(self):
        self.client, self.admin = authed_client()

    def test_create_seat(self):
        resp = self.client.post("/api/seats/", {"number": 5}, format="json")
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.data["status"], "available")

    def test_configure_total_seats_creates_missing_seats(self):
        settings_obj = LibrarySettings.load()
        self.assertEqual(settings_obj.total_seats, 50)
        resp = self.client.patch("/api/settings/", {"total_seats": 10}, format="json")
        self.assertEqual(resp.status_code, 200)
        from seats.models import Seat

        self.assertEqual(Seat.objects.count(), 10)

    def test_seat_map_shows_availability(self):
        seat = make_seat(number=1)
        make_shift()
        resp = self.client.get("/api/seats/map/")
        self.assertEqual(resp.status_code, 200)
        entry = next(e for e in resp.data if e["seat"]["number"] == 1)
        self.assertEqual(entry["slots"][0]["status"], "available")

    def test_disable_seat_with_active_booking_rejected(self):
        seat = make_seat(number=2)
        shift = make_shift()
        from students.models import Student

        s = Student.objects.create(full_name="Seat Occupant", phone="9666666666")
        from memberships import services

        services.create_membership(student=s, seat=seat, shift_ids=[shift.id])
        resp = self.client.patch(f"/api/seats/{seat.id}/", {"status": "disabled"}, format="json")
        self.assertEqual(resp.status_code, 400)
