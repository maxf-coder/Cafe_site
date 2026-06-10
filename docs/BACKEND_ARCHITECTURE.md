# Backend Architecture

## Project Structure

```
src/backend/
├── .env                      # Environment variables (not committed)
├── manage.py                 # Django CLI entry point
├── pyproject.toml            # Python dependencies
├── cafe_project/             # Django project configuration
│   ├── __init__.py
│   ├── settings.py           # Main settings file
│   ├── urls.py               # Root URL configuration
│   ├── asgi.py               # ASGI config (async)
│   └── wsgi.py               # WSGI config (sync)
├── menu/                     # Menu app
│   ├── __init__.py
│   ├── admin.py              # Django admin registration
│   ├── apps.py               # App configuration
│   ├── models.py             # MenuCategory, MenuProduct
│   ├── migrations/           # Database migrations
│   │   └── 0001_initial.py
│   └── views.py              # Stub (API not yet built)
├── core/                     # Core app (global functionality)
│   ├── __init__.py
│   ├── admin.py              # Django admin registration
│   ├── apps.py               # App configuration
│   ├── models.py             # Page, PageHero, PageSection + 4 child section models
│   ├── migrations/           # Database migrations
│   │   ├── 0001_initial.py   # Old schema (section_type + JSONB)
│   │   └── 0002_*.py         # Broken (references uninstalled ckeditor)
│   └── views.py              # Stub (API not yet built)
└── static/                   # Collected static files (gitignored)
```

---

## Apps

### `menu` App

**Responsibility:** Menu categories and products.

| File | Purpose |
|------|---------|
| `models.py` | `MenuCategory`, `MenuProduct` models |
| `admin.py` | Admin interface with `SortableAdminMixin` |
| `views.py` | Stub (API not yet built) |

### `core` App

**Responsibility:** Site-wide content, pages, settings.

| File | Purpose |
|------|---------|
| `models.py` | `SiteSettings`, `Page`, `PageHero`, `PageSection` (base), `WideImageSection`, `VideoSection`, `TightImageSection` (+ `TightImageCard`), `ReelsSection` (+ `ReelItem`) |
| `admin.py` | Admin interface for all models with `SortableAdminMixin` and `SortableTabularInline` |
| `views.py` | Stub (API not yet built) |

---

## Settings Breakdown

### Installed Apps

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'django_summernote',
    'menu',
    'core',
    'adminsortable2',
]
```

**Notes:**
- `django_summernote` — WYSIWYG editor for rich text fields (MIT license)
- `adminsortable2` — Drag-and-drop reordering in admin
- `corsheaders` — Must be placed early in MIDDLEWARE

### Middleware Chain

```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',    # Security headers
    'corsheaders.middleware.CorsMiddleware',            # CORS handling (must be early)
    'django.contrib.sessions.middleware.SessionMiddleware',  # Session support
    'django.middleware.common.CommonMiddleware',        # Common utilities
    'django.middleware.csrf.CsrfViewMiddleware',        # CSRF protection
    'django.contrib.auth.middleware.AuthenticationMiddleware',  # User auth
    'django.contrib.messages.middleware.MessageMiddleware',     # Flash messages
    'django.middleware.clickjacking.XFrameOptionsMiddleware',   # Clickjacking protection
]
```

**Why CORS middleware is early:** It must intercept requests before other middleware processes them, so it can add CORS headers to preflight (OPTIONS) responses.

---

## Environment Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `SECRET_KEY` | String | — | Django cryptographic key |
| `DEBUG` | Boolean | `False` | Debug mode (True for development) |
| `DATABASE_NAME` | String | — | PostgreSQL database name |
| `DATABASE_USER` | String | — | PostgreSQL username |
| `DATABASE_PASSWORD` | String | — | PostgreSQL password |
| `DATABASE_HOST` | String | `localhost` | PostgreSQL host |
| `DATABASE_PORT` | String | `5432` | PostgreSQL port |
| `ALLOWED_HOSTS` | String | `localhost,127.0.0.1` | Comma-separated allowed domains |
| `CORS_ALLOWED_ORIGINS` | String | `http://localhost:5173` | Comma-separated allowed frontend origins |

---

## URL Routing

```
Root (cafe_project/urls.py)
├── /admin/             → Django admin panel
├── /summernote/        → Summernote editor uploads
```

**API routes not yet implemented.** Planned structure:

```
/api/menu/categories/   → (not built)
/api/menu/products/     → (not built)
/api/pages/<slug>/      → (not built)
/api/settings/          → (not built)
```

---

## Authentication

**Public API:** Not yet implemented. All planned endpoints are read-only, no authentication.

**Admin Panel:** Django's built-in authentication. Single admin user for content management.

---

## Media Handling

### Development
- Images stored in `media/` directory
- Served via Django's static file handler (DEBUG=True)

### Production (Planned)
- Images uploaded to Cloudinary
- `django-cloudinary-storage` handles automatic upload
- Database stores Cloudinary URLs

---

## DRF Configuration

No custom DRF config in `settings.py` yet. To be added when API layer is built.
