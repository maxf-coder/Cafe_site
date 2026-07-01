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
│   ├── wsgi.py               # WSGI config (sync)
│   ├── middleware.py          # LanguageMiddleware (?lang= activation)
│   └── schema.py             # CafeAutoSchema (lang param in Swagger)
├── menu/                     # Menu app
│   ├── __init__.py
│   ├── admin.py              # Django admin registration
│   ├── apps.py               # App configuration
│   ├── models.py             # MenuCategory, MenuProduct
│   ├── translation.py        # modeltranslation registration
│   ├── migrations/           # Database migrations
│   │   ├── 0001_initial.py
│   │   ├── 0002_*            # Make short_description + full_description optional
│   │   ├── 0003_*            # Switch full_description to HTMLField (tinymce)
│   │   └── 0004_*            # Add modeltranslation language columns
│   ├── serializers.py        # MenuProductSerializer, MenuCategorySerializer
│   ├── urls.py               # router → /api/v1/menu/categories/
│   └── views.py              # MenuCategoryViewSet (ReadOnlyModelViewSet)
├── core/                     # Core app (global functionality)
│   ├── __init__.py
│   ├── admin.py              # Django admin registration
│   ├── apps.py               # App configuration
│   ├── models.py             # SiteImage, SiteSetting, Page, PageHero, PageSection (PolymorphicModel), WideImageSection, VideoSection, TightImageSection (+ TightImageCard), ReelsSection (+ ReelItem)
│   ├── translation.py        # modeltranslation registration
│   ├── migrations/           # Database migrations
│   │   ├── 0001_initial.py
│   │   ├── 0002_*            # Make various fields optional
│   │   ├── 0003_*            # Rename image → img_src on WideImageSection + TightImageCard
│   │   ├── 0004_*            # Add polymorphic_ctype field
│   │   ├── 0005_*            # Populate polymorphic_ctype for existing rows
│   │   └── 0006_*            # Add modeltranslation language columns
│   ├── serializers.py        # Polymorphic section serializer, PageDetailSerializer, SiteSettingSerializer, SiteImageSerializer
│   ├── urls.py               # /api/v1/pages/<slug>/, /api/v1/settings/, /api/v1/site-images/
│   └── views.py              # PageDetailView, SiteSettingView, SiteImageView
├── logs/                     # Rotating log files (auto-created)
└── static/                   # Collected static files (gitignored)
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
    "drf_spectacular",
    "django_cleanup",          # Auto-deletes old files when ImageField changes
```

**Notes:**
- `modeltranslation` must be before `django.contrib.admin` so translation tabs appear in admin
- `tinymce` — WYSIWYG editor using TinyMCE (Jazzband, MIT license, django-tinymce 5.0.0)
- `adminsortable2` — Drag-and-drop reordering in admin
- `corsheaders` — Must be placed early in MIDDLEWARE

### Middleware Chain

```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',    # Security headers
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
| `ALLOWED_HOSTS` | String | `""` (empty → `[""]`) | Comma-separated allowed domains |
| `CORS_ALLOWED_ORIGINS` | String | `http://localhost:5173` | Comma-separated allowed frontend origins |

---

## URL Routing

```
Root (cafe_project/urls.py)
├── /admin/                 → Django admin panel
├── /tinymce/               → TinyMCE editor content CSS
├── /api/v1/menu/categories/  → MenuCategoryViewSet (categories with nested products)
├── /api/v1/pages/<slug>/     → PageDetailView (published page with hero + typed sections)
├── /api/v1/settings/         → SiteSettingView (flat key-value object)
├── /api/v1/site-images/      → SiteImageView (flat key-image object, absolute URLs)
├── /api/v1/schema/           → drf-spectacular OpenAPI schema (DEBUG only)
└── /api/v1/docs/             → Swagger UI (DEBUG only)
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
    "DEFAULT_SCHEMA_CLASS": "cafe_project.schema.CafeAutoSchema",
}

# In production, browsable API is disabled:
if not DEBUG:
    REST_FRAMEWORK |= {"DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ]}
```

`CafeAutoSchema` extends drf-spectacular's `AutoSchema` to inject a `lang` query parameter (dropdown with ro/en/ru) into every endpoint's Swagger UI.

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
