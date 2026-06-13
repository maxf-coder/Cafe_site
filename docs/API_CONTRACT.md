# API Contract

## Overview

The backend exposes read-only API endpoints. All responses are JSON. No authentication required.

**Base URL (development):** `http://localhost:8000`

---

## Endpoints

### 1. GET /api/menu/categories/

Returns menu categories sorted by `sort_order`, each with its products nested.

**Response:**
```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Cafele clasice",
    "slug": "cafele-clasice",
    "products": [
      {
        "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        "name": "Espresso",
        "slug": "espresso",
        "price": "10.00",
        "weight_g": 30,
        "short_description": "Cafea intensă, 30 ml",
        "full_description": "Un shot concentrat de cafea, extras la presiune înaltă din boabe 100% Arabica.",
        "img_src": "http://localhost:8000/media/menu/espresso.jpg",
        "alt_text": ""
      }
    ]
  }
]
```

**TypeScript Interfaces:**
```typescript
interface MenuProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  weight_g: number | null;
  short_description: string;
  full_description: string;
  img_src: string | null;
  alt_text: string;
}

interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  products: MenuProduct[];
}
```

---

### 2. GET /api/pages/{slug}/

Returns a published page with hero and all published sections.

**Request:** `GET /api/pages/despre-noi/`

**Response:**
```json
{
  "name": "Despre noi",
  "slug": "despre-noi",
  "hero": {
    "main_text": "Povestea Noastră",
    "secondary_text": "Un loc unde gustul întâlnește comunitatea",
    "img_src": "http://localhost:8000/media/heroes/about.jpg",
    "alt_text": "Echipa Fiesta Gastro Cafe"
  },
  "sections": [
    {
      "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
      "type": "wide_image",
      "content": {
        "title": "Bine ați venit la Fiesta",
        "short_description": "Servim pasiune în fiecare farfurie.",
        "full_description": "<p>Fondată în 2020, Fiesta Gastro Cafe...</p>",
        "img_src": "http://localhost:8000/media/sections/wide_image/welcome.jpg",
        "alt_text": "Interiorul cafenelei"
      }
    },
    {
      "id": "d4e5f6a7-b8c9-0123-defa-234567890123",
      "type": "tight_image",
      "content": {
        "title": "Echipa Noastră",
        "cards": [
          {
            "title": "Bucătar Maria",
            "short_description": "10 ani experiență în bucătăria italiană.",
            "full_description": "<p>Maria a studiat la Roma...</p>",
            "img_src": "http://localhost:8000/media/sections/tight_image/maria.jpg",
            "alt_text": "Bucătarul Maria"
          }
        ]
      }
    },
    {
      "id": "e5f6a7b8-c9d0-1234-efab-345678901234",
      "type": "video",
      "content": {
        "title": "În Spatele Scenei",
        "video_url": "https://www.youtube.com/embed/abc123",
        "description": "Uitați cum pregătim mâncarea voastră preferată."
      }
    },
    {
      "id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
      "type": "reels",
      "content": {
        "title": "Clipuri Rapide",
        "reels": [
          {
            "video_url": "https://www.youtube.com/shorts/xyz"
          }
        ]
      }
    }
  ]
}
```

**404 Response (page not found):**
```json
{
  "detail": "Not found."
}
```

---

### 3. GET /api/settings/

Returns all site settings as a flat JSON object.

**Response:**
```json
{
  "phone": "+40 7XX XXX XXX",
  "email": "contact@caferazesu.ro",
  "address": "Strada Exemplu, Nr. 1, București",
  "facebook_url": "https://facebook.com/caferazesu",
  "tiktok_url": "https://tiktok.com/@caferazesu",
  "working_hours": "L-V: 08:00 - 22:00, S-D: 10:00 - 00:00",
  "footer_copyright": "© 2026 Cafe Răzeșu. Toate drepturile rezervate."
}
```

**TypeScript Interface:**
```typescript
interface SiteSettings {
  [key: string]: string;
}
```

---

## TypeScript Interfaces

### Page

```typescript
interface PageHero {
  main_text: string;
  secondary_text: string;
  img_src: string | null;
  alt_text: string;
}

// Section types
type SectionType = 'wide_image' | 'tight_image' | 'video' | 'reels';

interface WideImageContent {
  title: string;
  short_description: string;
  full_description: string;
  img_src: string;
  alt_text: string;
}

interface TightImageCard {
  title: string;
  short_description: string;
  full_description: string;
  img_src: string;
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

### Menu

```typescript
interface MenuProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  weight_g: number | null;
  short_description: string;
  full_description: string;
  img_src: string | null;
  alt_text: string;
}

interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  products: MenuProduct[];
}
```

### Settings

Settings is a flat dictionary; the actual keys depend on what's stored in the database.

```typescript
interface SiteSettings {
  [key: string]: string;
}
```

---

## Error Responses

### 404 Not Found
```json
{ "detail": "Not found." }
```

### 500 Internal Server Error
```json
{ "detail": "A server error occurred." }
```

---

## Caching Strategy

| Endpoint | Cache Duration | Notes |
|----------|---------------|-------|
| `/api/menu/categories/` | 5 minutes | Categories and products change rarely |
| `/api/pages/{slug}/` | 5 minutes | Content updates via admin |
| `/api/settings/` | Until invalidation | Invalidate on settings change |

---

## Frontend Usage Pattern

```typescript
const { data: categories } = useQuery({
  queryKey: ['menu-categories'],
  queryFn: () => api.getMenuCategories(),
});

const { data: page } = useQuery({
  queryKey: ['page', slug],
  queryFn: () => api.getPage(slug),
});

const { data: settings } = useQuery({
  queryKey: ['settings'],
  queryFn: () => api.getSettings(),
  staleTime: Infinity,
});
```

---

## Section Rendering Pattern

```tsx
function SectionRenderer({ section }: { section: PageSection }) {
  switch (section.type) {
    case 'wide_image':
      return <WideImageSection content={section.content as WideImageContent} />;
    case 'tight_image':
      return <TightImageGrid content={section.content as TightImageContent} />;
    case 'video':
      return <VideoSection content={section.content as VideoContent} />;
    case 'reels':
      return <ReelsCarousel content={section.content as ReelsContent} />;
  }
}
```
