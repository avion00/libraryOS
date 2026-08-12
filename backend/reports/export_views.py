import csv

from django.http import HttpResponse
from rest_framework.views import APIView

from memberships.models import Membership
from memberships.services import sync_expired_memberships
from payments.models import Payment
from seats.models import Seat
from students.models import Student


def _csv_response(filename, header, rows):
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = f'attachment; filename="{filename}"'
    writer = csv.writer(response)
    writer.writerow(header)
    for row in rows:
        writer.writerow(row)
    return response


class ExportStudentsView(APIView):
    def get(self, request):
        sync_expired_memberships()
        students = Student.objects.filter(is_deleted=False).order_by("student_code")
        header = ["student_code", "full_name", "phone", "email", "address", "joining_date", "created_at"]
        rows = (
            [s.student_code, s.full_name, s.phone, s.email, s.address, s.joining_date, s.created_at]
            for s in students
        )
        return _csv_response("students.csv", header, rows)


class ExportMembershipsView(APIView):
    def get(self, request):
        memberships = Membership.objects.select_related("student", "seat").order_by("-start_date")
        header = [
            "id", "student_code", "student_name", "seat_number", "shifts", "start_date", "expiry_date",
            "monthly_fee", "status", "created_at",
        ]

        def rows():
            for m in memberships:
                shifts = ", ".join(
                    ms.shift.name for ms in m.membership_shifts.select_related("shift").all()
                )
                yield [
                    m.id, m.student.student_code, m.student.full_name, m.seat.number, shifts,
                    m.start_date, m.expiry_date, m.monthly_fee, m.status, m.created_at,
                ]

        return _csv_response("memberships.csv", header, rows())


class ExportPaymentsView(APIView):
    def get(self, request):
        payments = Payment.objects.select_related("student", "membership").order_by("-payment_date")
        header = [
            "receipt_number", "student_code", "student_name", "membership_id", "amount", "payment_date",
            "method", "status", "reference_number", "created_at",
        ]
        rows = (
            [
                p.receipt_number, p.student.student_code, p.student.full_name, p.membership_id, p.amount,
                p.payment_date, p.method, p.status, p.reference_number, p.created_at,
            ]
            for p in payments
        )
        return _csv_response("payments.csv", header, rows)


class ExportSeatsView(APIView):
    def get(self, request):
        seats = Seat.objects.order_by("number")
        header = ["number", "status", "notes", "created_at"]
        rows = ([s.number, s.status, s.notes, s.created_at] for s in seats)
        return _csv_response("seats.csv", header, rows)
