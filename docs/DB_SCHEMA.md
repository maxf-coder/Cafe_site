# Database Schema

## Overview

The database is organized into two Django apps:

- **`menu`** - Menu categories and products
- **`core`** - Pages, page content, and global site settings

---

## Menu App Models

### MenuCategory

Stores menu categories (Appetizers, Main Courses, Desserts, etc.).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUIDField | Primary Key, default=uuid4 | Unique identifier |
| `name` | CharField(100) | Required | Category display name |
| `slug` | SlugField | Unique, Required | URL-friendly identifier |
| `sort_order` | PositiveIntegerField | Default: 0 | Display order in navbar |
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
| `slug` | SlugField | Unique, Required | URL-friendly identifier |
| `price` | DecimalField(8,2) | Required | Price in MDL |
| `weight_g` | PositiveIntegerField | Nullable | Weight in grams |
| `short_description` | TextField(300) | Required | Truncated description for card view |
| `full_description` | TextField | Required | Complete description with ingredients |
| `img_src` | ImageField | Nullable, upload_to='menu/' | Product image |
| `alt_text` | CharField(200) | Blank, Default: '' | Accessibility alt text |
| `sort_order` | PositiveIntegerField | Default: 0 | Display order within category |
| `is_active` | BooleanField | Default: True | Show/hide product |
| `created_at` | DateTimeField | Auto | Creation timestamp |
| `updated_at` | DateTimeField | Auto | Last update timestamp |

---

## Core App Models

### SiteSettings

Global site configuration (phone, email, address, social links, etc.).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUIDField | Primary Key, default=uuid4 | Unique identifier |
| `key` | CharField(50) | Unique, Required | Setting identifier (e.g., "phone", "email") |
| `value` | TextField | Required | Setting value |
| `description` | CharField(200) | Blank | Human-readable description |
| `created_at` | DateTimeField | Auto | Creation timestamp |
| `updated_at` | DateTimeField | Auto | Last update timestamp |

**Meta:** `verbose_name_plural = 'Site settings'`

**Common keys:** `phone`, `email`, `address`, `address_url`, `schedule_weekdays`, `schedule_weekends`, `social_facebook`, `social_instagram`, `logo_url`

---

### Page

Represents a content page (About Us, Events, Charity).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUIDField | Primary Key, default=uuid4 | Unique identifier |
| `name` | CharField(100) | Required | Page display name |
| `slug` | SlugField | Unique, Required | URL path identifier |
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
| `main_text` | TextField | Required | Primary hero heading |
| `secondary_text` | TextField | Blank | Subtitle or tagline |
| `img_src` | ImageField | Nullable, upload_to='heroes/' | Hero background image |
| `alt_text` | CharField(200) | Blank, Default: '' | Accessibility alt text |
| `created_at` | DateTimeField | Auto | Creation timestamp |
| `updated_at` | DateTimeField | Auto | Last update timestamp |

---

### PageSection

Base model for modular content blocks. Uses **multi-table inheritance** — each section type has its own table with type-specific fields, sharing the base `PageSection` fields (page, sort_order, is_published).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUIDField | Primary Key, default=uuid4 | Unique identifier |
| `page` | ForeignKey(Page) | on_delete=CASCADE, related_name='sections' | Parent page |
| `sort_order` | PositiveIntegerField | Default: 0 | Display order on page |
| `is_published` | BooleanField | Default: True | Show/hide section |
| `created_at` | DateTimeField | Auto | Creation timestamp |
| `updated_at` | DateTimeField | Auto | Last update timestamp |

**Meta:** `ordering = ['sort_order']`

**Child models (inherit from PageSection):**

---

### WideImageSection

Full-width image with title, description, and expandable rich text.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| (inherits) | — | From `PageSection` | page, sort_order, is_published, timestamps |
| `title` | CharField(200) | Required | Section heading |
| `short_description` | TextField(300) | Required | Truncated preview text |
| `full_description` | SummernoteTextField | Required | Rich text with HTML formatting |
| `image` | ImageField | Nullable, upload_to='sections/wide_image/' | Full-width background image |
| `alt_text` | CharField(200) | Blank, Default: '' | Accessibility alt text |

---

### VideoSection

Embedded video (YouTube/Vimeo) with title and description.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| (inherits) | — | From `PageSection` | page, sort_order, is_published, timestamps |
| `title` | CharField(200) | Required | Section heading |
| `video_url` | URLField | Required | Embed URL for video |
| `description` | TextField | Blank | Caption below video |

---

### TightImageSection

Grid of image cards. Contains child `TightImageCard` records.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| (inherits) | — | From `PageSection` | page, sort_order, is_published, timestamps |
| `title` | CharField(200) | Blank, Default: '' | Optional section heading |

#### TightImageCard

Individual card within a `TightImageSection` grid.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUIDField | Primary Key, default=uuid4 | Unique identifier |
| `section` | ForeignKey(TightImageSection) | on_delete=CASCADE, related_name='cards' | Parent section |
| `title` | CharField(200) | Required | Card heading |
| `short_description` | TextField(300) | Required | Truncated preview text |
| `full_description` | SummernoteTextField | Required | Rich text with HTML formatting |
| `image` | ImageField | Nullable, upload_to='sections/tight_image/' | Card image |
| `alt_text` | CharField(200) | Blank, Default: '' | Accessibility alt text |
| `sort_order` | PositiveIntegerField | Default: 0 | Display order within grid |

**Meta:** `ordering = ['sort_order']`

---

### ReelsSection

Horizontal carousel of short-form videos. Contains child `ReelItem` records.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| (inherits) | — | From `PageSection` | page, sort_order, is_published, timestamps |
| `title` | CharField(200) | Blank, Default: '' | Optional section heading |

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

SiteSettings (standalone key-value store)
```

---

## Design Decisions

1. **PageHero as OneToOne** - Each page has exactly one hero. Clean separation from Page model.
2. **Multi-table inheritance for sections** - Each section type gets its own database table with explicit typed fields (ImageField, SummernoteTextField, URLField). Replaces the earlier JSONB approach for better validation, admin UI, and query performance.
3. **SiteSettings as key-value** - Simple, extensible. Adding a new setting requires no schema changes.
4. **sort_order on sortable models** - Categories, products, sections, cards, and reels all have explicit ordering.
5. **is_active/is_published flags** - Hide content without deleting. Supports draft workflows.
6. **alt_text on all image fields** - WCAG 2.1 AA accessibility compliance.
7. **UUID primary keys** - Not predictable, safe for distributed systems and direct object access.
8. **SummernoteTextField for rich text** - WYSIWYG editor in admin; stores HTML. MIT license, free for commercial use.
