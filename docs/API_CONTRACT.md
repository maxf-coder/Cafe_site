# API Contract

## Overview

The backend exposes 3 read-only API endpoints. All responses are JSON. No authentication required for public endpoints.

**Base URL (development):** `http://localhost:8000`

---

## Endpoints

### 1. GET /api/menu/categories/

Returns a lightweight list of menu categories for rendering the category navbar.

**Response:**
```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Aperitive",
    "slug": "aperitive"
  },
  {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "name": "Feluri Principale",
    "slug": "feluri-principale"
  }
]
```

**TypeScript Interface:**
```typescript
interface MenuCategory {
  id: string;
  name: string;
  slug: string;
}

// Response type: MenuCategory[]
```

---

### 2. GET /api/menu/products/

Returns all active menu products. Frontend groups by `category_id`.

**Response:**
```json
[
  {
    "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "category_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Bruschetta",
    "slug": "bruschetta",
    "price": "45.00",
    "weight_g": 150,
    "short_description": "Pâine prăjită cu roșii și busuioc",
    "full_description": "Pâine prăjită cu roșii proaspete, busuioc, ulei de măsline și mozzarella.",
    "image_url": "/media/menu/bruschetta.jpg",
    "alt_text": "Bruschetta cu roșii și busuioc"
  }
]
```

**TypeScript Interface:**
```typescript
interface MenuProduct {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  price: string;
  weight_g: number | null;
  short_description: string;
  full_description: string;
  image_url: string | null;
  alt_text: string;
}

// Response type: MenuProduct[]
```

---

### 3. GET /api/pages/{slug}/

Returns a complete page with hero and all published sections.

**Request:** `GET /api/pages/despre-noi/`

**Response:**
```json
{
  "name": "Despre noi",
  "slug": "despre-noi",
  "hero": {
    "main_text": "Povestea Noastră",
    "secondary_text": "Un loc unde gustul întâlnește comunitatea",
    "image_url": "/media/heroes/about.jpg",
    "alt_text": "Echipa Fiesta Gastro Cafe"
  },
  "sections": [
    {
      "id": "d4e5f6a7-b8c9-0123-defa-234567890123",
      "type": "wide_image",
      "content": {
        "title": "Bine ați venit la Fiesta",
        "short_description": "Servim pasiune în fiecare farfurie.",
        "full_description": "Fondată în 2020, Fiesta Gastro Cafe s-a născut din dorința de a aduce bucătăria mediteraneană în Chișinău.",
        "image_url": "/media/sections/welcome.jpg",
        "alt_text": "Interiorul cafenelei"
      }
    },
    {
      "id": "e5f6a7b8-c9d0-1234-efab-345678901234",
      "type": "tight_image",
      "content": {
        "title": "Echipa Noastră",
        "cards": [
          {
            "title": "Bucătar Maria",
            "short_description": "10 ani experiență în bucătăria italiană.",
            "full_description": "Maria a studiat la Roma și a lucrat în restaurante cu stele Michelin.",
            "image_url": "/media/sections/maria.jpg",
            "alt_text": "Bucătarul Maria"
          }
        ]
      }
    },
    {
      "id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
      "type": "video",
      "content": {
        "title": "În Spatele Scenei",
        "video_url": "https://www.youtube.com/embed/abc123",
        "description": "Uitați cum pregătim mâncarea voastră preferată."
      }
    },
    {
      "id": "a7b8c9d0-e1f2-3456-abcd-567890123456",
      "type": "reels",
      "content": {
        "title": "Clipuri Rapide",
        "reels": [
          {
            "video_url": "https://www.youtube.com/shorts/xyz",
            "caption": "Ingrediente proaspete zilnic"
          }
        ]
      }
    }
  ]
}
```

**TypeScript Interfaces:**
```typescript
interface PageHero {
  main_text: string;
  secondary_text: string;
  image_url: string | null;
  alt_text: string;
}

type SectionType = 'wide_image' | 'tight_image' | 'video' | 'reels';

interface WideImageContent {
  title: string;
  short_description: string;
  full_description: string;
  image_url: string;
  alt_text: string;
}

interface TightImageCard {
  title: string;
  short_description: string;
  full_description: string;
  image_url: string;
  alt_text: string;
}

interface TightImageContent {
  title: string;
  cards: TightImageCard[];
}

interface VideoContent {
  title: string;
  video_url: string;
  description: string;
}

interface ReelItem {
  video_url: string;
  caption: string;
}

interface ReelsContent {
  title: string;
  reels: ReelItem[];
}

type SectionContent = WideImageContent | TightImageContent | VideoContent | ReelsContent;

interface PageSection {
  id: string;
  type: SectionType;
  content: SectionContent;
}

interface PageResponse {
  name: string;
  slug: string;
  hero: PageHero | null;
  sections: PageSection[];
}
```

**404 Response (page not found):**
```json
{
  "detail": "Not found."
}
```

---

### 4. GET /api/settings/

Returns global site settings (navbar, footer data).

**Response:**
```json
{
  "phone": "+373 60 123 456",
  "email": "contact@fiestagastro.md",
  "address": "str. Ștefan cel Mare 42, Chișinău, Moldova",
  "address_url": "https://maps.google.com/?q=47.0105,28.8647",
  "schedule_weekdays": "Luni - Vineri: 09:00 - 23:00",
  "schedule_weekends": "Sâmbătă - Duminică: 10:00 - 00:00",
  "social_facebook": "https://facebook.com/fiestagastro",
  "social_instagram": "https://instagram.com/fiestagastro",
  "logo_url": "/media/logo.png"
}
```

**TypeScript Interface:**
```typescript
interface SiteSettings {
  phone: string;
  email: string;
  address: string;
  address_url: string;
  schedule_weekdays: string;
  schedule_weekends: string;
  social_facebook: string | null;
  social_instagram: string | null;
  logo_url: string | null;
}
```

---

## Error Responses

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
  "detail": "A server error occurred."
}
```

---

## Caching Strategy

| Endpoint | Cache Duration | Notes |
|----------|---------------|-------|
| `/api/menu/categories/` | 5 minutes | Categories change rarely |
| `/api/menu/products/` | 5 minutes | Products may change daily |
| `/api/pages/{slug}/` | 5 minutes | Content updates via admin |
| `/api/settings/` | Until invalidation | Invalidate on settings change |

---

## Frontend Usage Pattern

```typescript
// Fetch categories first (navbar renders immediately)
const { data: categories } = useQuery({
  queryKey: ['menu-categories'],
  queryFn: () => api.getMenuCategories(),
});

// Fetch products in parallel (grouped by category in UI)
const { data: products } = useQuery({
  queryKey: ['menu-products'],
  queryFn: () => api.getMenuProducts(),
});

// Fetch page content
const { data: page } = useQuery({
  queryKey: ['page', slug],
  queryFn: () => api.getPage(slug),
});

// Fetch settings once, cache forever
const { data: settings } = useQuery({
  queryKey: ['settings'],
  queryFn: () => api.getSettings(),
  staleTime: Infinity,
});
```
