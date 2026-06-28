# Database Schema

## Overview

The database is organized into two Django apps:

- **`menu`** - Menu categories and products
- **`core`** - Pages, page content, and global site settings

Language columns (`_ro`, `_en`, `_ru`) are added by `django-modeltranslation` for each registered translatable field. Slugs are never translated.

---

## Menu App Models

### MenuCategory

Stores menu categories (Appetizers, Main Courses, Desserts, etc.).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUIDField | Primary Key, default=uuid4 | Unique identifier |
| `name` | CharField(100) | Required | Category display name |
| `name_ro` | CharField(100) | Added by modeltranslation | Romanian translation |
| `name_en` | CharField(100) | Added by modeltranslation | English translation |
| `name_ru` | CharField(100) | Added by modeltranslation | Russian translation |
| `slug` | SlugField | Unique, Required | URL-friendly identifier (Romanian only, not translated) |
| `sort_order` | PositiveBigIntegerField | Default: 0 | Display order in navbar |
| `is_active` | BooleanField | Default: True | Show/hide category |
| `created_at` | DateTimeField | Auto | Creation timestamp |
| `updated_at` | DateTimeField | Auto | Last update timestamp |

**Meta:**
- `ordering = ['sort_order']`
- `verbose_name_plural = 'Menu categories'`

---

### MenuProduct

Stores individual menu items within a category.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUIDField | Primary Key, default=uuid4 | Unique identifier |
| `category` | ForeignKey(MenuCategory) | on_delete=CASCADE, related_name='products' | Parent category |
| `name` | CharField(200) | Required | Product display name |
| `name_ro` | CharField(200) | Added by modeltranslation | Romanian translation |
| `name_en` | CharField(200) | Added by modeltranslation | English translation |
| `name_ru` | CharField(200) | Added by modeltranslation | Russian translation |
| `slug` | SlugField | Unique, Required | URL-friendly identifier (Romanian only, not translated) |
| `price` | DecimalField(8,2) | Required | Price in MDL |
| `weight_g` | PositiveIntegerField | Nullable | Weight in grams |
| `short_description` | TextField(300) | Optional | Truncated description for card view |
| `short_description_ro` | TextField(300) | Added by modeltranslation | Romanian |
| `short_description_en` | TextField(300) | Added by modeltranslation | English |
| `short_description_ru` | TextField(300) | Added by modeltranslation | Russian |
| `full_description` | HTMLField | Optional | Complete description with ingredients |
| `full_description_ro` | HTMLField | Added by modeltranslation | Romanian |
| `full_description_en` | HTMLField | Added by modeltranslation | English |
| `full_description_ru` | HTMLField | Added by modeltranslation | Russian |
| `img_src` | ImageField | Nullable, upload_to='menu/' | Product image |
| `alt_text` | CharField(200) | Blank | Accessibility alt text |
| `alt_text_ro` | CharField(200) | Added by modeltranslation | Romanian |
| `alt_text_en` | CharField(200) | Added by modeltranslation | English |
| `alt_text_ru` | CharField(200) | Added by modeltranslation | Russian |
| `sort_order` | PositiveIntegerField | Default: 0 | Display order within category |
| `is_active` | BooleanField | Default: True | Show/hide product |
| `created_at` | DateTimeField | Auto | Creation timestamp |
| `updated_at` | DateTimeField | Auto | Last update timestamp |

---

## Core App Models

### SiteSetting

Global site configuration (phone, email, address, social links, etc.).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUIDField | Primary Key, default=uuid4 | Unique identifier |
| `key` | CharField(50) | Unique, Required | Setting identifier (e.g., "phone", "email") |
| `value` | TextField | Required | Setting value |
| `value_ro` | TextField | Added by modeltranslation | Romanian |
| `value_en` | TextField | Added by modeltranslation | English |
| `value_ru` | TextField | Added by modeltranslation | Russian |
| `description` | CharField(200) | Blank | Human-readable description |
| `created_at` | DateTimeField | Auto | Creation timestamp |
| `updated_at` | DateTimeField | Auto | Last update timestamp |

**Meta:** `verbose_name_plural = 'Site settings'`

**Common keys:** `phone`, `email`, `address`, `address_url`, `schedule_weekdays`, `schedule_weekends`, `social_facebook`, `social_instagram`

---

### SiteImage

Stores site-wide images (logo, favicon, etc.). One row per image.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUIDField | Primary Key, default=uuid4 | Unique identifier |
| `key` | CharField(50) | Unique, Required | Image identifier (e.g., "logo", "favicon") |
| `img_src` | ImageField | Required, upload_to='site/' | Image file |
| `alt_text` | CharField(200) | Blank | Accessibility alt text |
| `description` | CharField(200) | Blank | Human-readable description |

**Meta:** `verbose_name_plural = 'Site images'`

---

### Page

Represents a content page (About Us, Events, Charity).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUIDField | Primary Key, default=uuid4 | Unique identifier |
| `name` | CharField(100) | Required | Page display name |
| `name_ro` | CharField(100) | Added by modeltranslation | Romanian translation |
| `name_en` | CharField(100) | Added by modeltranslation | English translation |
| `name_ru` | CharField(100) | Added by modeltranslation | Russian translation |
| `slug` | SlugField | Unique, Required | URL path identifier (Romanian only, not translated) |
| `is_published` | BooleanField | Default: True | Show/hide page |
| `created_at` | DateTimeField | Auto | Creation timestamp |
| `updated_at` | DateTimeField | Auto | Last update timestamp |

---

### PageHero

Hero section for a page. One hero per page.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUIDField | Primary Key, default=uuid4 | Unique identifier |
| `page` | OneToOneField(Page) | on_delete=CASCADE, related_name='hero' | Associated page |
| `main_text` | CharField(50) | Optional | Primary hero heading |
| `main_text_ro` | CharField(50) | Added by modeltranslation | Romanian |
| `main_text_en` | CharField(50) | Added by modeltranslation | English |
| `main_text_ru` | CharField(50) | Added by modeltranslation | Russian |
| `secondary_text` | CharField(150) | Optional | Subtitle or tagline |
| `secondary_text_ro` | CharField(150) | Added by modeltranslation | Romanian |
| `secondary_text_en` | CharField(150) | Added by modeltranslation | English |
| `secondary_text_ru` | CharField(150) | Added by modeltranslation | Russian |
| `img_src` | ImageField | Nullable, upload_to='heroes/' | Hero background image |
| `alt_text` | CharField(200) | Blank | Accessibility alt text |
| `alt_text_ro` | CharField(200) | Added by modeltranslation | Romanian |
| `alt_text_en` | CharField(200) | Added by modeltranslation | English |
| `alt_text_ru` | CharField(200) | Added by modeltranslation | Russian |
| `created_at` | DateTimeField | Auto | Creation timestamp |
| `updated_at` | DateTimeField | Auto | Last update timestamp |

---

### PageSection

Base model for modular content blocks. Uses **multi-table inheritance** with `django-polymorphic` — each section type has its own table with type-specific fields, sharing the base `PageSection` fields. Querying via `Page.published_sections` (a property that filters `is_published=True`) automatically returns the correct child class instances (`WideImageSection`, `VideoSection`, etc.) thanks to `PolymorphicModel`.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUIDField | Primary Key, default=uuid4 | Unique identifier |
| `page` | ForeignKey(Page) | on_delete=CASCADE, related_name='sections' | Parent page |
| `sort_order` | PositiveIntegerField | Default: 0 | Display order on page |
| `is_published` | BooleanField | Default: True | Show/hide section |
| `polymorphic_ctype` | ForeignKey(ContentType) | Nullable, added by django-polymorphic | Points to the ContentType of the child class for automatic downcasting |
| `created_at` | DateTimeField | Auto | Creation timestamp |
| `updated_at` | DateTimeField | Auto | Last update timestamp |

**Meta:** `ordering = ['sort_order']`

**Child models (inherit from PageSection):**

---

### WideImageSection

Full-width image with title, description, and expandable rich text.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| (inherits) | — | From `PageSection` | page, sort_order, is_published, polymorphic_ctype, timestamps |
| `title` | CharField(200) | Optional | Section heading |
| `title_ro` | CharField(200) | Added by modeltranslation | Romanian |
| `title_en` | CharField(200) | Added by modeltranslation | English |
| `title_ru` | CharField(200) | Added by modeltranslation | Russian |
| `short_description` | TextField(300) | Optional | Truncated preview text |
| `short_description_ro` | TextField(300) | Added by modeltranslation | Romanian |
| `short_description_en` | TextField(300) | Added by modeltranslation | English |
| `short_description_ru` | TextField(300) | Added by modeltranslation | Russian |
| `full_description` | HTMLField | Optional | Rich text |
| `full_description_ro` | HTMLField | Added by modeltranslation | Romanian |
| `full_description_en` | HTMLField | Added by modeltranslation | English |
| `full_description_ru` | HTMLField | Added by modeltranslation | Russian |
| `img_src` | ImageField | Nullable, upload_to='sections/wide_image/' | Full-width background image |
| `alt_text` | CharField(200) | Blank | Accessibility alt text |
| `alt_text_ro` | CharField(200) | Added by modeltranslation | Romanian |
| `alt_text_en` | CharField(200) | Added by modeltranslation | English |
| `alt_text_ru` | CharField(200) | Added by modeltranslation | Russian |

---

### VideoSection

Embedded video (YouTube/Vimeo) with title and description.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| (inherits) | — | From `PageSection` | page, sort_order, is_published, polymorphic_ctype, timestamps |
| `title` | CharField(200) | Optional | Section heading |
| `title_ro` | CharField(200) | Added by modeltranslation | Romanian |
| `title_en` | CharField(200) | Added by modeltranslation | English |
| `title_ru` | CharField(200) | Added by modeltranslation | Russian |
| `video_url` | URLField | Required | Embed URL for video (not translated) |
| `description` | TextField | Optional | Caption below video |
| `description_ro` | TextField | Added by modeltranslation | Romanian |
| `description_en` | TextField | Added by modeltranslation | English |
| `description_ru` | TextField | Added by modeltranslation | Russian |

---

### TightImageSection

Grid of image cards. Contains child `TightImageCard` records.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| (inherits) | — | From `PageSection` | page, sort_order, is_published, polymorphic_ctype, timestamps |
| `title` | CharField(200) | Optional | Section heading |
| `title_ro` | CharField(200) | Added by modeltranslation | Romanian |
| `title_en` | CharField(200) | Added by modeltranslation | English |
| `title_ru` | CharField(200) | Added by modeltranslation | Russian |

#### TightImageCard

Individual card within a `TightImageSection` grid.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUIDField | Primary Key, default=uuid4 | Unique identifier |
| `section` | ForeignKey(TightImageSection) | on_delete=CASCADE, related_name='cards' | Parent section |
| `title` | CharField(200) | Optional | Card heading |
| `title_ro` | CharField(200) | Added by modeltranslation | Romanian |
| `title_en` | CharField(200) | Added by modeltranslation | English |
| `title_ru` | CharField(200) | Added by modeltranslation | Russian |
| `short_description` | TextField(300) | Optional | Truncated preview text |
| `short_description_ro` | TextField(300) | Added by modeltranslation | Romanian |
| `short_description_en` | TextField(300) | Added by modeltranslation | English |
| `short_description_ru` | TextField(300) | Added by modeltranslation | Russian |
| `full_description` | HTMLField | Optional | Rich text |
| `full_description_ro` | HTMLField | Added by modeltranslation | Romanian |
| `full_description_en` | HTMLField | Added by modeltranslation | English |
| `full_description_ru` | HTMLField | Added by modeltranslation | Russian |
| `img_src` | ImageField | Nullable, upload_to='sections/tight_image/' | Card image |
| `alt_text` | CharField(200) | Blank | Accessibility alt text |
| `alt_text_ro` | CharField(200) | Added by modeltranslation | Romanian |
| `alt_text_en` | CharField(200) | Added by modeltranslation | English |
| `alt_text_ru` | CharField(200) | Added by modeltranslation | Russian |
| `sort_order` | PositiveIntegerField | Default: 0 | Display order within grid |

**Meta:** `ordering = ['sort_order']`

---

### ReelsSection

Horizontal carousel of short-form videos. Contains child `ReelItem` records.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| (inherits) | — | From `PageSection` | page, sort_order, is_published, polymorphic_ctype, timestamps |
| `title` | CharField(200) | Optional | Section heading |
| `title_ro` | CharField(200) | Added by modeltranslation | Romanian |
| `title_en` | CharField(200) | Added by modeltranslation | English |
| `title_ru` | CharField(200) | Added by modeltranslation | Russian |

#### ReelItem

Individual video within a `ReelsSection` carousel.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUIDField | Primary Key, default=uuid4 | Unique identifier |
| `section` | ForeignKey(ReelsSection) | on_delete=CASCADE, related_name='reels' | Parent section |
| `video_url` | URLField | Required | Short-form video URL |
| `sort_order` | PositiveIntegerField | Default: 0 | Display order in carousel |

**Meta:** `ordering = ['sort_order']`

---

## Relationships Diagram

```
Page ──1:1── PageHero
Page ──1:N── PageSection (parent)
  ├── WideImageSection (multi-table inheritance)
  ├── VideoSection (multi-table inheritance)
  ├── TightImageSection ──1:N── TightImageCard
  └── ReelsSection ──1:N── ReelItem

MenuCategory ──1:N── MenuProduct

SiteSetting (standalone key-value store)
SiteImage (standalone key-image store)
```

---

## Design Decisions

1. **PageHero as OneToOne** - Each page has exactly one hero. Clean separation from Page model.
2. **Multi-table inheritance with `django-polymorphic`** - Each section type gets its own database table with explicit typed fields (ImageField, HTMLField, URLField). `django-polymorphic` ensures that querying the parent table returns actual child class instances, so no manual type dispatch is needed.
3. **SiteSetting/SiteImage as key-value** - Simple, extensible. Adding a new setting or image requires no schema changes.
4. **sort_order on sortable models** - Categories, products, sections, cards, and reels all have explicit ordering.
5. **is_active/is_published flags** - Hide content without deleting. Supports draft workflows.
6. **alt_text on all image fields** - WCAG 2.1 AA accessibility compliance.
7. **UUID primary keys** - Not predictable, safe for distributed systems and direct object access.
8. **HTMLField (django-tinymce) for rich text** - WYSIWYG editor in admin using TinyMCE (Jazzband, MIT); stores valid HTML.
9. **modeltranslation over parler** - modeltranslation v0.20.3 (Apr 2026) supports Django 6.0. Adds language columns (`_ro`, `_en`, `_ru`) in the same table — no extra joins. Admin tabs auto-generated.
10. **Slugs not translated** - URL identifiers are always Romanian. Slugs are excluded from modeltranslation registration. Stable permalinks regardless of language.
