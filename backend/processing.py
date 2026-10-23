"""
processing.py - Data Structures & Algorithms layer.

MySQL does permanent storage and heavy aggregation (SUM / GROUP BY).
Python lists and dictionaries are used for temporary, in-memory processing:
  - list of dicts   : the result set returned by MySQL
  - linear search   : O(n) text search across chosen fields
  - traversal       : percentage share, totals, progress
  - dictionary      : O(1) lookup to merge monthly income & expense rows
"""
from datetime import date, datetime
from decimal import Decimal


def serialize(rows):
    """Convert DB types (Decimal, date) into JSON-friendly values."""
    out = []
    for row in rows:
        item = {}
        for key, value in row.items():
            if isinstance(value, Decimal):
                item[key] = float(value)
            elif isinstance(value, (date, datetime)):
                item[key] = value.isoformat()
            else:
                item[key] = value
        out.append(item)
    return out


def linear_search(records, query, fields):
    """Return records where any field contains the query (case-insensitive). O(n * f)."""
    q = query.lower()
    matches = []
    for record in records:
        for field in fields:
            if q in str(record.get(field, "")).lower():
                matches.append(record)
                break
    return matches


def add_share(rows):
    """Traverse grouped rows and add each row's percentage of the total."""
    total = sum(row["total"] for row in rows)
    for row in rows:
        row["share"] = round(row["total"] / total * 100, 1) if total else 0.0
    return rows


def merge_monthly(income_rows, expense_rows):
    """Merge two GROUP BY month result sets into one sorted list using a dict."""
    months = {}
    for rows, field in ((income_rows, "income"), (expense_rows, "expense")):
        for row in rows:
            key = "{}-{:02d}".format(int(row["yr"]), int(row["mon"]))
            entry = months.setdefault(key, {"month": key, "income": 0.0, "expense": 0.0})
            entry[field] = float(row["total"])
    result = [months[key] for key in sorted(months)]
    for entry in result:
        entry["balance"] = round(entry["income"] - entry["expense"], 2)
    return result


def budget_status_rows(limits, spent):
    """Merge budget limits and actual spend (dict lookup by category)."""
    spent_map = {row["category"]: float(row["total"]) for row in spent}
    out = []
    for limit in limits:
        used = spent_map.get(limit["category"], 0.0)
        limit_amount = float(limit["monthly_limit"])
        used_percent = round(used / limit_amount * 100, 1) if limit_amount else 0.0
        if used > limit_amount:
            state = "over"
        elif used_percent >= 80:
            state = "close"
        else:
            state = "ok"
        out.append({
            "budget_id": limit["budget_id"],
            "category": limit["category"],
            "month": limit["month"],
            "limit": limit_amount,
            "spent": round(used, 2),
            "remaining": round(limit_amount - used, 2),
            "used_percent": used_percent,
            "status": state,
        })
    return out


def goal_progress_rows(goals):
    """Traverse goals and add progress, remaining amount and a status label."""
    out = []
    for goal in goals:
        saved = float(goal["saved_amount"])
        target = float(goal["target_amount"])
        progress = round(saved / target * 100, 1) if target else 0.0
        out.append(dict(goal, progress=progress,
                        remaining=round(max(target - saved, 0.0), 2),
                        status="Reached" if saved >= target else "In progress"))
    return out


def financial_status(total_income, total_expense):
    """Balance, savings rate and a simple health label."""
    balance = round(total_income - total_expense, 2)
    rate = (balance / total_income * 100) if total_income > 0 else 0.0
    if balance < 0:
        status = "Warning"
    elif rate >= 20:
        status = "Stable"
    else:
        status = "Watch"
    return {"balance": balance, "savings_rate": round(rate, 1), "status": status}
