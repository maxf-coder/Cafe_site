# Backend Architecture

## Project Structure

```
src/backend/
├── .dockerignore               # Excludes .env, .venv, __pycache__ from Docker build
├── .env                        # Environment variables (not committed)
├── Dockerfile                  # Multi-stage, uv-based, non-root appuser
├── entrypoint.sh               # Runs migrations, then exec gunicorn
├── manage.py                   # Django CLI entry point
├── pyproject.toml              # Python dependencies
├── cafe_project/               # Django project configuration
│   ├── __init__.py
│   ├── settings.py             # Main settings file
│   ├── urls.py                 # Root URL configuration
│   ├── wsgi.py                 # WSGI config (sync)
│   ├── asgi.py                 # ASGI config (async)
│   ├── middleware.py            # LanguageMiddleware (?lang= activation)
│   └── schema.py               # CafeAutoSchema (lang param in Swagger)
├── menu/                       # Menu app
│   ├── __init__.py
│   ├── admin.py                # Django admin registration
│   ├── apps.py                 # App configuration
│   ├── models.py               # MenuCategory, MenuProduct
│   ├── translation.py          # modeltranslation registration
│   ├── migrations/
│   ├── serializers.py          # MenuProductSerializer, MenuCategorySerializer
│   ├── urls.py                 # router → /api/v1/menu/categories/
│   └── views.py                # MenuCategoryViewSet (ReadOnlyModelViewSet)
├── core/                       # Core app (global functionality)
│   ├── __init__.py
│   ├── admin.py                # Django admin registration
│   ├── apps.py                 # CoreConfig.ready(): shared boto3 connection for all threads
│   ├── models.py               # SiteImage, SiteSetting, Page, PageHero, PageSection (PolymorphicModel), WideImageSection, VideoSection, TightImageSection (+ TightImageCard), ReelsSection (+ ReelItem)
│   ├── translation.py          # modeltranslation registration
│   ├── migrations/
│   ├── serializers.py          # Polymorphic section serializer, PageDetailSerializer, SiteSettingSerializer, SiteImageSerializer
│   ├── urls.py                 # /api/v1/pages/<slug>/, /api/v1/settings/, /api/v1/site-images/
│   └── views.py                # PageDetailView, SiteSettingView, SiteImageView
├── logs/                       # Rotating log files (auto-created)
└── static/                     # Collected static files (gitignored)
```

---

## Apps

### `menu` App

**Responsibility:** Menu categories and products.

| File | Purpose |
|------|---------|
| `models.py` | `MenuCategory`, `MenuProduct` models |
| `translation.py` | modeltranslation `TranslationOptions` for translatable fields |
| `admin.py` | Admin interface with `SortableAdminMixin` |
| `serializers.py` | `MenuProductSerializer`, `MenuCategorySerializer` (nested products) |
| `urls.py` | `DefaultRouter` → `/api/v1/menu/categories/` |
| `views.py` | `MenuCategoryViewSet` (ReadOnlyModelViewSet, filter `is_active=True`) |

### `core` App

**Responsibility:** Site-wide content, pages, settings.

| File | Purpose |
|------|---------|
| `models.py` | `SiteImage`, `SiteSetting`, `Page`, `PageHero`, `PageSection` (base), `WideImageSection`, `VideoSection`, `TightImageSection` (+ `TightImageCard`), `ReelsSection` (+ `ReelItem`) |
| `translation.py` | modeltranslation `TranslationOptions` for translatable fields |
| `admin.py` | Admin interface with `SortableAdminBase`, `SortableStackedInline`, and `TabularInline` for section reordering |
| `serializers.py` | All serializers: `PageHeroSerializer`, polymorphic `PageSectionSerializer` (dispatches via `isinstance`), `PageDetailSerializer`, flat-object `SiteSettingSerializer`, flat-object `SiteImageSerializer` |
| `urls.py` | `api/v1/pages/<slug:slug>/` (PageDetailView), `api/v1/settings/` (SiteSettingView), `api/v1/site-images/` (SiteImageView) |
| `views.py` | `PageDetailView` (RetrieveAPIView, `lookup_field="slug"`), `SiteSettingView` (ListAPIView with custom `get_serializer`), `SiteImageView` (ListAPIView with custom `get_serializer`) |

---

## Settings Breakdown

### Installed Apps

```python
INSTALLED_APPS = [
    "modeltranslation",          # Must be first for admin tab registration
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    "rest_framework",
    "corsheaders",
    "tinymce",
    "polymorphic",
    "menu",
    "core",
    "adminsortable2",
    "django_cleanup",          # Auto-deletes old files when ImageField changes
]
```

**Notes:**
- `modeltranslation` must be before `django.contrib.admin` so translation tabs appear in admin
- `tinymce` — WYSIWYG editor using TinyMCE (Jazzband, MIT license, django-tinymce 5.0.0)
- `adminsortable2` — Drag-and-drop reordering in admin
- `corsheaders` — Must be placed early in MIDDLEWARE
- `drf-spectacular` is a dev-only dependency (not in production)

### Middleware Chain

```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',    # Security headers
    "whitenoise.middleware.WhiteNoiseMiddleware",       # Serve static files in production
    'corsheaders.middleware.CorsMiddleware',            # CORS handling (must be early)
    "cafe_project.middleware.LanguageMiddleware",       # Activates language from ?lang=
    'django.contrib.sessions.middleware.SessionMiddleware',  # Session support
    'django.middleware.common.CommonMiddleware',        # Common utilities
    'django.middleware.csrf.CsrfViewMiddleware',        # CSRF protection
    'django.contrib.auth.middleware.AuthenticationMiddleware',  # User auth
    'django.contrib.messages.middleware.MessageMiddleware',     # Flash messages
    'django.middleware.clickjacking.XFrameOptionsMiddleware',   # Clickjacking protection
]
```

**LanguageMiddleware** reads the `?lang=` query parameter, validates it against `settings.LANGUAGES`, and activates the language via `django.utils.translation.activate()`. Sits after CORS (for header processing) but before Session/Common middleware.

**WhiteNoiseMiddleware** serves Django's collected static files (admin CSS, JS) in production without needing a separate web server.

---

## Environment Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `SECRET_KEY` | String | — | Django cryptographic key (required) |
| `DEBUG` | Boolean | `False` | Debug mode (True for development) |
| `DATABASE_NAME` | String | — | PostgreSQL database name |
| `DATABASE_USER` | String | — | PostgreSQL username |
| `DATABASE_PASSWORD` | String | — | PostgreSQL password |
| `DATABASE_HOST` | String | `localhost` | PostgreSQL host |
| `DATABASE_PORT` | String | `5432` | PostgreSQL port |
| `ALLOWED_HOSTS` | String | `""` (empty → `[]`) | Comma-separated allowed domains |
| `CORS_ALLOWED_ORIGINS` | String | `""` (empty → `[]`) | Comma-separated allowed frontend origins |
| `CSRF_TRUSTED_ORIGINS` | String | `""` (empty → `[]`) | Comma-separated trusted origins for POST requests |
| `GUNICORN_WORKERS` | Integer | `3` | Number of Gunicorn worker processes |
| `R2_ACCESS_KEY_ID` | String | — | Cloudflare R2 access key |
| `R2_SECRET_ACCESS_KEY` | String | — | Cloudflare R2 secret key |
| `R2_BUCKET_NAME` | String | — | R2 bucket name |
| `R2_ENDPOINT_URL` | String | — | R2 S3-compatible endpoint URL |

Empty-string environment variables are filtered at runtime — a missing `ALLOWED_HOSTS` produces `[]` (safe), not `[""]`.

---

## URL Routing

```
Root (cafe_project/urls.py)
├── /cafe-admin/             → Django admin panel
├── /tinymce/                → TinyMCE editor content CSS
├── /api/v1/menu/categories/  → MenuCategoryViewSet (categories with nested products)
├── /api/v1/pages/<slug>/     → PageDetailView (published page with hero + typed sections)
├── /api/v1/settings/         → SiteSettingView (flat key-value object)
├── /api/v1/site-images/      → SiteImageView (flat key-image object, signed URLs)
├── /api/v1/health/           → Health check (DB connection + JSON status)
├── /api/v1/schema/           → drf-spectacular OpenAPI schema (DEBUG only)
└── /api/v1/docs/             → Swagger UI (DEBUG only)
```

---

## Authentication

**Public API:** All endpoints are read-only, no authentication (`AllowAny`). JSON only in production; browsable API available in DEBUG mode.

**Admin Panel:** Django's built-in authentication. Single admin user for content management at `/cafe-admin/`.

---

## Media Handling

Images are stored in Cloudflare R2 via `django-storages[s3]` in both dev and production.

- `STORAGES["default"]` uses `storages.backends.s3.S3Storage`
- Images upload directly to R2 when saved in admin (no local `media/` involved)
- `url()` returns signed R2 URLs with 7-day expiry (`querystring_expire: 604800`)
- The R2 bucket is private; signed URLs grant temporary access
- A shared boto3 connection is created at startup in `CoreConfig.ready()` and patched onto `S3Storage.connection` — all threads reuse the same connection, avoiding per-thread warmup cost
- Static files are served by WhiteNoise (not affected by R2 config)

---

## DRF Configuration

```python
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    "DEFAULT_SCHEMA_CLASS": "cafe_project.schema.CafeAutoSchema",
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "200/hour",
    },
}

# In production, browsable API is disabled:
if not DEBUG:
    REST_FRAMEWORK |= {"DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ]}
```

`CafeAutoSchema` extends drf-spectacular's `AutoSchema` to inject a `lang` query parameter (dropdown with ro/en/ru) into every endpoint's Swagger UI.

## Caching

API endpoints use Django's `LocMemCache` with `@cache_page(300)` — 5-minute cache for menu, pages, settings, and site images. LocMemCache is per-process (each Gunicorn worker has its own cache). Adequate for low-traffic sites. Upgrade to Redis by swapping the backend in `settings.py`:

```python
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": os.getenv("REDIS_URL", "redis://redis:6379/1"),
    }
}
```

---

## Logging

Rotating file handler (5 MB, 3 backups) + console stream handler:
- **Root logger**: INFO level → console + file
- **django.request**: ERROR level → file only
- **django.db.backends**: WARNING level → file only
- Log directory `logs/` is auto-created on Django start

---

## Multi-Language Architecture

- **django-modeltranslation** v0.20.3 adds three language columns per translatable field (`name_ro`, `name_en`, `name_ru`) in the same database table
- Active language selected by `?lang=ro|en|ru` query parameter on every API request
- `LanguageMiddleware` activates the language before views process the request
- Slugs are **not** translated — they remain in Romanian as permanent URL identifiers
- `CafeAutoSchema` adds the `lang` parameter to the OpenAPI schema for Swagger UI
