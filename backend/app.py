"""
app.py - FinTrack Flask REST API.
Layer 2 of the architecture: FlutterFlow (UI) -> Flask (this file) -> MySQL.
Every value reaches SQL through %s placeholders (parameterized queries).
"""
import os
from datetime import date

from flask import Flask, jsonify, request
from flask_cors import CORS
from mysql.connector import Error as MySQLError, IntegrityError

from db import execute, fetch_all
from processing import (add_share, budget_status_rows, financial_status,
                        goal_progress_rows, linear_search, merge_monthly, serialize)
from validators import (parse_month, validate_budget, validate_expense,
                        validate_goal, validate_income, validate_notification)

app = Flask(__name__)
CORS(app)

# Table and column names cannot be SQL parameters, so they only ever come
# from this fixed whitelist - never from user input.
RESOURCES = {
    "income": {
        "table": "income",
        "pk": "income_id",
        "columns": ["amount", "source", "date"],
        "filters": ["source"],
        "search_fields": ["source", "amount", "date"],
        "validate": validate_income,
    },
    "expenses": {
        "table": "expenses",
        "pk": "expense_id",
        "columns": ["amount", "category", "situation", "date"],
        "filters": ["category", "situation"],
        "search_fields": ["category", "situation", "amount", "date"],
        "validate": validate_expense,
    },
    "budgets": {
        "table": "budgets",
        "pk": "budget_id",
        "columns": ["category", "monthly_limit", "month"],
        "filters": ["category", "month"],
        "search_fields": ["category", "month", "monthly_limit"],
        "validate": validate_budget,
    },
    "goals": {
        "table": "savings_goals",
        "pk": "goal_id",
        "columns": ["name", "target_amount", "saved_amount", "deadline"],
        "filters": [],
        "search_fields": ["name"],
        "validate": validate_goal,
    },
    "notifications": {
        "table": "notifications",
        "pk": "notification_id",
        "columns": ["title", "message", "type"],
        "filters": ["type"],
        "search_fields": ["title", "message"],
        "validate": validate_notification,
    },
}

SORT_ORDERS = {
    "newest": "date DESC, {pk} DESC",
    "oldest": "date ASC, {pk} ASC",
    "amount_desc": "amount DESC, {pk} DESC",
    "amount_asc": "amount ASC, {pk} ASC",
}

# Default ORDER BY per resource (only income/expenses support ?sort=).
DEFAULT_ORDER = {
    "income": "date DESC, income_id DESC",
    "expenses": "date DESC, expense_id DESC",
    "budgets": "month DESC, budget_id DESC",
    "goals": "goal_id DESC",
    "notifications": "created_at DESC, notification_id DESC",
}


def get_resource(name):
    cfg = RESOURCES.get(name)
    if cfg is None:
        raise LookupError(name)
    return cfg


def month_clause(params):
    """Optional ?month=YYYY-MM filter. Appends params, returns SQL fragment or ''."""
    month = request.args.get("month", "").strip()
    if not month:
        return ""
    year, mon = parse_month(month)
    params.extend([year, mon])
    return "YEAR(date) = %s AND MONTH(date) = %s"


def find_one(cfg, record_id):
    sql = "SELECT {pk}, {cols} FROM {t} WHERE {pk} = %s".format(
        pk=cfg["pk"], cols=", ".join(cfg["columns"]), t=cfg["table"])
    rows = fetch_all(sql, (record_id,))
    return serialize(rows)[0] if rows else None


def _notify(title, message, type_="info"):
    """Best-effort notification write - never blocks the main operation."""
    try:
        execute("INSERT INTO notifications (title, message, type) VALUES (%s, %s, %s)",
                (title, message, type_))
    except Exception:
        app.logger.warning("Could not write notification", exc_info=True)


def _budget_alert(clean):
    """After an expense insert, alert if the category crossed its monthly budget."""
    year, mon = clean["date"].year, clean["date"].month
    month_key = "{:04d}-{:02d}".format(year, mon)
    limit_rows = fetch_all(
        "SELECT monthly_limit FROM budgets WHERE category = %s AND month = %s",
        (clean["category"], month_key))
    if not limit_rows:
        return
    limit = float(limit_rows[0]["monthly_limit"])
    spent = float(fetch_all(
        "SELECT COALESCE(SUM(amount), 0) AS t FROM expenses "
        "WHERE category = %s AND YEAR(date) = %s AND MONTH(date) = %s",
        (clean["category"], year, mon))[0]["t"])
    if spent > limit:
        _notify("Budget alert",
                "Spending on {} crossed its Rs. {:,.2f} monthly budget.".format(
                    clean["category"], limit),
                "budget")


@app.get("/api/health")
def health():
    fetch_all("SELECT 1 AS ok")
    return jsonify({"status": "ok", "database": "connected"})


# ---------------- CRUD ----------------

@app.get("/api/<resource>")
def list_records(resource):
    cfg = get_resource(resource)
    where, params = [], []
    for field in cfg["filters"]:
        value = request.args.get(field, "").strip()
        if value:
            where.append(field + " = %s")
            params.append(value)
    if resource == "notifications" and request.args.get("unread", "").strip() == "1":
        where.append("is_read = 0")
    if resource in ("income", "expenses"):      # ?month= filters a date column
        clause = month_clause(params)
        if clause:
            where.append(clause)

    order = DEFAULT_ORDER[resource]
    if resource in ("income", "expenses"):      # ?sort= applies to dated records
        order = SORT_ORDERS.get(request.args.get("sort", "newest"), order).format(pk=cfg["pk"])
    sql = "SELECT * FROM {t}".format(t=cfg["table"])
    if where:
        sql += " WHERE " + " AND ".join(where)
    sql += " ORDER BY " + order

    records = serialize(fetch_all(sql, tuple(params)))      # Python list of dicts

    query = request.args.get("search", "").strip()
    if query:
        records = linear_search(records, query, cfg["search_fields"])

    return jsonify({"count": len(records), "records": records})


@app.get("/api/<resource>/<int:record_id>")
def get_record(resource, record_id):
    record = find_one(get_resource(resource), record_id)
    if record is None:
        return jsonify({"error": "Record not found"}), 404
    return jsonify(record)


@app.post("/api/<resource>")
def create_record(resource):
    cfg = get_resource(resource)
    clean, errors = cfg["validate"](request.get_json(silent=True) or {})
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 400
    cols = cfg["columns"]
    sql = "INSERT INTO {t} ({c}) VALUES ({p})".format(
        t=cfg["table"], c=", ".join(cols), p=", ".join(["%s"] * len(cols)))
    new_id, _ = execute(sql, tuple(clean[c] for c in cols))

    # Auto-notifications, mirroring the hosted app's behaviour.
    if resource in ("income", "expenses"):
        label = clean.get("source") or clean.get("category") or resource
        _notify("Transaction recorded",
                "{} of Rs. {:,.2f} recorded ({}).".format(
                    resource.title(), float(clean["amount"]), label),
                "transaction")
    if resource == "expenses":
        _budget_alert(clean)

    return jsonify({"message": "Created", cfg["pk"]: new_id}), 201


@app.put("/api/<resource>/<int:record_id>")
def update_record(resource, record_id):
    cfg = get_resource(resource)
    if find_one(cfg, record_id) is None:
        return jsonify({"error": "Record not found"}), 404
    clean, errors = cfg["validate"](request.get_json(silent=True) or {})
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 400
    cols = cfg["columns"]
    sql = "UPDATE {t} SET {s} WHERE {pk} = %s".format(
        t=cfg["table"], s=", ".join(c + " = %s" for c in cols), pk=cfg["pk"])
    execute(sql, tuple(clean[c] for c in cols) + (record_id,))
    return jsonify({"message": "Updated", cfg["pk"]: record_id})


@app.delete("/api/<resource>/<int:record_id>")
def delete_record(resource, record_id):
    cfg = get_resource(resource)
    # IDs are AUTO_INCREMENT and are never renumbered after a delete.
    _, affected = execute(
        "DELETE FROM {t} WHERE {pk} = %s".format(t=cfg["table"], pk=cfg["pk"]), (record_id,))
    if affected == 0:
        return jsonify({"error": "Record not found"}), 404
    return jsonify({"message": "Deleted", cfg["pk"]: record_id})


# ---------------- Budgets & goals ----------------

@app.get("/api/budgets/status")
def budgets_status():
    """Limit vs actual spend per category. ?month=YYYY-MM (default: current month)."""
    month = request.args.get("month", "").strip() or date.today().strftime("%Y-%m")
    year, mon = parse_month(month)
    limits = fetch_all(
        "SELECT budget_id, category, monthly_limit, month FROM budgets WHERE month = %s "
        "ORDER BY category", (month,))
    spent = fetch_all(
        "SELECT category, SUM(amount) AS total FROM expenses "
        "WHERE YEAR(date) = %s AND MONTH(date) = %s GROUP BY category", (year, mon))
    return jsonify(budget_status_rows(limits, spent))


@app.get("/api/goals/progress")
def goals_progress():
    goals = fetch_all(
        "SELECT goal_id, name, target_amount, saved_amount, deadline "
        "FROM savings_goals ORDER BY deadline, goal_id")
    return jsonify(goal_progress_rows(serialize(goals)))


# ---------------- Notifications ----------------

@app.put("/api/notifications/<int:record_id>/read")
def mark_notification_read(record_id):
    _, affected = execute(
        "UPDATE notifications SET is_read = 1 WHERE notification_id = %s", (record_id,))
    if affected == 0:
        return jsonify({"error": "Record not found"}), 404
    return jsonify({"message": "Marked as read", "notification_id": record_id})


@app.post("/api/notifications/clear")
def clear_notifications():
    execute("DELETE FROM notifications")
    return jsonify({"message": "All notifications cleared"})


# ---------------- Dashboard & analytics ----------------

@app.get("/api/dashboard")
def dashboard():
    inc = fetch_all("SELECT COALESCE(SUM(amount), 0) AS total, COUNT(*) AS n FROM income")[0]
    exp = fetch_all("SELECT COALESCE(SUM(amount), 0) AS total, COUNT(*) AS n FROM expenses")[0]
    recent = fetch_all(
        "(SELECT 'income' AS type, income_id AS id, amount, source AS label, NULL AS situation, date FROM income) "
        "UNION ALL "
        "(SELECT 'expense' AS type, expense_id AS id, amount, category AS label, situation, date FROM expenses) "
        "ORDER BY date DESC, id DESC LIMIT 8"
    )
    unread = fetch_all("SELECT COUNT(*) AS n FROM notifications WHERE is_read = 0")[0]
    total_income, total_expense = float(inc["total"]), float(exp["total"])
    summary = {
        "total_income": total_income,
        "total_expenses": total_expense,
        "transactions": int(inc["n"]) + int(exp["n"]),
        "unread_notifications": int(unread["n"]),
        "recent": serialize(recent),
    }
    summary.update(financial_status(total_income, total_expense))
    return jsonify(summary)


def group_expenses(column):
    """column is hard-coded by the caller ('category' or 'situation')."""
    params = []
    clause = month_clause(params)
    sql = "SELECT {c} AS name, SUM(amount) AS total, COUNT(*) AS count, ROUND(AVG(amount), 2) AS average FROM expenses".format(c=column)
    if clause:
        sql += " WHERE " + clause
    sql += " GROUP BY {c} ORDER BY total DESC".format(c=column)
    return add_share(serialize(fetch_all(sql, tuple(params))))


@app.get("/api/analytics/category")
def analytics_category():
    return jsonify(group_expenses("category"))


@app.get("/api/analytics/situation")
def analytics_situation():
    return jsonify(group_expenses("situation"))


@app.get("/api/analytics/monthly")
def analytics_monthly():
    monthly_sql = "SELECT YEAR(date) AS yr, MONTH(date) AS mon, SUM(amount) AS total FROM {t} GROUP BY YEAR(date), MONTH(date)"
    income_rows = fetch_all(monthly_sql.format(t="income"))
    expense_rows = fetch_all(monthly_sql.format(t="expenses"))
    return jsonify(merge_monthly(income_rows, expense_rows))


# ---------------- Error handling ----------------

@app.errorhandler(LookupError)
def unknown_resource(_err):
    return jsonify({"error": "Resource not found"}), 404


@app.errorhandler(404)
def not_found(_err):
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(IntegrityError)
def duplicate_record(_err):
    return jsonify({"error": "A record with the same unique key already exists "
                             "(e.g. a budget for the same category and month)."}), 400


@app.errorhandler(ValueError)
def bad_value(err):
    return jsonify({"error": str(err)}), 400


@app.errorhandler(MySQLError)
def database_error(err):
    app.logger.error("Database error: %s", err)
    return jsonify({"error": "Database error. Check the server logs."}), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("FLASK_PORT", "5000")),
        debug=os.getenv("FLASK_DEBUG") == "1",
    )
