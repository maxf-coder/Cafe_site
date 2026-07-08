# Admin Guide

> **URL (manual dev)**: `http://localhost:8000/cafe-admin/`
> **URL (Docker Compose)**: `http://localhost/cafe-admin/`
> **Write path**: Django admin is the **only** way to create/edit content. The API is read-only.

---

## Quick Start — What Must Be Created

| Order | Model | Purpose | Keys / Slugs |
|-------|-------|---------|--------------|
| 1 | **Site Settings** | Navbar phone, Footer contact/schedule/socials | See table below |
| 2 | **Site Images** | Logo in navbar/footer + favicon | key: `logo` |
| 3 | **Pages** | Content pages served by frontend | slugs: `meniu`, `despre-noi`, `evenimente-out-door`, `caritate` |
| 4 | **Menu Categories** + **Products** | Menu page | Any slug (Romanian) |

Without #1–3, the frontend shows blank/placeholder content.

---

## 1. Site Settings

**Model**: `SiteSetting` (under the **Core** section in admin)
**API**: `GET /api/v1/settings/` → `{ "phone": "...", "email": "...", ... }`

### Required Keys

Create one `SiteSetting` record per row, entering the exact `key` as shown:

| Key | Frontend Usage | Example Value |
|-----|----------------|---------------|
| `phone` | Navbar phone CTA, Footer contact | `+40 123 456 789` |
| `email` | Footer email link | `contact@fiestagastro.ro` |
| `address` | Footer address block | `Strada Exemplu, Nr. 10, București` |
| `mission` | Footer mission text | `Gusturi autentice, momente de neuitat.` |
| `working_days` | Footer weekday schedule | `Luni – Vineri: 08:00 – 22:00` |
| `weekend_days` | Footer weekend schedule | `Sâmbătă – Duminică: 09:00 – 23:00` |
| `instagram_link` | Footer Instagram icon | `https://instagram.com/fiestagastro` |
| `facebook_link` | Footer Facebook icon | `https://facebook.com/fiestagastro` |
| `footer_copyright` | Footer bottom bar | `© 2026 Fiesta Gastro Cafe. All rights reserved.` |
| `developer_name` | Footer credits section | `Max` |
| `developer_github` | Footer GitHub icon link | `https://github.com/yourusername` |
| `developer_linkedin` | Footer LinkedIn icon link | `https://linkedin.com/in/yourusername` |
| `developer_email` | Footer email icon link | `your.email@gmail.com` |
| `disclaimer` | Footer disclaimer text | `Acest site este un model demonstrativ și nu reprezintă un restaurant real.` |

### Language-Specific Values

Each setting has **3 language tabs** (`ro`, `en`, `ru`) because `value` is translatable. For example:
- `phone`, `instagram_link`, `facebook_link` → same in all 3 tabs
- `mission`, `address`, `working_days`, `weekend_days`, `footer_copyright` → translate per tab
- `developer_name`, `developer_github`, `developer_linkedin`, `developer_email`, `disclaimer` → same in all 3 tabs (developer info is language-agnostic)

### Notes

- `key` must be **exact** and **unique** — the frontend reads `settings[key]`
- `description` is optional, for admin reference
- The API returns a flat object: `{ "phone": "+40 123...", "email": "contact@..." }`
- Cache: `staleTime: Infinity` (never re-fetches unless admin changes data)

---

## 2. Site Images

**Model**: `SiteImage` (under **Core** section in admin)
**API**: `GET /api/v1/site-images/` → `{ "logo": { "src": "...", "alt": "..." } }`

### Required Keys

| Key | Frontend Usage | Description |
|-----|----------------|-------------|
| `logo` | Navbar logo, Footer logo, Favicon | Cafe logo (square, ~200×200px recommended) |

### Notes

- `key` must be **exact**: `logo`
- `img_src` — upload the image file
- `alt_text` — accessible alt text (optional)
- If no `SiteImage` record exists with key `logo`, the frontend falls back to `/images/placeholderLogo.png`
- Cache: `staleTime: Infinity`
- Only 1 image key is consumed by the frontend. Additional keys can exist but have no effect.

---

## 3. Pages

**Model**: `Page` (under **Core** → **Pages** in admin)
**API**: `GET /api/v1/pages/{slug}/`

### Required Pages (exact slugs)

The frontend hardcodes these slugs in navigation/routing:

| Slug | Navbar Label | Frontend Route |
|------|-------------|----------------|
| `meniu` | — (home page, not in navbar) | `/` |
| `despre-noi` | Despre Noi / About Us | `/content/despre-noi` |
| `evenimente-out-door` | Evenimente / Events | `/content/evenimente-out-door` |
| `caritate` | Caritate / Charity | `/content/caritate` |

### How to Create a Page

1. Go to **Core** → **Pages** → **Add Page**
2. **Name** — enter in all 3 language tabs (ro/en/ru)
3. **Slug** — enter the Romanian slug (e.g., `despre-noi`). **Slug is NOT translatable** — one slug per page, used in URL
4. **Is published** — check to make it visible via API
5. **Save**

### Page Hero

After creating a Page, scroll to **Page hero** inline and click **Add hero**:
- **Main text** — translatable, large heading
- **Secondary text** — translatable, smaller subheading
- **Img src** — upload a background image (optional)
- **Alt text** — translatable

### Adding Sections

Scroll to **Sections** → **Add another Wide image section** (or other type):

| Section Type | What It Renders |
|-------------|-----------------|
| **Wide image section** | Full-width image with title, short description, expandable HTML rich text |
| **Tight image section** | 2-column card grid — add cards via **Tight image cards** inline |
| **Video section** | Embedded YouTube video with title + description (paste full YouTube URL) |
| **Reels section** | Horizontal scrollable YouTube reel carousel — add reels via **Reel items** inline |

Each section has:
- **Sort order** — drag to reorder (use the drag handle ⋮⋮)
- **Is published** — uncheck to hide from API
- Language tabs for translatable fields

### Important

- **Slug is read-only after creation** — you cannot change it once saved
- **Pages cannot be deleted** — use "Is published" to hide
- The `meniu` page is fetched by the Menu page for its hero section; it does not need sections unless you want content below the menu

---

## 4. Menu Categories & Products

**Models**: `MenuCategory`, `MenuProduct` (under **Menu** section in admin)

### MenuCategory

| Field | Notes |
|-------|-------|
| `name` | Translatable (ro/en/ru) |
| `slug` | Romanian only, auto-generated from `name_ro`, editable on create |
| `sort_order` | Drag to reorder categories |
| `is_active` | Uncheck to hide category + all its products |

### MenuProduct

Added inline within a Category:
- `name` — translatable
- `price` — decimal, e.g. `25.00`
- `weight_g` — optional, e.g. `250`
- `short_description` — shown on product card
- `full_description` — TinyMCE HTML editor (bold, lists, tables, links)
- `img_src` — upload product image
- `alt_text` — translatable
- `sort_order` — drag to reorder within category

### Import Command

Instead of manually creating 50+ products, use the JSON fixture:

```bash
# Local dev
uv run python manage.py loaddata cafe_data.json

# Docker Compose
docker compose cp cafe_data.json backend:/app/
docker compose exec backend python manage.py loaddata cafe_data.json
```

This creates 15 categories and 49 products with Romanian names, slugs, and signed R2 image URLs.

---

## 5. Admin Features

### Language Tabs

Each translatable model has **ro**, **en**, **ru** tabs at the top of the form. Fill in all 3 languages for fields that should differ (names, descriptions). Fields like `slug`, `sort_order`, `price` appear once (not translatable).

### Drag-and-Drop Reorder

- **Categories**: drag rows in the category list view
- **Products**: drag inline rows within a category
- **Sections**: drag inline rows within a page
- **TightImageCards / ReelItems**: drag inline rows within their section

Use the ⋮⋮ (drag handle) on the left. Changes auto-save on reorder.

### Collapsible Fieldsets

Editing a product shows collapsed groups to reduce visual noise:
- **Descriptions** (short + full) — click to expand
- **Images** (image + alt text) — click to expand

### TinyMCE Editor

`full_description` uses TinyMCE WYSIWYG (rich text). Supports:
- Bold, italic, lists (ordered/unordered)
- Tables
- Links
- No image embedding (images go in `img_src`)

### Image Deletion via `django-cleanup`

When you upload a new `img_src` for a product/hero/section/image, the **old file is automatically deleted** from disk. You cannot have two products reference the same uploaded file — each upload creates a unique copy.

If you want a shared placeholder across products, either:
1. Use the `import_menu_data` command (sets a shared placeholder path)
2. Leave `img_src` empty and rely on the frontend's fallback (future feature)

---

## 6. Page Slug Reference

| Slug | Used By | API Path |
|------|---------|----------|
| `meniu` | `Menu.tsx` home page hero | `GET /api/v1/pages/meniu/` |
| `despre-noi` | Navbar "Despre Noi" link | `GET /api/v1/pages/despre-noi/` |
| `evenimente-out-door` | Navbar "Evenimente" link | `GET /api/v1/pages/evenimente-out-door/` |
| `caritate` | Navbar "Caritate" link | `GET /api/v1/pages/caritate/` |

These exact slugs **must** exist as `Page` records with `is_published=True` for the frontend to show content. If a page is missing, the API returns 404 and the frontend will show an error state.
