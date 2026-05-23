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

Modular content block within a page.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUIDField | Primary Key, default=uuid4 | Unique identifier |
| `page` | ForeignKey(Page) | on_delete=CASCADE, related_name='sections' | Parent page |
| `section_type` | CharField(20) | Required, choices | Type of section |
| `sort_order` | PositiveIntegerField | Default: 0 | Display order on page |
| `content` | JSONField | Required | Section-specific content |
| `is_published` | BooleanField | Default: True | Show/hide section |
| `created_at` | DateTimeField | Auto | Creation timestamp |
| `updated_at` | DateTimeField | Auto | Last update timestamp |

**Meta:** `ordering = ['sort_order']`

**Section Types:**

| Type | Value |
|------|-------|
| Wide Image | `wide_image` |
| Tight Image Grid | `tight_image` |
| Video | `video` |
| Reels Carousel | `reels` |

---

## Relationships Diagram

```
Page ──1:1── PageHero
Page ──1:N── PageSection

MenuCategory ──1:N── MenuProduct

SiteSettings (standalone key-value store)
```

---

## Design Decisions

1. **PageHero as OneToOne** - Each page has exactly one hero. Clean separation from Page model.
2. **JSONB for PageSection content** - Flexible schema for different section types without creating separate tables.
3. **SiteSettings as key-value** - Simple, extensible. Adding a new setting requires no schema changes.
4. **sort_order on both Category and Product** - Categories ordered in navbar, products ordered within their category.
5. **is_active/is_published flags** - Hide content without deleting. Supports draft workflows.
6. **alt_text on all image fields** - WCAG 2.1 AA accessibility compliance.
