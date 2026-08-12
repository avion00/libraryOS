import datetime

from django.test import TestCase

from memberships import services
from payments.models import Payment
from testing_utils import authed_client, make_seat, make_shift, make_student


class ReportsTests(TestCase):
    def setUp(self):
        self.client, self.admin = authed_client()
        self.seat1 = make_seat(1)
        self.seat2 = make_seat(2)
        self.morning = make_shift("Morning", datetime.time(6, 0), datetime.time(12, 0), 1)
        self.evening = make_shift("Evening", datetime.time(17, 0), datetime.time(21, 0), 2)
        self.student1 = make_student("Report Student 1", "9700000001")
        self.student2 = make_student("Report Student 2", "9700000002")

        m1 = services.create_membership(student=self.student1, seat=self.seat1, shift_ids=[self.morning.id], monthly_fee=1000)
        services.create_membership(student=self.student2, seat=self.seat1, shift_ids=[self.evening.id], monthly_fee=1000)

        Payment.objects.create(
            student=self.student1, membership=m1, amount=1000, payment_date=datetime.date.today(),
            method="cash", status=Payment.STATUS_PAID,
        )
        Payment.objects.create(
            student=self.student1, membership=m1, amount=500, payment_date=datetime.date.today(),
            method="online", status=Payment.STATUS_PAID,
        )

    def test_collections_report_today(self):
        resp = self.client.get("/api/reports/collections?range=today")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(float(resp.data["total_collected"]), 1500.0)
        self.assertEqual(resp.data["payment_count"], 2)
        methods = {row["method"]: float(row["total"]) for row in resp.data["by_method"]}
        self.assertEqual(methods["cash"], 1000.0)
        self.assertEqual(methods["online"], 500.0)

    def test_collections_report_custom_range(self):
        date_str = str(datetime.date.today())
        resp = self.client.get(f"/api/reports/collections?range=custom&date_from={date_str}&date_to={date_str}")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["payment_count"], 2)

    def test_occupancy_report(self):
        resp = self.client.get("/api/reports/occupancy")
        self.assertEqual(resp.status_code, 200)
        # 2 seats x 2 active shifts = 4 seat-shift slots, 2 occupied
        self.assertEqual(resp.data["total_seat_shifts"], 4)
        self.assertEqual(resp.data["occupied_seat_shifts"], 2)
        self.assertEqual(resp.data["occupancy_percentage"], 50.0)

    def test_pending_fees_report(self):
        resp = self.client.get("/api/reports/pending-fees")
        self.assertEqual(resp.status_code, 200)
        student_ids = [row["student_id"] for row in resp.data["rows"]]
        self.assertIn(self.student2.id, student_ids)
        self.assertNotIn(self.student1.id, student_ids)

    def test_expiry_report(self):
        resp = self.client.get("/api/reports/expiry?days=45")
        self.assertEqual(resp.status_code, 200)
        self.assertGreaterEqual(resp.data["count"], 2)
