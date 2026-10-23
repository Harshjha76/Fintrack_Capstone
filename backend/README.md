FinTrack - Student Personal Finance Management System
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
    venv\\Scripts\\activate          (Windows)
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
    curl -X POST http://localhost:5000/api/expenses -H "Content-Type: application/json" -d "{\"amount\": 250, \"category\": \"Food & Dining\", \"situation\": \"Casual\", \"date\": \"2026-09-20\"}"
    curl -X POST http://localhost:5000/api/budgets -H "Content-Type: application/json" -d "{\"category\": \"Food & Dining\", \"monthly_limit\": 2000, \"month\": \"2026-10\"}"
    curl -X PUT http://localhost:5000/api/income/1 -H "Content-Type: application/json" -d "{\"amount\": 9000, \"source\": \"Pocket Money\", \"date\": \"2026-06-01\"}"
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
