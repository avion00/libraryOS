import datetime

from django.test import TestCase

from memberships import services
from memberships.models import Membership
from testing_utils import authed_client, make_seat, make_shift, make_student


class MembershipServiceTests(TestCase):
    """Business-logic level tests, bypassing the API layer, to pin down the
    core booking-conflict guarantees precisely."""

    def setUp(self):
        self.seat = make_seat(1)
        self.morning = make_shift("Morning", datetime.time(6, 0), datetime.time(12, 0), 1)
        self.evening = make_shift("Evening", datetime.time(17, 0), datetime.time(21, 0), 2)
        self.student_a = make_student("Student A", "9000000001")
        self.student_b = make_student("Student B", "9000000002")

    def test_create_membership_assigns_seat_and_shift(self):
        m = services.create_membership(student=self.student_a, seat=self.seat, shift_ids=[self.morning.id])
        self.assertEqual(m.status, Membership.STATUS_ACTIVE)
        self.assertEqual(m.membership_shifts.count(), 1)

    def test_create_membership_multiple_shifts(self):
        m = services.create_membership(student=self.student_a, seat=self.seat, shift_ids=[self.morning.id, self.evening.id])
        self.assertEqual(m.membership_shifts.filter(is_active=True).count(), 2)

    def test_double_booking_same_seat_same_shift_rejected(self):
        services.create_membership(student=self.student_a, seat=self.seat, shift_ids=[self.morning.id])
        with self.assertRaises(services.BookingConflictError):
            services.create_membership(student=self.student_b, seat=self.seat, shift_ids=[self.morning.id])

    def test_same_seat_different_shift_is_independently_bookable(self):
        services.create_membership(student=self.student_a, seat=self.seat, shift_ids=[self.morning.id])
        m2 = services.create_membership(student=self.student_b, seat=self.seat, shift_ids=[self.evening.id])
        self.assertEqual(m2.status, Membership.STATUS_ACTIVE)

    def test_renewal_preserves_history_and_frees_then_reclaims_slot(self):
        m1 = services.create_membership(
            student=self.student_a, seat=self.seat, shift_ids=[self.morning.id],
            start_date=datetime.date(2026, 8, 1), expiry_date=datetime.date(2026, 8, 31),
        )
        m2 = services.renew_membership(membership=m1)
        m1.refresh_from_db()
        self.assertEqual(m1.status, Membership.STATUS_EXPIRED)
        self.assertEqual(m2.status, Membership.STATUS_ACTIVE)
        self.assertEqual(m2.previous_membership_id, m1.id)
        self.assertEqual(m2.start_date, datetime.date(2026, 9, 1))
        self.assertEqual(m2.expiry_date, datetime.date(2026, 9, 30))
        # history preserved
        self.assertEqual(self.student_a.memberships.count(), 2)

    def test_cannot_renew_a_vacated_membership(self):
        m1 = services.create_membership(student=self.student_a, seat=self.seat, shift_ids=[self.morning.id])
        services.vacate_membership(membership=m1)
        with self.assertRaises(services.MembershipError):
            services.renew_membership(membership=m1)

    def test_vacate_frees_seat_for_new_booking(self):
        m1 = services.create_membership(student=self.student_a, seat=self.seat, shift_ids=[self.morning.id])
        services.vacate_membership(membership=m1)
        m2 = services.create_membership(student=self.student_b, seat=self.seat, shift_ids=[self.morning.id])
        self.assertEqual(m2.status, Membership.STATUS_ACTIVE)
        # original membership record still exists, untouched
        m1.refresh_from_db()
        self.assertEqual(m1.status, Membership.STATUS_VACATED)

    def test_student_cannot_have_two_simultaneous_active_memberships(self):
        seat2 = make_seat(2)
        services.create_membership(student=self.student_a, seat=self.seat, shift_ids=[self.morning.id])
        with self.assertRaises(services.MembershipError):
            services.create_membership(student=self.student_a, seat=seat2, shift_ids=[self.morning.id])

    def test_disabled_seat_cannot_be_assigned(self):
        self.seat.status = "disabled"
        self.seat.save()
        with self.assertRaises(services.MembershipError):
            services.create_membership(student=self.student_a, seat=self.seat, shift_ids=[self.morning.id])

    def test_change_seat_moves_active_booking(self):
        seat2 = make_seat(2)
        m1 = services.create_membership(student=self.student_a, seat=self.seat, shift_ids=[self.morning.id])
        moved = services.change_seat_or_shifts(membership=m1, seat=seat2)
        self.assertEqual(moved.seat_id, seat2.id)
        # old seat+shift now free
        m2 = services.create_membership(student=self.student_b, seat=self.seat, shift_ids=[self.morning.id])
        self.assertEqual(m2.status, Membership.STATUS_ACTIVE)

    def test_sync_expired_memberships_flips_status_and_frees_slot(self):
        m1 = services.create_membership(
            student=self.student_a, seat=self.seat, shift_ids=[self.morning.id],
            start_date=datetime.date(2020, 1, 1), expiry_date=datetime.date(2020, 1, 31),
        )
        count = services.sync_expired_memberships()
        self.assertGreaterEqual(count, 1)
        m1.refresh_from_db()
        self.assertEqual(m1.status, Membership.STATUS_EXPIRED)
        # slot now free
        m2 = services.create_membership(student=self.student_b, seat=self.seat, shift_ids=[self.morning.id])
        self.assertEqual(m2.status, Membership.STATUS_ACTIVE)


class MembershipAPITests(TestCase):
    def setUp(self):
        self.client, self.admin = authed_client()
        self.seat = make_seat(1)
        self.shift = make_shift()
        self.student = make_student()

    def test_create_membership_via_api(self):
        resp = self.client.post(
            "/api/memberships/",
            {"student_id": self.student.id, "seat_id": self.seat.id, "shift_ids": [self.shift.id], "monthly_fee": "1500.00"},
            format="json",
        )
        self.assertEqual(resp.status_code, 201, resp.data)
        self.assertEqual(resp.data["status"], "active")

    def test_double_booking_via_api_returns_409(self):
        other_student = make_student("Other", "9000000099")
        self.client.post(
            "/api/memberships/",
            {"student_id": self.student.id, "seat_id": self.seat.id, "shift_ids": [self.shift.id], "monthly_fee": "1500.00"},
            format="json",
        )
        resp = self.client.post(
            "/api/memberships/",
            {"student_id": other_student.id, "seat_id": self.seat.id, "shift_ids": [self.shift.id], "monthly_fee": "1500.00"},
            format="json",
        )
        self.assertEqual(resp.status_code, 409)

    def test_vacate_via_api(self):
        create = self.client.post(
            "/api/memberships/",
            {"student_id": self.student.id, "seat_id": self.seat.id, "shift_ids": [self.shift.id]},
            format="json",
        )
        membership_id = create.data["id"]
        resp = self.client.post(f"/api/memberships/{membership_id}/vacate/", {"reason": "left"}, format="json")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["status"], "vacated")
