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
│   │   ├── 0001_initial.py
│   │   ├── 0002_*            # Make short_description + full_description optional
│   │   └── 0003_*            # Switch full_description to HTMLField (tinymce)
│   ├── serializers.py        # MenuProductSerializer, MenuCategorySerializer
│   ├── urls.py               # router → /api/menu/categories/
│   └── views.py              # MenuCategoryViewSet (ReadOnlyModelViewSet)
├── core/                     # Core app (global functionality)
│   ├── __init__.py
│   ├── admin.py              # Django admin registration
│   ├── apps.py               # App configuration
│   ├── models.py             # Page, PageHero, PageSection (PolymorphicModel), WideImageSection, VideoSection, TightImageSection (+ TightImageCard), ReelsSection (+ ReelItem)
│   ├── migrations/           # Database migrations
│   │   ├── 0001_initial.py
│   │   ├── 0002_*            # Make various fields optional
│   │   ├── 0003_*            # Rename image → img_src on WideImageSection + TightImageCard
│   │   ├── 0004_*            # Add polymorphic_ctype field
│   │   └── 0005_*            # Populate polymorphic_ctype for existing rows
│   ├── serializers.py        # Polymorphic section serializer, PageDetailSerializer, SiteSettingsSerializer
│   ├── urls.py               # /api/pages/<slug>/, /api/settings/
│   └── views.py              # PageDetailView, SiteSettingsView
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
| `serializers.py` | `MenuProductSerializer`, `MenuCategorySerializer` (nested products) |
| `urls.py` | `DefaultRouter` → `/menu/categories/` |
| `views.py` | `MenuCategoryViewSet` (ReadOnlyModelViewSet, filter `is_active=True`) |

### `core` App

**Responsibility:** Site-wide content, pages, settings.

| File | Purpose |
|------|---------|
| `models.py` | `SiteSettings`, `Page`, `PageHero`, `PageSection` (base), `WideImageSection`, `VideoSection`, `TightImageSection` (+ `TightImageCard`), `ReelsSection` (+ `ReelItem`) |
| `admin.py` | Admin interface for all models with `SortableAdminMixin`, `SortableAdminBase`, and `TabularInline` for section reordering |
| `serializers.py` | All serializers: `PageHeroSerializer`, polymorphic `PageSectionSerializer` (dispatches via `isinstance`), `PageDetailSerializer`, flat-object `SiteSettingsSerializer` |
| `urls.py` | `pages/<slug:slug>/` (PageDetailView), `settings/` (SiteSettingsView) |
| `views.py` | `PageDetailView` (RetrieveAPIView, `lookup_field="slug"`), `SiteSettingsView` (ListAPIView with custom `get_serializer`) |

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
    'tinymce',
    'drf_spectacular',
    'polymorphic',
    'menu',
    'core',
    'adminsortable2',
]
```

**Notes:**
- `tinymce` — WYSIWYG editor using TinyMCE (Jazzband, MIT license, django-tinymce 5.0.0)
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
├── /admin/                 → Django admin panel
├── /tinymce/               → TinyMCE editor content CSS
├── /api/menu/categories/   → MenuCategoryViewSet (categories with nested products)
├── /api/pages/<slug>/      → PageDetailView (published page with hero + typed sections)
├── /api/settings/          → SiteSettingsView (flat key-value object)
├── /api/schema/            → drf-spectacular OpenAPI schema (DEBUG only)
└── /api/docs/              → Swagger UI (DEBUG only)
```

---

## Authentication

**Public API:** All endpoints are read-only, no authentication (`AllowAny`). JSON only in production; browsable API available in DEBUG mode.

**Admin Panel:** Django's built-in authentication. Single admin user for content management.

---

## Media Handling

### Development
- Images stored in `media/` directory
- Served via `static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)` in `urls.py`
- Image fields return absolute URLs via `build_absolute_uri` in serializers

### Production (Planned)
- Images uploaded to Cloudinary
- `django-cloudinary-storage` handles automatic upload
- Database stores Cloudinary URLs

---

## DRF Configuration

```python
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

# In production, browsable API is disabled:
if not DEBUG:
    REST_FRAMEWORK |= {"DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ]}
```
