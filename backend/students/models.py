from django.db import models


def generate_student_code():
    from django.db.models import Max

    last = Student.objects.aggregate(m=Max("id"))["m"] or 0
    return f"STU{last + 1:05d}"


class Student(models.Model):
    student_code = models.CharField(max_length=20, unique=True, editable=False)
    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20, unique=True)
    email = models.EmailField(blank=True, default="")
    address = models.TextField(blank=True, default="")
    joining_date = models.DateField(auto_now_add=True)
    photo = models.ImageField(upload_to="students/", null=True, blank=True)
    id_proof = models.FileField(upload_to="students/id_proofs/", null=True, blank=True)
    notes = models.TextField(blank=True, default="")
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "students"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["full_name"]),
            models.Index(fields=["phone"]),
            models.Index(fields=["student_code"]),
        ]

    def save(self, *args, **kwargs):
        if not self.student_code:
            self.student_code = generate_student_code()
        return super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name} ({self.student_code})"
