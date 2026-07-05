# Fiesta Gastro Cafe

Multi-language website (RO/EN/RU) for a cafe — Django REST backend + React frontend, PostgreSQL.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Django 6.0.5 + DRF + drf-spectacular + django-modeltranslation + django-polymorphic + django-cleanup + django-admin-sortable2 + django-tinymce |
| **Frontend** | React 19 + Vite + TypeScript + Tailwind v4 + TanStack Query + React Router + framer-motion + lucide-react |
| **Database** | PostgreSQL |
| **Hosting** | Render (planned), Cloudflare R2 for media |

## Setup (from a fresh clone)

Prerequisites: Python 3.12+, Node.js 20+, PostgreSQL running, [uv](https://docs.astral.sh/uv/#installation).

### Backend

```bash
# 1. Create the database
createdb cafe_db

# 2. Enter backend and configure
cd src/backend
cat > .env << 'EOF'
SECRET_KEY="generate-a-random-string"
DATABASE_NAME=cafe_db
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
CSRF_TRUSTED_ORIGINS=http://127.0.0.1:8000
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=cafe-media
R2_ENDPOINT_URL=
R2_CUSTOM_DOMAIN=
EOF

> Get `R2_*` credentials from Cloudflare Dashboard → R2 → Bucket → Manage.
> Leave `R2_CUSTOM_DOMAIN` empty in dev (signed URLs only).

# 3. Install dependencies
uv sync

# 4. Apply migrations
uv run python manage.py migrate

# 5. Create admin user
uv run python manage.py createsuperuser

# 6. Run the backend
uv run python manage.py runserver
```

### Frontend

```bash
# 1. Enter frontend directory
cd src/frontend

# 2. Install dependencies
npm install

# 3. Run the dev server
npm run dev
```

## Post-Setup

Before the frontend works fully, you need to create records in the admin panel:

| What | Why | Expected keys/slugs |
|------|-----|---------------------|
| **Site Settings** | Navbar phone, Footer contact/schedule/socials | `phone`, `email`, `address`, `mission`, `working_days`, `weekend_days`, `instagram_link`, `facebook_link`, `footer_copyright` |
| **Site Image** | Logo in navbar/footer + favicon | key: `logo` |
| **Page** `/meniu/` | Home page hero + sections | slug: `meniu` |
| **Page** `/despre-noi/` | About page | slug: `despre-noi` |
| **Page** `/evenimente-out-door/` | Events page | slug: `evenimente-out-door` |
| **Page** `/caritate/` | Charity page | slug: `caritate` |

See `docs/ADMIN_GUIDE.md` for step-by-step instructions.

## Project Structure

```
src/
├── backend/
│   ├── cafe_project/    # settings, urls, middleware, OpenAPI schema
│   ├── menu/            # categories, products, translations
│   ├── core/            # pages, sections, settings, site images, translations
│   ├── logs/            # rotating log files (auto-created)
│   └── manage.py
└── frontend/
    ├── src/
    │   ├── api/         # Axios client + endpoint functions
    │   ├── components/  # layout/, menu/, content/, shared/
    │   ├── i18n/        # Translation context + RO/EN/RU dicts
    │   ├── pages/       # Menu.tsx, ContentPage.tsx
    │   ├── types/       # TypeScript interfaces
    │   └── utils/       # Helpers (YouTube ID extraction, etc.)
    ├── vite.config.ts
    └── package.json
```

## Useful Commands

### Backend

| Command | Purpose |
|---------|---------|
| `uv run python manage.py migrate` | Apply migrations |
| `uv run python manage.py makemigrations` | Generate migrations |
| `uv run python manage.py createsuperuser` | Admin account |
| `uv run python manage.py runserver` | Dev server |
| `uv run python manage.py check` | Verify project consistency |
| `uv run python manage.py test` | Run all tests (10 passing) |
| `uv run python manage.py collectstatic` | Static files for production |
| `uv run python manage.py update_translation_fields` | Sync translation fields after model changes |
| `uv run python manage.py import_menu_data` | Seed menu from hardcoded data |

### Frontend

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (port 5173) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npx tsc --noEmit` | Type check |
| `npx vite optimize` | Pre-bundle dependencies |

## API Endpoints

All read-only, `?lang=ro|en|ru` query param on every request.

| Endpoint | Returns |
|----------|---------|
| `GET /api/v1/menu/categories/` | Categories with nested products |
| `GET /api/v1/pages/{slug}/` | Published page with hero + typed sections |
| `GET /api/v1/settings/` | Flat key-value object |
| `GET /api/v1/site-images/` | Flat key-image object (absolute URLs) |
| `GET /api/v1/schema/` | OpenAPI schema (DEBUG only) |
| `GET /api/v1/docs/` | Swagger UI (DEBUG only) |
| `GET /api/v1/health/` | Health check (DB connection + JSON status) |

See `docs/` for detailed documentation.
