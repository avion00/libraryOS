from django.contrib.auth.models import AbstractUser
from django.db import models


class Admin(AbstractUser):
    """Library administrator/staff account.

    Extends Django's built-in user so multiple admins with distinct
    permissions can be supported later without a schema change.
    """

    ROLE_SUPERADMIN = "superadmin"
    ROLE_ADMIN = "admin"
    ROLE_STAFF = "staff"
    ROLE_CHOICES = [
        (ROLE_SUPERADMIN, "Super Admin"),
        (ROLE_ADMIN, "Admin"),
        (ROLE_STAFF, "Staff"),
    ]

    role = models.CharField(max_length=16, choices=ROLE_CHOICES, default=ROLE_ADMIN)
    phone = models.CharField(max_length=20, blank=True, default="")

    class Meta:
        db_table = "accounts_admin"

    def __str__(self):
        return self.username
