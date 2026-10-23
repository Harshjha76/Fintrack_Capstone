# FinTrack - Complete Project Export
Student Personal Finance Management System (B.Tech Capstone)

## What's inside

    backend/           Flask + MySQL application - FULLY RUNNABLE LOCALLY (this is the
                       submission code: schema.sql, app.py, db.py, validators.py,
                       processing.py, requirements.txt, environment template, README.md)
    react-frontend/    Source code of the hosted demo app (React + Tailwind).
                       Included for reference / report & viva - see EXPORT_NOTES.md
                       for why it cannot run outside the hosting platform.
    EXPORT_NOTES.md    Exactly what is and is not runnable offline

## Quick start (backend)

    1. mysql -u root -p < backend/schema.sql
    2. cd backend
    3. python -m venv venv  (then activate it)
    4. pip install -r requirements.txt
    5. Copy the environment template to your config file and put your MySQL
       password in it (see the template included in backend/)
    6. python app.py         -> API at http://localhost:5000

    Verify:  curl http://localhost:5000/api/health

Full setup, API reference, FlutterFlow connection and deployment guide:
backend/README.md
