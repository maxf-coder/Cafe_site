# Fiesta Gastro Cafe

Multi-language website (RO/EN/RU) for a cafe — Django REST backend + React frontend, PostgreSQL.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Django 6.0 + DRF + Whitenoise + Gunicorn + django-modeltranslation + django-polymorphic + django-cleanup + django-admin-sortable2 + django-tinymce |
| **Frontend** | React 19 + Vite + TypeScript + Tailwind v4 + TanStack Query + React Router + framer-motion + lucide-react |
| **Database** | PostgreSQL |
| **Hosting** | Docker Compose → Render, Cloudflare R2 for media |

## Docker Compose Setup (recommended)

Prerequisites: [Docker](https://docs.docker.com/engine/install/) + [Docker Compose](https://docs.docker.com/compose/install/).

```bash
# 1. Clone and enter the project
git clone <repo-url> Cafe_site
cd Cafe_site

# 2. Create root .env (PostgreSQL credentials for Docker Compose)
cat > .env << 'EOF'
POSTGRES_DB=cafe_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
EOF

# 3. Create backend .env (secrets, API keys)
cat > src/backend/.env << 'EOF'
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
GUNICORN_WORKERS=3
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=cafe-media
R2_ENDPOINT_URL=
EOF

# 4. Build and start all services
docker compose build
docker compose up -d

# 5. Import data
docker compose cp cafe_data.json backend:/app/
docker compose exec backend python manage.py loaddata cafe_data.json

# 6. Create admin user
docker compose exec backend python manage.py createsuperuser
```

The site is now available at http://localhost.

## Manual Setup (without Docker)

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
GUNICORN_WORKERS=3
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=cafe-media
R2_ENDPOINT_URL=
EOF

# 3. Install dependencies
uv sync --group dev

# 4. Apply migrations
uv run python manage.py migrate

# 5. Import data
uv run python manage.py loaddata cafe_data.json

# 6. Create admin user
uv run python manage.py createsuperuser

# 7. Run the backend
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
Cafe_site/
├── docker-compose.yml          # 3 services: db, backend, frontend
├── docs/                       # Project documentation
└── src/
    ├── backend/
    │   ├── .dockerignore
    │   ├── Dockerfile           # Multi-stage, uv-based, non-root user
    │   ├── entrypoint.sh        # Migrations → Gunicorn
    │   ├── cafe_project/        # settings, urls, middleware, OpenAPI schema
    │   ├── menu/                # Categories, products, translations
    │   ├── core/                # Pages, sections, settings, site images, translations
    │   ├── logs/                # Rotating log files (auto-created)
    │   └── manage.py
    └── frontend/
        ├── .dockerignore
        ├── Dockerfile           # Multi-stage, nginx:1.27-alpine
        ├── nginx.conf           # Proxies /api/, /cafe-admin/, /static/ → backend
        └── src/
            ├── api/             # Axios client + endpoint functions
            ├── components/      # layout/, menu/, content/, shared/
            ├── i18n/            # Translation context + RO/EN/RU dicts
            ├── pages/           # Menu.tsx, ContentPage.tsx
            ├── types/           # TypeScript interfaces
            └── utils/           # Helpers (YouTube ID extraction, etc.)
```

## Useful Commands

### Docker Compose

| Command | Purpose |
|---------|---------|
| `docker compose build` | Build all images |
| `docker compose up -d` | Start all services in background |
| `docker compose logs -f` | Follow all logs |
| `docker compose exec backend python manage.py ...` | Run Django commands |
| `docker compose down` | Stop all services |
| `docker compose down -v` | Stop + remove pgdata volume |

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
| `uv run python manage.py loaddata cafe_data.json` | Import seed data from JSON fixture |

### Frontend

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (port 5173) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npx tsc --noEmit` | Type check |

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
