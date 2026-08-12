import datetime

from django.test import TestCase

from memberships import services
from payments.models import Payment
from testing_utils import authed_client, make_seat, make_shift, make_student


class PaymentTests(TestCase):
    def setUp(self):
        self.client, self.admin = authed_client()
        self.seat = make_seat(1)
        self.shift = make_shift()
        self.student = make_student()
        self.membership = services.create_membership(
            student=self.student, seat=self.seat, shift_ids=[self.shift.id], monthly_fee=1000
        )

    def test_record_payment(self):
        resp = self.client.post(
            "/api/payments/",
            {
                "student": self.student.id,
                "membership": self.membership.id,
                "amount": "1000.00",
                "payment_date": str(datetime.date.today()),
                "method": "cash",
                "status": "paid",
            },
            format="json",
        )
        self.assertEqual(resp.status_code, 201, resp.data)
        self.assertTrue(resp.data["receipt_number"].startswith("RCPT-"))

    def test_pending_status_reflected_without_payment(self):
        resp = self.client.get(f"/api/students/{self.student.id}/")
        self.assertEqual(resp.data["summary"]["current_membership"]["payment_status"], "pending")

    def test_partial_payment_reflected(self):
        Payment.objects.create(
            student=self.student, membership=self.membership, amount=400,
            payment_date=datetime.date.today(), method="cash", status=Payment.STATUS_PARTIAL,
        )
        resp = self.client.get(f"/api/students/{self.student.id}/")
        summary = resp.data["summary"]["current_membership"]
        self.assertEqual(summary["payment_status"], "partial")
        self.assertEqual(float(summary["balance_due"]), 600.0)

    def test_payment_history_for_student(self):
        Payment.objects.create(
            student=self.student, membership=self.membership, amount=1000,
            payment_date=datetime.date.today(), method="cash", status=Payment.STATUS_PAID,
        )
        resp = self.client.get(f"/api/students/{self.student.id}/payments/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(len(resp.data["results"]) if "results" in resp.data else len(resp.data), 1)

    def test_receipt_generation(self):
        payment = Payment.objects.create(
            student=self.student, membership=self.membership, amount=1000,
            payment_date=datetime.date.today(), method="cash", status=Payment.STATUS_PAID,
        )
        resp = self.client.get(f"/api/payments/{payment.id}/receipt/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["seat_number"], self.seat.number)
        self.assertIn(self.shift.name, resp.data["shifts"])
        self.assertEqual(resp.data["receipt_number"], payment.receipt_number)

    def test_invalid_amount_rejected(self):
        resp = self.client.post(
            "/api/payments/",
            {
                "student": self.student.id, "membership": self.membership.id, "amount": "-5.00",
                "payment_date": str(datetime.date.today()), "method": "cash", "status": "paid",
            },
            format="json",
        )
        self.assertEqual(resp.status_code, 400)

    def test_payments_cannot_be_deleted(self):
        payment = Payment.objects.create(
            student=self.student, membership=self.membership, amount=1000,
            payment_date=datetime.date.today(), method="cash", status=Payment.STATUS_PAID,
        )
        resp = self.client.delete(f"/api/payments/{payment.id}/")
        self.assertEqual(resp.status_code, 405)
