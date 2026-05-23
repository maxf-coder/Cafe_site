# Backend Architecture

## Project Structure

```
src/backend/
├── .env                      # Environment variables (not committed)
├── .env.example              # Template for environment variables
├── manage.py                 # Django CLI entry point
├── pyproject.toml            # Python dependencies
├── uv.lock                   # Dependency lock file
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
│   ├── serializers.py        # DRF serializers
│   ├── urls.py               # Menu app URLs
│   └── views.py              # API view classes
└── core/                     # Core app (global functionality)
    ├── __init__.py
    ├── admin.py              # Django admin registration
    ├── apps.py               # App configuration
    ├── models.py             # Page, PageHero, PageSection, SiteSettings
    ├── serializers.py        # DRF serializers
    ├── urls.py               # Core app URLs
    └── views.py              # API view classes
```

---

## Apps

### `menu` App

**Responsibility:** Menu categories and products.

| File | Purpose |
|------|---------|
| `models.py` | `MenuCategory`, `MenuProduct` models |
| `serializers.py` | JSON serialization for menu data |
| `views.py` | API endpoints for categories and products |
| `urls.py` | `/api/menu/categories/`, `/api/menu/products/` |
| `admin.py` | Admin interface for menu management |

### `core` App

**Responsibility:** Site-wide content, pages, settings.

| File | Purpose |
|------|---------|
| `models.py` | `Page`, `PageHero`, `PageSection`, `SiteSettings` models |
| `serializers.py` | JSON serialization for page and settings data |
| `views.py` | API endpoints for pages and settings |
| `urls.py` | `/api/pages/{slug}/`, `/api/settings/` |
| `admin.py` | Admin interface for content management |

---

## Settings Breakdown

### Installed Apps

```python
INSTALLED_APPS = [
    # Django built-in
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party
    'rest_framework',
    'corsheaders',
    # Project apps
    'menu',
    'core',
]
```

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

| Variable | Type | Description |
|----------|------|-------------|
| `SECRET_KEY` | String | Django cryptographic key |
| `DEBUG` | Boolean | Debug mode (True for development) |
| `DATABASE_NAME` | String | PostgreSQL database name |
| `DATABASE_USER` | String | PostgreSQL username |
| `DATABASE_PASSWORD` | String | PostgreSQL password |
| `DATABASE_HOST` | String | PostgreSQL host (localhost) |
| `DATABASE_PORT` | String | PostgreSQL port (5432) |
| `ALLOWED_HOSTS` | String | Comma-separated allowed domains |
| `CORS_ALLOWED_ORIGINS` | String | Comma-separated allowed frontend origins |

---

## URL Routing

```
Root (cafe_project/urls.py)
├── /api/menu/          → menu/urls.py
│   ├── categories/     → MenuCategoryListView
│   └── products/       → MenuProductListView
├── /api/pages/         → core/urls.py
│   └── <slug>/         → PageDetailView
└── /api/settings/      → core/urls.py
    └── /               → SiteSettingsView
```

---

## Authentication

**Public API:** No authentication required. All endpoints are read-only.

**Admin Panel:** Django's built-in authentication. Single admin user for content management.

---

## Media Handling

### Development
- Images stored in `media/` directory
- Served via Django's static file handler (DEBUG=True)

### Production (Render)
- Images uploaded to Cloudinary
- `django-cloudinary-storage` handles automatic upload
- Database stores Cloudinary URLs

---

## DRF Configuration

```python
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_PAGINATION_CLASS': None,
}
```

All endpoints return full responses without pagination (dataset is small).
