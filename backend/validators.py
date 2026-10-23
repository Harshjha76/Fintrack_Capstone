"""
validators.py - server-side input validation.
Each validator returns (clean_data, errors). An empty errors dict means valid.
"""
from datetime import date, datetime
from decimal import Decimal, InvalidOperation

SITUATIONS = ["Necessary", "Casual", "Emergency", "Entertainment", "Time Pass", "Other"]
CATEGORIES = ["Food & Dining", "Rent & Hostel", "Transport", "Books & Supplies", "Tuition & Fees",
              "Mobile & Internet", "Entertainment", "Shopping", "Health", "Other"]
INCOME_SOURCES = ["Pocket Money", "Scholarship", "Part-time Job", "Internship Stipend",
                  "Freelance", "Gift", "Other"]
NOTIFICATION_TYPES = ["transaction", "budget", "info"]
MAX_AMOUNT = Decimal("10000000")


def _amount(value, errors):
    try:
        amount = Decimal(str(value).strip())
    except (InvalidOperation, TypeError):
        errors["amount"] = "Amount must be a number"
        return None
    if not amount.is_finite() or amount <= 0:
        errors["amount"] = "Amount must be greater than 0"
    elif amount > MAX_AMOUNT:
        errors["amount"] = "Amount is too large"
    elif amount.as_tuple().exponent < -2:
        errors["amount"] = "Use at most 2 decimal places"
    return amount


def _date(value, errors, allow_future=False):
    if value in (None, ""):
        return None
    try:
        parsed = datetime.strptime(str(value), "%Y-%m-%d").date()
    except ValueError:
        errors["date"] = "Date must be in YYYY-MM-DD format"
        return None
    if parsed > date.today() and not allow_future:
        errors["date"] = "Date cannot be in the future"
    return parsed


def _choice(value, allowed, field, errors):
    value = str(value or "").strip()
    if value not in allowed:            # linear search in a Python list
        errors[field] = "Choose one of: " + ", ".join(allowed)
    return value


def _month(value, errors):
    """'2026-09' style month key for budgets."""
    value = str(value or "").strip()
    try:
        datetime.strptime(value, "%Y-%m")
    except ValueError:
        errors["month"] = "Month must be in YYYY-MM format"
        return None
    return value


def validate_income(data):
    errors = {}
    clean = {
        "amount": _amount(data.get("amount"), errors),
        "source": _choice(data.get("source"), INCOME_SOURCES, "source", errors),
        "date": _date(data.get("date"), errors),
    }
    return clean, errors


def validate_expense(data):
    errors = {}
    clean = {
        "amount": _amount(data.get("amount"), errors),
        "category": _choice(data.get("category"), CATEGORIES, "category", errors),
        "situation": _choice(data.get("situation"), SITUATIONS, "situation", errors),
        "date": _date(data.get("date"), errors),
    }
    return clean, errors


def validate_budget(data):
    errors = {}
    limit = _amount(data.get("monthly_limit"), errors)
    clean = {
        "category": _choice(data.get("category"), CATEGORIES, "category", errors),
        "monthly_limit": limit,
        "month": _month(data.get("month"), errors),
    }
    if "amount" in errors:
        errors["monthly_limit"] = errors.pop("amount")
    return clean, errors


def validate_goal(data):
    errors = {}
    target = _amount(data.get("target_amount"), errors)
    if "amount" in errors:
        errors["target_amount"] = errors.pop("amount")
    saved = None
    if data.get("saved_amount") not in (None, ""):
        try:
            saved = Decimal(str(data["saved_amount"]).strip())
            if saved < 0:
                errors["saved_amount"] = "Saved amount cannot be negative"
        except (InvalidOperation, TypeError):
            errors["saved_amount"] = "Saved amount must be a number"
    name = str(data.get("name") or "").strip()
    if not name:
        errors["name"] = "Goal name is required"
    clean = {
        "name": name,
        "target_amount": target,
        "saved_amount": saved,
        "deadline": _date(data.get("deadline"), errors, allow_future=True),
    }
    return clean, errors


def validate_notification(data):
    errors = {}
    title = str(data.get("title") or "").strip()
    message = str(data.get("message") or "").strip()
    if not title:
        errors["title"] = "Title is required"
    if not message:
        errors["message"] = "Message is required"
    clean = {
        "title": title,
        "message": message,
        "type": _choice(data.get("type") or "info", NOTIFICATION_TYPES, "type", errors),
    }
    return clean, errors


def parse_month(text):
    """'2026-09' -> (2026, 9). Raises ValueError for bad input."""
    try:
        parsed = datetime.strptime(text, "%Y-%m")
    except ValueError:
        raise ValueError("month must be in YYYY-MM format")
    return parsed.year, parsed.month
