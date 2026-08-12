import datetime

from django.core.management.base import BaseCommand
from django.db import transaction

from accounts.models import Admin
from library_settings.models import LibrarySettings
from memberships import services as membership_services
from payments.models import Payment
from seats.models import Seat
from shifts.models import Shift
from students.models import Student

SHIFT_DEFS = [
    ("Morning", datetime.time(6, 0), datetime.time(12, 0), 1),
    ("Afternoon", datetime.time(12, 0), datetime.time(17, 0), 2),
    ("Evening", datetime.time(17, 0), datetime.time(21, 0), 3),
    ("Night", datetime.time(21, 0), datetime.time(6, 0), 4),
]

STUDENT_NAMES = [
    "Aarav Sharma", "Priya Patel", "Rohan Gupta", "Ananya Singh", "Vikram Rao",
    "Neha Verma", "Karan Mehta", "Sanya Kapoor", "Aditya Joshi", "Ishita Nair",
    "Arjun Reddy", "Divya Iyer", "Kabir Malhotra", "Riya Chatterjee", "Siddharth Bose",
    "Meera Pillai", "Yash Agarwal", "Tara Menon",
]


class Command(BaseCommand):
    help = "Seed the database with a realistic development dataset: admin, settings, shifts, seats, students, memberships, and payments."

    def add_arguments(self, parser):
        parser.add_argument("--seats", type=int, default=50)
        parser.add_argument("--admin-username", type=str, default="admin")
        parser.add_argument("--admin-password", type=str, default="Admin@12345")

    @transaction.atomic
    def handle(self, *args, **options):
        today = datetime.date.today()

        admin_username = options["admin_username"]
        admin_password = options["admin_password"]
        if not Admin.objects.filter(username=admin_username).exists():
            Admin.objects.create_superuser(
                username=admin_username, email="admin@libraryos.local", password=admin_password, role=Admin.ROLE_SUPERADMIN
            )
            self.stdout.write(self.style.SUCCESS(f"Created admin user: {admin_username} / {admin_password}"))
        else:
            self.stdout.write(f"Admin user '{admin_username}' already exists, skipping.")

        settings_obj = LibrarySettings.load()
        settings_obj.library_name = "Horizon Reading Library"
        settings_obj.phone = "+91-9876543210"
        settings_obj.email = "contact@horizonlibrary.example"
        settings_obj.address = "221B Knowledge Park, Sector 12, New Delhi"
        settings_obj.total_seats = options["seats"]
        settings_obj.default_monthly_fee = 1200
        settings_obj.save()
        self.stdout.write(self.style.SUCCESS(f"Configured library settings ({options['seats']} seats)."))

        shifts = {}
        for name, start, end, order in SHIFT_DEFS:
            shift, _ = Shift.objects.update_or_create(
                name=name, defaults={"start_time": start, "end_time": end, "is_active": True, "display_order": order}
            )
            shifts[name] = shift
        self.stdout.write(self.style.SUCCESS(f"Configured {len(shifts)} shifts."))

        existing_numbers = set(Seat.objects.values_list("number", flat=True))
        Seat.objects.bulk_create(
            [Seat(number=n) for n in range(1, options["seats"] + 1) if n not in existing_numbers]
        )
        self.stdout.write(self.style.SUCCESS(f"Ensured {options['seats']} seats exist."))

        if Student.objects.exists():
            self.stdout.write(self.style.WARNING("Students already exist — skipping student/membership/payment seeding."))
            return

        seat_list = list(Seat.objects.order_by("number"))
        shift_cycle = [shifts["Morning"], shifts["Afternoon"], shifts["Evening"], shifts["Night"]]

        created_students = []
        for i, name in enumerate(STUDENT_NAMES):
            student = Student.objects.create(
                full_name=name,
                phone=f"9{800000000 + i * 137}",
                email=f"{name.split()[0].lower()}{i}@example.com",
                address=f"House No. {i + 10}, Green Colony",
            )
            created_students.append(student)
        self.stdout.write(self.style.SUCCESS(f"Created {len(created_students)} students."))

        scenario_count = 0

        def make_membership(student, seat, shift_ids, start_date, expiry_date, fee=1200):
            return membership_services.create_membership(
                student=student, seat=seat, shift_ids=shift_ids, start_date=start_date, expiry_date=expiry_date, monthly_fee=fee
            )

        def record_payment(membership, amount, status, method="cash", days_ago=0):
            Payment.objects.create(
                student=membership.student,
                membership=membership,
                amount=amount,
                payment_date=membership.start_date + datetime.timedelta(days=days_ago),
                method=method,
                status=status,
                reference_number="",
                notes="Seed data",
            )

        # Scenario 1-6: active, fully paid, single shift, spread across seats.
        for i in range(6):
            student = created_students[scenario_count]
            seat = seat_list[scenario_count]
            m = make_membership(
                student, seat, [shift_cycle[i % 4].id],
                start_date=today - datetime.timedelta(days=5),
                expiry_date=today + datetime.timedelta(days=25),
            )
            record_payment(m, m.monthly_fee, Payment.STATUS_PAID)
            scenario_count += 1

        # Scenario 7-9: active, multi-shift booking on one seat.
        for i in range(3):
            student = created_students[scenario_count]
            seat = seat_list[scenario_count]
            m = make_membership(
                student, seat, [shifts["Morning"].id, shifts["Evening"].id],
                start_date=today - datetime.timedelta(days=10),
                expiry_date=today + datetime.timedelta(days=20),
                fee=2000,
            )
            record_payment(m, m.monthly_fee, Payment.STATUS_PAID)
            scenario_count += 1

        # Scenario 10-11: active, pending fee (no payment recorded yet).
        for i in range(2):
            student = created_students[scenario_count]
            seat = seat_list[scenario_count]
            make_membership(
                student, seat, [shift_cycle[scenario_count % 4].id],
                start_date=today - datetime.timedelta(days=3),
                expiry_date=today + datetime.timedelta(days=27),
            )
            scenario_count += 1

        # Scenario 12: active, partial payment.
        student = created_students[scenario_count]
        seat = seat_list[scenario_count]
        m = make_membership(
            student, seat, [shifts["Afternoon"].id],
            start_date=today - datetime.timedelta(days=8),
            expiry_date=today + datetime.timedelta(days=22),
        )
        record_payment(m, 500, Payment.STATUS_PARTIAL)
        scenario_count += 1

        # Scenario 13-14: expiring soon (within 3 days), fully paid.
        for i in range(2):
            student = created_students[scenario_count]
            seat = seat_list[scenario_count]
            m = make_membership(
                student, seat, [shift_cycle[scenario_count % 4].id],
                start_date=today - datetime.timedelta(days=28),
                expiry_date=today + datetime.timedelta(days=1 + i),
            )
            record_payment(m, m.monthly_fee, Payment.STATUS_PAID)
            scenario_count += 1

        # Scenario 15: already expired (will be flipped to 'expired' by sync).
        student = created_students[scenario_count]
        seat = seat_list[scenario_count]
        m = make_membership(
            student, seat, [shifts["Morning"].id],
            start_date=today - datetime.timedelta(days=45),
            expiry_date=today - datetime.timedelta(days=15),
        )
        record_payment(m, m.monthly_fee, Payment.STATUS_PAID)
        scenario_count += 1

        # Scenario 16: renewed membership (history chain of 2), currently active.
        student = created_students[scenario_count]
        seat = seat_list[scenario_count]
        first = make_membership(
            student, seat, [shifts["Evening"].id],
            start_date=today - datetime.timedelta(days=32),
            expiry_date=today - datetime.timedelta(days=1),
        )
        record_payment(first, first.monthly_fee, Payment.STATUS_PAID)
        renewed = membership_services.renew_membership(membership=first, monthly_fee=1200)
        record_payment(renewed, renewed.monthly_fee, Payment.STATUS_PAID)
        scenario_count += 1

        # Scenario 17: vacated seat, history preserved.
        student = created_students[scenario_count]
        seat = seat_list[scenario_count]
        m = make_membership(
            student, seat, [shifts["Night"].id],
            start_date=today - datetime.timedelta(days=20),
            expiry_date=today + datetime.timedelta(days=10),
        )
        record_payment(m, m.monthly_fee, Payment.STATUS_PAID)
        membership_services.vacate_membership(membership=m, reason="Student requested early exit")
        scenario_count += 1

        # Scenario 18: never booked a seat (no memberships at all).
        # created_students[scenario_count] intentionally left without a membership.

        membership_services.sync_expired_memberships()

        self.stdout.write(self.style.SUCCESS(f"Seeded {scenario_count} membership scenarios with payments."))
        self.stdout.write(self.style.SUCCESS("Seed complete."))
        self.stdout.write(self.style.SUCCESS(f"Login with username='{admin_username}' password='{admin_password}'"))
