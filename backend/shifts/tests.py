import datetime

from django.test import TestCase

from testing_utils import authed_client


class ShiftTests(TestCase):
    def setUp(self):
        self.client, self.admin = authed_client()

    def test_create_shift(self):
        resp = self.client.post(
            "/api/shifts/", {"name": "Morning", "start_time": "06:00", "end_time": "12:00", "display_order": 1}, format="json"
        )
        self.assertEqual(resp.status_code, 201)

    def test_update_shift(self):
        resp = self.client.post(
            "/api/shifts/", {"name": "Morning", "start_time": "06:00", "end_time": "12:00"}, format="json"
        )
        shift_id = resp.data["id"]
        resp2 = self.client.patch(f"/api/shifts/{shift_id}/", {"end_time": "13:00"}, format="json")
        self.assertEqual(resp2.status_code, 200)
        self.assertEqual(resp2.data["end_time"], "13:00:00")

    def test_maximum_four_active_shifts_enforced(self):
        for i, name in enumerate(["Morning", "Afternoon", "Evening", "Night"]):
            resp = self.client.post(
                "/api/shifts/",
                {"name": name, "start_time": f"{(i * 6) % 24:02d}:00", "end_time": f"{((i * 6) + 5) % 24:02d}:00", "display_order": i},
                format="json",
            )
            self.assertEqual(resp.status_code, 201, resp.data)

        resp = self.client.post(
            "/api/shifts/", {"name": "Extra", "start_time": "23:00", "end_time": "23:30"}, format="json"
        )
        self.assertEqual(resp.status_code, 400)

    def test_disabled_shift_does_not_count_towards_limit(self):
        for i, name in enumerate(["Morning", "Afternoon", "Evening"]):
            self.client.post(
                "/api/shifts/",
                {"name": name, "start_time": f"{i:02d}:00", "end_time": f"{i + 1:02d}:00"},
                format="json",
            )
        resp = self.client.post(
            "/api/shifts/", {"name": "Night", "start_time": "21:00", "end_time": "23:00", "is_active": False}, format="json"
        )
        self.assertEqual(resp.status_code, 201)
