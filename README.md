# Fiesta Gastro Cafe

Multi-language website (RO/EN/RU) for a cafe — Django backend, PostgreSQL.

## Tech Stack

Django 6.0 / DRF / PostgreSQL / django-tinymce / django-admin-sortable2 / django-polymorphic / drf-spectacular / django-modeltranslation

## Setup (from a fresh clone)

Prerequisites: Python 3.12+, PostgreSQL running, [uv](https://docs.astral.sh/uv/#installation).

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
EOF

# 3. Install dependencies
uv sync

# 4. Apply migrations
uv run python manage.py migrate

# 5. Create admin and start
uv run python manage.py createsuperuser
uv run python manage.py runserver
```

## Project Structure

```
src/backend/
├── cafe_project/   # settings, urls, middleware, OpenAPI schema
├── menu/           # categories, products, translations
├── core/           # pages, sections, settings, translations
├── logs/           # rotating log files (auto-created)
└── manage.py
```

## Useful Commands

| Command | Purpose |
|---------|---------|
| `uv run python manage.py migrate` | Apply migrations |
| `uv run python manage.py makemigrations` | Generate migrations |
| `uv run python manage.py createsuperuser` | Admin account |
| `uv run python manage.py runserver` | Dev server |
| `uv run python manage.py check` | Verify project consistency |
| `uv run python manage.py test` | Run all tests (10 passing) |
| `uv run python manage.py collectstatic` | Static files (collect for production) |
| `uv run python manage.py update_translation_fields` | Sync translation fields after model changes |

See `docs/` for detailed docs.
