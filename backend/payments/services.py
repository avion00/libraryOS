"""Single source of truth for derived payment/fee state.

Every part of the app (dashboard, student list, reports) must call into
here rather than re-deriving paid/pending/partial logic independently.
"""
from decimal import Decimal

from django.db.models import Sum

from .models import Payment


def get_collected_amount(membership):
    total = membership.payments.filter(status__in=[Payment.STATUS_PAID, Payment.STATUS_PARTIAL]).aggregate(
        s=Sum("amount")
    )["s"]
    return total or Decimal("0")


def derive_payment_status(due, collected):
    balance = max(due - collected, Decimal("0"))
    if collected <= 0:
        status = Payment.STATUS_PENDING
    elif balance > 0:
        status = Payment.STATUS_PARTIAL
    else:
        status = Payment.STATUS_PAID
    return balance, status


def get_membership_payment_summary(membership, collected=None):
    collected = get_collected_amount(membership) if collected is None else collected
    due = membership.monthly_fee
    balance, status = derive_payment_status(due, collected)
    return {
        "monthly_fee": due,
        "amount_collected": collected,
        "balance_due": balance,
        "payment_status": status,
    }


def get_active_memberships_with_balance():
    """Annotates every active Membership with amount_collected/balance_due in
    a single query set — used by the dashboard and pending-fee report so the
    same balance definition is never recomputed differently in two places."""
    from django.db.models import DecimalField, F, OuterRef, Subquery
    from django.db.models.functions import Coalesce, Greatest

    from memberships.models import Membership

    collected_subquery = (
        Payment.objects.filter(membership_id=OuterRef("pk"), status__in=[Payment.STATUS_PAID, Payment.STATUS_PARTIAL])
        .values("membership_id")
        .annotate(s=Sum("amount"))
        .values("s")
    )
    return Membership.objects.filter(status=Membership.STATUS_ACTIVE).annotate(
        amount_collected=Coalesce(
            Subquery(collected_subquery, output_field=DecimalField(max_digits=10, decimal_places=2)),
            Decimal("0"),
        )
    ).annotate(
        balance_due=Greatest(F("monthly_fee") - F("amount_collected"), Decimal("0"), output_field=DecimalField(max_digits=10, decimal_places=2))
    )


def get_collected_amounts_bulk(membership_ids):
    """Returns {membership_id: collected_amount} for many memberships in one query."""
    rows = (
        Payment.objects.filter(membership_id__in=membership_ids, status__in=[Payment.STATUS_PAID, Payment.STATUS_PARTIAL])
        .values("membership_id")
        .annotate(s=Sum("amount"))
    )
    return {row["membership_id"]: row["s"] or Decimal("0") for row in rows}
