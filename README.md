# LibraryOS

A seat and monthly-membership management system for libraries and study centers.
Admins manage seats, shifts, students, memberships, payments, and reporting from
a single operational dashboard.

**Stack:** Django 4.2 + Django REST Framework (API) · React 19 + TypeScript + Vite (SPA)
· SQLite for zero-config local dev, Postgres-ready for production · JWT auth ·
TanStack Query · Tailwind CSS.

---

## Architecture

```
backend/    Django REST API — one app per domain concern
  accounts/          admin authentication (JWT), multi-admin-ready user model
  library_settings/  singleton library configuration (seats, fees, branding)
  seats/             seat inventory + seat map/occupancy service
  shifts/            configurable shifts (up to 4)
  students/          student CRUD, search, derived status/summary service
  memberships/       booking domain service — THE core business logic
  payments/          payment ledger, receipts, fee-status source of truth
  dashboard/         aggregated operational stats endpoint
  reports/           collections/occupancy/expiry/pending-fee reports + CSV export
  audit/             immutable audit log + full JSON backup endpoint
  config/            settings, root urls, DRF exception handling, pagination

frontend/   React SPA
  src/api/        axios client (JWT + auto-refresh), typed endpoint wrappers, types
  src/context/    auth context, toast notifications
  src/components/ reusable UI primitives + booking/payment modals
  src/pages/      one page per module (dashboard, students, seats, payments, reports, settings)
  src/layouts/    sidebar/topbar app shell (responsive, collapses to a drawer on mobile)
```

### Why a service layer

All seat/shift booking logic — conflict checking, renewal, vacating, seat/shift
changes — lives in `memberships/services.py`, not in views or serializers. Every
mutation runs inside `transaction.atomic()` with `select_for_update()` row locks,
so double-booking is prevented **in the database**, not just in the UI:

- A `MembershipShift` row (seat + shift + membership) carries a denormalized
  `is_active` flag.
- A partial **unique constraint** — `UNIQUE(seat, shift) WHERE is_active = true`
  — makes it impossible for two active bookings to occupy the same seat+shift,
  even under concurrent requests.
- Renewing/vacating/moving a membership deactivates the old `MembershipShift`
  rows and creates new ones inside the same transaction, so the constraint is
  never violated and full history is preserved (nothing is ever deleted).

Payment/fee status is computed the same way everywhere (`payments/services.py`)
— dashboard, student list, and reports all call the same `get_membership_payment_summary`
so "pending vs. partial vs. paid" can never drift between screens.

---

## Environment variables

Copy `backend/.env.example` to `backend/.env` and adjust as needed:

| Variable | Purpose | Default |
|---|---|---|
| `SECRET_KEY` | Django secret key | dev placeholder — **change in production** |
| `DEBUG` | Debug mode | `True` |
| `ALLOWED_HOSTS` | Comma-separated allowed hosts | `localhost,127.0.0.1` |
| `DATABASE_URL` | `sqlite:///db.sqlite3` or `postgres://user:pass@host:5432/db` | SQLite file |
| `ACCESS_TOKEN_LIFETIME_MIN` / `REFRESH_TOKEN_LIFETIME_DAYS` | JWT lifetimes | `60` / `7` |
| `CORS_ALLOWED_ORIGINS` / `CSRF_TRUSTED_ORIGINS` | Frontend origin(s) | `http://localhost:5173` |
| `TIME_ZONE` | Django timezone | `UTC` |

The frontend needs no env file for local dev — Vite proxies `/api` to
`http://127.0.0.1:8000` (see `frontend/vite.config.ts`). For a separately-hosted
production frontend, point it at the API by rewriting `src/api/client.ts`'s
`baseURL` or serving both behind the same reverse proxy.

---

## Local setup

### Backend

```bash
cd backend
python -m venv venv
source venv/Scripts/activate      # Windows Git Bash; use venv\Scripts\activate.bat on cmd.exe
pip install -r requirements.txt
cp .env.example .env              # edit SECRET_KEY at minimum

python manage.py migrate
python manage.py seed_demo_data   # creates admin user + 50 seats + 4 shifts + demo students/payments
python manage.py runserver        # http://127.0.0.1:8000
```

The seed command prints the generated admin credentials
(default `admin` / `Admin@12345` unless overridden):

```bash
python manage.py seed_demo_data --seats 100 --admin-username admin --admin-password "SomethingStrong1"
```

Running it again is safe — it skips student/membership/payment seeding if
students already exist, but always ensures the shift/seat configuration matches.

### Frontend

```bash
cd frontend
npm install
npm run dev                       # http://localhost:5173
```

Log in with the admin credentials printed by the seed command.

### Database setup

SQLite works out of the box — no setup needed. For Postgres:

```bash
# .env
DATABASE_URL=postgres://libraryos:libraryos@localhost:5432/libraryos
```

`psycopg2-binary` is already in `requirements.txt`. Create the database and
role, then run `python manage.py migrate` as usual — the schema is
Postgres/SQLite portable (no raw SQL, no engine-specific fields).

### Migrations

```bash
python manage.py makemigrations   # after model changes
python manage.py migrate
```

Migrations are committed to version control under each app's `migrations/`
directory.

---

## Running tests

```bash
cd backend
source venv/Scripts/activate
python manage.py test             # 47 tests: auth, students, seats, shifts,
                                   # membership booking/conflict/renewal/vacate,
                                   # payments, receipts, reports
```

Key business-rule tests live in `memberships/tests.py` —
`test_double_booking_same_seat_same_shift_rejected`,
`test_same_seat_different_shift_is_independently_bookable`,
`test_renewal_preserves_history_and_frees_then_reclaims_slot`, etc.

The frontend has no separate test runner configured; it was verified against
the live backend with a scripted Playwright pass (login → dashboard → students
→ seat map → payments/receipt → reports → settings → mobile viewport), covering
every primary navigation path and a full create-student → assign-seat →
record-payment mutation flow, with zero console errors.

---

## API overview

All endpoints are under `/api/`, JSON in/out, JWT bearer auth except `/auth/login`
and `/auth/refresh`. Paginated list endpoints accept `?page=`, `?search=`,
`?ordering=`, and model-specific filters (e.g. `?status=active`).

```
POST   /api/auth/login                     obtain access+refresh tokens
POST   /api/auth/logout                    blacklist refresh token
POST   /api/auth/refresh                   rotate access token
GET    /api/auth/me                        current admin profile
POST   /api/auth/change-password
GET/POST /api/auth/admins                  manage admin accounts (superadmin only)

GET/PATCH /api/settings/                   library/seat/fee/payment configuration

GET/POST /api/shifts/                      shift config (max 4 active, enforced)
PATCH/DELETE /api/shifts/:id/

GET/POST /api/seats/                       seat inventory
PATCH/DELETE /api/seats/:id/
GET    /api/seats/map/                     full seat×shift occupancy map
GET    /api/seats/:id/occupancy/           single-seat occupancy detail

GET/POST /api/students/                    search via ?search=, filter via ?status=
GET/PATCH/DELETE /api/students/:id/        DELETE is a soft-delete guard
GET    /api/students/:id/memberships/      full membership history
GET    /api/students/:id/payments/         full payment history

GET/POST /api/memberships/                 create = assign seat/shift(s)
GET    /api/memberships/:id/
POST   /api/memberships/:id/renew/         extend, optionally record payment
POST   /api/memberships/:id/change/        move seat and/or shifts
POST   /api/memberships/:id/vacate/        free the seat, keep history

GET/POST /api/payments/                    create + read only — immutable ledger
GET    /api/payments/:id/receipt/          structured receipt data (print via browser)

GET    /api/dashboard/                     aggregated operational stats

GET    /api/reports/collections            ?range=today|week|month|custom
GET    /api/reports/occupancy
GET    /api/reports/students
GET    /api/reports/pending-fees
GET    /api/reports/expiry                 ?days=N
GET    /api/reports/export/{students,memberships,payments,seats}   CSV download

GET    /api/audit/logs/                    administrative action history
GET    /api/audit/backup                   full JSON database export (authenticated)
```

Error responses are always `{"detail": "...", "errors": {...} | null}`. A seat/shift
conflict returns **HTTP 409** with a human-readable message naming the
conflicting student and expiry date.

---

## Security notes

- Passwords are hashed with Django's default PBKDF2 hasher — never stored or logged in plaintext.
- JWT access/refresh tokens; refresh tokens are blacklisted on logout.
- Login is rate-limited (`10/min` per client) to slow down credential-stuffing.
- All business endpoints require authentication (`IsAuthenticated` by default).
- Every admin-visible list/detail endpoint uses server-side filtering/pagination —
  no bulk unauthenticated data exposure.
- The DRF exception handler normalizes all errors and never leaks stack traces
  or internal exception text to the client; unhandled exceptions are logged
  server-side and returned as a generic message.
- Important actions (create/update/delete on students/seats/shifts/memberships/payments,
  settings changes, backups, logins) are written to an append-only `AuditLog` table.
- CORS is restricted to the configured frontend origin(s); no `*` wildcard.
- Secrets live in `.env`, never in source — `.env` is gitignored, `.env.example` is committed.

---

## Production deployment

1. Set `DEBUG=False`, a strong `SECRET_KEY`, real `ALLOWED_HOSTS`, and a Postgres `DATABASE_URL`.
2. `python manage.py collectstatic` — static files are served via WhiteNoise (no separate static host needed).
3. Run migrations: `python manage.py migrate`.
4. Serve with `gunicorn config.wsgi:application` behind Nginx/Caddy (or any WSGI-compatible host).
5. Build the frontend (`npm run build` in `frontend/`) and serve `frontend/dist/` as
   static files from the same reverse proxy, proxying `/api/` and `/media/` to the
   Django process.
6. Set `CORS_ALLOWED_ORIGINS` / `CSRF_TRUSTED_ORIGINS` to the real frontend origin.
7. Point a process manager (systemd, Docker, etc.) at gunicorn; there are no
   background workers or extra services to run — this is intentionally a
   single-process MVP.

## Backup / export

- **CSV exports** (Students, Memberships, Payments, Seats) are available from the
  Settings page or directly at `/api/reports/export/<kind>` — authenticated only.
- **Full database backup**: Settings → "Full JSON backup", or `GET /api/audit/backup`
  (authenticated). This serializes every LibraryOS table (students, seats, shifts,
  memberships, payments, audit logs, admin accounts) to a single JSON file using
  Django's built-in serializer — restorable with `python manage.py loaddata`.
