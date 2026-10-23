# Export Notes - what runs locally and what cannot

## Fully runnable offline (backend/)
- Complete Flask REST API: income & expense CRUD, monthly budgets with
  usage/over-limit alerts, savings goals with progress, notifications
  (auto-created on transactions and budget crossings), dashboard summary,
  and category/situation/monthly analytics.
- MySQL schema with constraints, indexes, sample data and analysis queries.
- Server-side validation, parameterized SQL (no injection), connection pooling.
- Python dependencies (requirements.txt) and an environment config template.

## Included for reference only (react-frontend/)
This is the real source of the hosted demo app. It depends on hosting-platform
services that have no local equivalent:
  - Google sign-in, accounts and sessions
  - The hosted database - every read/write goes through the platform SDK
  - Private file storage for receipt photos
  - AI-generated spending insights (LLM)
  - Hosting, publishing and mobile app builds
"npm install && npm run dev" will start it, but sign-in and all data calls will
fail outside the platform. It is included so the frontend can be shown in your
report and viva; the runnable submission is backend/ (per the FlutterFlow ->
Flask -> MySQL architecture in backend/README.md).

## Not part of this export
- Receipt photo upload and AI insights have no local equivalent in the Flask kit.
  (To add: local file uploads, and an AI API key of your own.)
- Per-user data isolation: the local database holds a single user's records.
  To add accounts, create a users table and a user_id foreign key on each table.
- The FlutterFlow app itself is built inside FlutterFlow - connect it to this API
  using backend/README.md section 6.
