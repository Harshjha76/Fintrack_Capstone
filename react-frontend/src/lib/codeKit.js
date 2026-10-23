// Source files for the FinTrack Flask + MySQL code kit (shown on the Architecture & Code page).

const README = `FinTrack - Student Personal Finance Management System
====================================================
B.Tech Capstone | FlutterFlow -> Python/Flask -> MySQL (Fin_Track)

ARCHITECTURE
  FlutterFlow Frontend          (screens, forms, charts)
          |  HTTP / JSON
  Python / Flask Backend        (app.py, validators.py)
          |  parameterized SQL
  MySQL / DBMS                  (schema.sql -> Fin_Track)
          |
  Data Processing & DS          (processing.py - lists, dicts)
          |
  Financial Analysis            (SUM, GROUP BY, balance, savings rate)
          |
  Charts / Dashboard            (FlutterFlow chart widgets)

FEATURES
  - Income CRUD          (pocket money, scholarship, stipend, freelance, ...)
  - Expense CRUD         (category + situational tagging: Necessary, Casual, Emergency, ...)
  - Monthly budgets      (per-category limit + live usage / over-limit alerts)
  - Savings goals        (target, saved amount, deadline, progress %)
  - Notifications       (auto-created on transactions and budget crossings)
  - Dashboard            (totals, balance, savings rate, health status, recent 8)
  - Analytics            (category-wise, situation-wise, month-by-month)

FILES
  schema.sql         Database, tables, constraints, sample data, analysis queries
  db.py              MySQL connection pool (credentials from .env)
  validators.py      Input validation (amount, date, category, situation, budget, goal)
  processing.py      Data structures & algorithms (linear search, grouping, merge)
  app.py             Flask REST API (CRUD + budgets + goals + notifications + analytics)
  requirements.txt   Python dependencies
  .env.example       Environment configuration template

1. REQUIREMENTS
  - Python 3.10+
  - MySQL Server 8.0.16+ (needed for CHECK constraints)

2. DATABASE SETUP
    mysql -u root -p < schema.sql

  Create a dedicated user (do not use root in the app):
    mysql -u root -p
    CREATE USER 'fintrack_user'@'localhost' IDENTIFIED BY 'choose_a_strong_password';
    GRANT SELECT, INSERT, UPDATE, DELETE ON Fin_Track.* TO 'fintrack_user'@'localhost';
    FLUSH PRIVILEGES;

3. BACKEND SETUP
    python -m venv venv
    venv\\\\Scripts\\\\activate          (Windows)
    source venv/bin/activate        (macOS / Linux)
    pip install -r requirements.txt
    copy .env.example .env          (Windows)  |  cp .env.example .env
    -> edit .env with your MySQL password
    python app.py

  API now runs at http://localhost:5000

4. QUICK TEST
    curl http://localhost:5000/api/health
    curl http://localhost:5000/api/dashboard
    curl "http://localhost:5000/api/expenses?situation=Necessary&sort=amount_desc"
    curl http://localhost:5000/api/budgets/status
    curl http://localhost:5000/api/goals/progress
    curl -X POST http://localhost:5000/api/expenses -H "Content-Type: application/json" -d "{\\"amount\\": 250, \\"category\\": \\"Food & Dining\\", \\"situation\\": \\"Casual\\", \\"date\\": \\"2026-09-20\\"}"
    curl -X POST http://localhost:5000/api/budgets -H "Content-Type: application/json" -d "{\\"category\\": \\"Food & Dining\\", \\"monthly_limit\\": 2000, \\"month\\": \\"2026-10\\"}"
    curl -X PUT http://localhost:5000/api/income/1 -H "Content-Type: application/json" -d "{\\"amount\\": 9000, \\"source\\": \\"Pocket Money\\", \\"date\\": \\"2026-06-01\\"}"
    curl -X DELETE http://localhost:5000/api/expenses/3

5. API REFERENCE
  Method  Endpoint                         Purpose
  GET     /api/health                      Check DB connection
  GET     /api/dashboard                   Totals, balance, status, recent 8
  GET     /api/income                      List (?search= &source= &month=YYYY-MM &sort=)
  GET     /api/income/<id>                 Single record
  POST    /api/income                      Create  {amount, source, date}
  PUT     /api/income/<id>                 Update
  DELETE  /api/income/<id>                 Delete
  GET     /api/expenses                    List (?search= &category= &situation= &month= &sort=)
  GET     /api/expenses/<id>               Single record
  POST    /api/expenses                    Create  {amount, category, situation, date}
  PUT     /api/expenses/<id>               Update
  DELETE  /api/expenses/<id>               Delete
  GET     /api/budgets                     List (?category= &month=YYYY-MM)
  POST    /api/budgets                     Create  {category, monthly_limit, month: "YYYY-MM"}
  PUT     /api/budgets/<id>                Update
  DELETE  /api/budgets/<id>                Delete
  GET     /api/budgets/status              Usage vs limit per category (?month=, default: current)
  GET     /api/goals                      List savings goals (?search= &sort=)
  POST    /api/goals                       Create  {name, target_amount, saved_amount?, deadline?}
  PUT     /api/goals/<id>                  Update
  DELETE  /api/goals/<id>                  Delete
  GET     /api/goals/progress              Each goal + progress %, remaining, status
  GET     /api/notifications               List (?type= &unread=1)
  POST    /api/notifications               Create  {title, message, type}
  PUT     /api/notifications/<id>/read    Mark one as read
  POST    /api/notifications/clear         Delete all notifications
  GET     /api/analytics/category          Category-wise totals (?month=)
  GET     /api/analytics/situation         Situation-wise totals (?month=)
  GET     /api/analytics/monthly           Month-by-month income, expense, balance

  sort values: newest | oldest | amount_desc | amount_asc
  Validation errors return 400 with {"error": ..., "fields": {...}}

  Auto-notifications: creating an income/expense writes a "transaction"
  notification; an expense that crosses its category budget for the month
  writes a "budget" alert.

6. CONNECTING FLUTTERFLOW
  a. FlutterFlow cannot reach "localhost". Expose the API with a tunnel
     (e.g. ngrok http 5000) or deploy it (Render, Railway, PythonAnywhere).
  b. In FlutterFlow: API Calls -> Add API Group "FinTrackAPI",
     Base URL = your public URL + /api
  c. Add calls: GetDashboard (GET /dashboard), ListIncome (GET /income),
     CreateIncome (POST /income, JSON body), UpdateIncome (PUT /income/[id]),
     DeleteIncome (DELETE /income/[id]) and the same for /expenses,
     plus GetBudgetStatus, GetGoalProgress, GetNotifications and the
     GetCategory / GetSituation / GetMonthly analytics.
  d. Bind JSON paths, e.g. $.total_income, $.balance, $.records, $.recent
  e. Charts: Pie chart <- /analytics/situation ($[:].name, $[:].total),
     Bar chart <- /analytics/category, Line chart <- /analytics/monthly.
  f. After Create/Update/Delete actions, refresh the page's API query.

7. DEPLOYMENT (optional)
   - Database: any hosted MySQL 8 (e.g. Railway, Aiven, PlanetScale-compatible)
   - Backend:  pip install gunicorn  ->  gunicorn app:app --bind 0.0.0.0:$PORT
   - Set DB_HOST / DB_USER / DB_PASSWORD / DB_NAME as environment variables.

8. WHAT IS NOT IN THIS KIT (lives only in the hosted demo)
   - Google sign-in and user accounts (the platform's auth service)
   - Receipt photo upload and private file storage
   - AI-generated spending insights
   - Per-user data isolation (here the database has a single user's records;
     to add accounts, add a users table and a user_id foreign key to each)

9. VIVA NOTES
  - IDs are AUTO_INCREMENT and never renumbered after deletes (keeps
    primary keys stable and referentially safe).
  - All values go through %s placeholders, so SQL injection is prevented.
  - Table/column names come only from a fixed whitelist in app.py.
  - SQL handles storage and heavy aggregation; Python lists/dicts handle
    in-memory processing: linear search, filtering, merging months.
  - Health status: Stable if savings rate >= 20%, Watch if 0-20%,
    Warning if expenses exceed income.
`;

const SCHEMA = `-- FinTrack database schema
-- Run: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS Fin_Track
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Fin_Track;

-- ---------- Tables ----------
CREATE TABLE IF NOT EXISTS income (
  income_id  INT AUTO_INCREMENT PRIMARY KEY,
  amount     DECIMAL(12,2) NOT NULL,
  source     VARCHAR(50)   NOT NULL,
  date       DATE          NOT NULL,
  CONSTRAINT chk_income_amount CHECK (amount > 0),
  INDEX idx_income_date (date)
);

CREATE TABLE IF NOT EXISTS expenses (
  expense_id INT AUTO_INCREMENT PRIMARY KEY,
  amount     DECIMAL(12,2) NOT NULL,
  category   VARCHAR(50)   NOT NULL,
  situation  ENUM('Necessary','Casual','Emergency','Entertainment','Time Pass','Other') NOT NULL,
  date       DATE          NOT NULL,
  CONSTRAINT chk_expense_amount CHECK (amount > 0),
  INDEX idx_expense_date (date),
  INDEX idx_expense_situation (situation)
);

CREATE TABLE IF NOT EXISTS budgets (
  budget_id     INT AUTO_INCREMENT PRIMARY KEY,
  category      VARCHAR(50)   NOT NULL,
  monthly_limit DECIMAL(12,2) NOT NULL,
  month         CHAR(7)       NOT NULL,              -- 'YYYY-MM'
  CONSTRAINT chk_budget_limit CHECK (monthly_limit > 0),
  UNIQUE KEY uq_budget_category_month (category, month)
);

CREATE TABLE IF NOT EXISTS savings_goals (
  goal_id       INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL,
  saved_amount  DECIMAL(12,2) NOT NULL DEFAULT 0,
  deadline      DATE          NULL,
  CONSTRAINT chk_goal_target CHECK (target_amount > 0),
  CONSTRAINT chk_goal_saved  CHECK (saved_amount >= 0)
);

CREATE TABLE IF NOT EXISTS notifications (
  notification_id INT AUTO_INCREMENT PRIMARY KEY,
  title           VARCHAR(120) NOT NULL,
  message         VARCHAR(500) NOT NULL,
  type            ENUM('transaction','budget','info') NOT NULL DEFAULT 'info',
  is_read         TINYINT(1)   NOT NULL DEFAULT 0,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notification_read (is_read)
);

-- ---------- Sample data ----------
INSERT INTO income (amount, source, date) VALUES
  (8000.00,  'Pocket Money',       '2026-06-01'),
  (5000.00,  'Scholarship',        '2026-06-10'),
  (8000.00,  'Pocket Money',       '2026-07-01'),
  (3500.00,  'Part-time Job',      '2026-07-18'),
  (8000.00,  'Pocket Money',       '2026-08-01'),
  (12000.00, 'Internship Stipend', '2026-08-25'),
  (8000.00,  'Pocket Money',       '2026-09-01'),
  (2500.00,  'Freelance',          '2026-09-14');

INSERT INTO expenses (amount, category, situation, date) VALUES
  (4500.00, 'Rent & Hostel',     'Necessary',     '2026-06-02'),
  (1850.00, 'Food & Dining',     'Necessary',     '2026-06-05'),
  (650.00,  'Books & Supplies',  'Necessary',     '2026-06-08'),
  (399.00,  'Mobile & Internet', 'Necessary',     '2026-06-09'),
  (480.00,  'Entertainment',     'Entertainment', '2026-06-14'),
  (320.00,  'Food & Dining',     'Time Pass',     '2026-06-20'),
  (900.00,  'Shopping',          'Casual',        '2026-06-24'),
  (4500.00, 'Rent & Hostel',     'Necessary',     '2026-07-02'),
  (2100.00, 'Food & Dining',     'Necessary',     '2026-07-06'),
  (399.00,  'Mobile & Internet', 'Necessary',     '2026-07-09'),
  (1200.00, 'Health',            'Emergency',     '2026-07-11'),
  (750.00,  'Entertainment',     'Entertainment', '2026-07-19'),
  (260.00,  'Transport',         'Casual',        '2026-07-22'),
  (450.00,  'Food & Dining',     'Time Pass',     '2026-07-27'),
  (4500.00, 'Rent & Hostel',     'Necessary',     '2026-08-02'),
  (1950.00, 'Food & Dining',     'Necessary',     '2026-08-05'),
  (399.00,  'Mobile & Internet', 'Necessary',     '2026-08-09'),
  (2800.00, 'Tuition & Fees',    'Necessary',     '2026-08-12'),
  (1500.00, 'Shopping',          'Casual',        '2026-08-17'),
  (600.00,  'Entertainment',     'Entertainment', '2026-08-23'),
  (380.00,  'Transport',         'Necessary',     '2026-08-28'),
  (4500.00, 'Rent & Hostel',     'Necessary',     '2026-09-02'),
  (1700.00, 'Food & Dining',     'Necessary',     '2026-09-04'),
  (399.00,  'Mobile & Internet', 'Necessary',     '2026-09-09'),
  (850.00,  'Transport',         'Emergency',     '2026-09-12'),
  (540.00,  'Entertainment',     'Entertainment', '2026-09-16'),
  (290.00,  'Food & Dining',     'Time Pass',     '2026-09-19'),
  (700.00,  'Books & Supplies',  'Necessary',     '2026-09-21'),
  (200.00,  'Other',             'Other',         '2026-09-23');

INSERT INTO budgets (category, monthly_limit, month) VALUES
  ('Food & Dining',     2500.00, '2026-06'),
  ('Rent & Hostel',     5000.00, '2026-06'),
  ('Mobile & Internet',  500.00, '2026-06'),
  ('Food & Dining',     2500.00, '2026-07'),
  ('Rent & Hostel',     5000.00, '2026-07'),
  ('Food & Dining',     2500.00, '2026-08'),
  ('Rent & Hostel',     5000.00, '2026-08'),
  ('Food & Dining',     2500.00, '2026-09');

INSERT INTO savings_goals (name, target_amount, saved_amount, deadline) VALUES
  ('New Laptop',      55000.00, 32000.00, '2026-12-31'),
  ('Emergency Fund',  20000.00, 20000.00, '2026-10-31'),
  ('Trip Fund',       15000.00,  4500.00, '2027-03-15');

INSERT INTO notifications (title, message, type) VALUES
  ('Welcome to FinTrack', 'Add your income and expenses to see analytics.', 'info'),
  ('Budget set', 'Food & Dining budget for the month is Rs. 2500.00.', 'budget');

-- ---------- Analysis queries (for viva / testing) ----------
-- Totals and balance
SELECT
  (SELECT COALESCE(SUM(amount),0) FROM income)   AS total_income,
  (SELECT COALESCE(SUM(amount),0) FROM expenses) AS total_expenses,
  (SELECT COALESCE(SUM(amount),0) FROM income) -
  (SELECT COALESCE(SUM(amount),0) FROM expenses) AS balance;

-- Category-wise
SELECT category, SUM(amount) AS total, COUNT(*) AS entries
FROM expenses GROUP BY category ORDER BY total DESC;

-- Situation-wise
SELECT situation, COUNT(*) AS entries, SUM(amount) AS total, ROUND(AVG(amount),2) AS average
FROM expenses GROUP BY situation ORDER BY total DESC;

-- Monthly
SELECT YEAR(date) AS yr, MONTH(date) AS mon, SUM(amount) AS total
FROM expenses GROUP BY YEAR(date), MONTH(date) ORDER BY yr, mon;

-- Budget vs actual for one month
SELECT b.category, b.monthly_limit AS limit_amount,
       COALESCE(e.spent, 0) AS spent,
       b.monthly_limit - COALESCE(e.spent, 0) AS remaining
FROM budgets b
LEFT JOIN (
  SELECT category, SUM(amount) AS spent
  FROM expenses WHERE YEAR(date) = 2026 AND MONTH(date) = 9
  GROUP BY category
) e ON e.category = b.category
WHERE b.month = '2026-09';

-- Savings goal progress
SELECT name, saved_amount, target_amount,
       ROUND(saved_amount / target_amount * 100, 1) AS progress_percent
FROM savings_goals ORDER BY deadline;
`;

const DB_PY = `"""
db.py - MySQL connection layer for FinTrack.
Credentials are read from environment variables (.env), never hard-coded.
"""
import os

from dotenv import load_dotenv
from mysql.connector import pooling

load_dotenv()

pool = pooling.MySQLConnectionPool(
    pool_name="fintrack_pool",
    pool_size=5,
    host=os.getenv("DB_HOST", "localhost"),
    port=int(os.getenv("DB_PORT", "3306")),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME", "Fin_Track"),
)


def fetch_all(sql, params=()):
    """Run a SELECT with %s placeholders and return a list of dict rows."""
    conn = pool.get_connection()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute(sql, params)
        rows = cur.fetchall()
        cur.close()
        return rows
    finally:
        conn.close()


def execute(sql, params=()):
    """Run INSERT / UPDATE / DELETE. Returns (last_insert_id, affected_rows)."""
    conn = pool.get_connection()
    try:
        cur = conn.cursor()
        cur.execute(sql, params)
        conn.commit()
        result = (cur.lastrowid, cur.rowcount)
        cur.close()
        return result
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
`;

const VALIDATORS_PY = `"""
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
`;

const PROCESSING_PY = `"""
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
`;

const APP_PY = `"""
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
`;

const REQUIREMENTS = `Flask==3.0.3
flask-cors==4.0.1
mysql-connector-python==9.0.0
python-dotenv==1.0.1
`;

const ENV_EXAMPLE = `# Copy to .env and fill in real values. Never commit .env.
DB_HOST=localhost
DB_PORT=3306
DB_USER=fintrack_user
DB_PASSWORD=change_me
DB_NAME=Fin_Track
FLASK_PORT=5000
FLASK_DEBUG=1
`;

export const CODE_FILES = [
  { name: 'README.md', desc: 'Setup, run, full API reference, FlutterFlow & deployment guide', content: README },
  { name: 'schema.sql', desc: 'Database, tables, constraints, sample data and analysis queries', content: SCHEMA },
  { name: 'app.py', desc: 'Flask REST API: CRUD, budgets, goals, notifications, dashboard, analytics', content: APP_PY },
  { name: 'db.py', desc: 'MySQL connection pool using environment variables', content: DB_PY },
  { name: 'validators.py', desc: 'Server-side validation for all records', content: VALIDATORS_PY },
  { name: 'processing.py', desc: 'Data structures & algorithms: search, grouping, merging, progress', content: PROCESSING_PY },
  { name: 'requirements.txt', desc: 'Python dependencies', content: REQUIREMENTS },
  { name: '.env.example', desc: 'Environment configuration template', content: ENV_EXAMPLE },
];