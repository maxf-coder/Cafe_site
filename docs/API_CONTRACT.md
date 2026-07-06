# API Contract

## Overview

The backend exposes read-only API endpoints. All responses are JSON. No authentication required.

**Base URL (manual dev):** `http://localhost:8000`
**Base URL (Docker Compose):** `http://localhost` (nginx proxies `/api/` → backend)
**Base URL (production):** Set `VITE_API_URL` at frontend build time (e.g., `https://api.yourdomain.com/api/v1/`)

---

## Language Parameter

All endpoints accept an optional `?lang=` query parameter:

| Value | Language |
|-------|----------|
| `ro` | Romanian (default) |
| `en` | English |
| `ru` | Russian |

If omitted, Romanian is used. Add it to every GET request: `?lang=ro`, `?lang=en`, `?lang=ru`.

---

## Endpoints

### 1. GET /api/v1/menu/categories/

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
        "img_src": "https://<r2-bucket>.r2.cloudflarestorage.com/cafe-media/menu/espresso.webp?X-Amz-Algorithm=...",
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

### 2. GET /api/v1/pages/{slug}/

Returns a published page with hero and all published sections.

**Request:** `GET /api/v1/pages/despre-noi/?lang=ro`

**Response:**
```json
{
  "name": "Despre noi",
  "slug": "despre-noi",
  "hero": {
    "main_text": "Povestea Noastră",
    "secondary_text": "Un loc unde gustul întâlnește comunitatea",
    "img_src": "https://<r2-bucket>.r2.cloudflarestorage.com/cafe-media/heroes/about.webp?X-Amz-Algorithm=...",
    "alt_text": "Echipa Fiesta Gastro Cafe"
  },
  "sections": [
    {
      "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
      "type": "wide_image",
      "content": {
        "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
        "title": "Bine ați venit la Fiesta",
        "short_description": "Servim pasiune în fiecare farfurie.",
        "full_description": "<p>Fondată în 2020, Fiesta Gastro Cafe...</p>",
        "img_src": "https://<r2-bucket>.r2.cloudflarestorage.com/cafe-media/sections/wide_image/welcome.webp?X-Amz-Algorithm=...",
        "alt_text": "Interiorul cafenelei"
      }
    },
    {
      "id": "d4e5f6a7-b8c9-0123-defa-234567890123",
      "type": "tight_image",
      "content": {
        "id": "d4e5f6a7-b8c9-0123-defa-234567890123",
        "title": "Echipa Noastră",
        "cards": [
          {
            "title": "Bucătar Maria",
            "short_description": "10 ani experiență în bucătăria italiană.",
            "full_description": "<p>Maria a studiat la Roma...</p>",
            "img_src": "https://<r2-bucket>.r2.cloudflarestorage.com/cafe-media/sections/tight_image/maria.webp?X-Amz-Algorithm=...",
            "alt_text": "Bucătarul Maria"
          }
        ]
      }
    },
    {
      "id": "e5f6a7b8-c9d0-1234-efab-345678901234",
      "type": "video",
      "content": {
        "id": "e5f6a7b8-c9d0-1234-efab-345678901234",
        "title": "În Spatele Scenei",
        "video_url": "https://www.youtube.com/embed/abc123",
        "description": "Uitați cum pregătim mâncarea voastră preferată."
      }
    },
    {
      "id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
      "type": "reels",
      "content": {
        "id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
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

### 3. GET /api/v1/settings/

Returns all site settings as a flat JSON object. Keys are defined in the database — the frontend expects the following keys to exist:

| Key | Purpose |
|-----|---------|
| `phone` | Phone number for order CTA |
| `email` | Contact email |
| `address` | Physical address |
| `working_days` | Weekday schedule text |
| `weekend_days` | Weekend schedule text |
| `mission` | Cafe mission statement |
| `facebook_link` | Facebook page URL |
| `instagram_link` | Instagram profile URL |
| `footer_copyright` | Copyright notice in footer |

**Example Response:**
```json
{
  "phone": "+40 7XX XXX XXX",
  "email": "contact@caferazesu.ro",
  "address": "Strada Exemplu, Nr. 1, București",
  "working_days": "Luni - Vineri: 08:00 - 22:00",
  "weekend_days": "Sâmbătă - Duminică: 10:00 - 00:00",
  "mission": "Servim pasiune în fiecare farfurie.",
  "facebook_link": "https://facebook.com/caferazesu",
  "instagram_link": "https://instagram.com/@caferazesu",
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
    
### 4. GET /api/v1/site-images/

Returns all site images as a flat object. Each value contains `src` (absolute URL) and `alt` (alt text). The frontend expects a `logo` key.

**Response:**
```json
{
  "logo": {
    "src": "https://<r2-bucket>.r2.cloudflarestorage.com/cafe-media/site/logo.webp?X-Amz-Algorithm=...",
    "alt": "Fiesta Gastro Cafe Logo"
  }
}
```

**TypeScript Interface:**
```typescript
interface SiteImageEntry {
  src: string;
  alt: string;
}

interface SiteImages {
  [key: string]: SiteImageEntry | null;
}
```

---

## Additional Endpoints

### 5. GET /api/v1/schema/ (DEBUG only)

Returns the raw OpenAPI schema as JSON. Used by Swagger UI.

### 6. GET /api/v1/docs/ (DEBUG only)

Swagger UI documentation interface with interactive endpoint testing. Includes a `lang` dropdown on every endpoint.

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
  id: string;
  title: string;
  short_description: string;
  full_description: string;
  img_src: string | null;
  alt_text: string;
}

interface TightImageCard {
  title: string;
  short_description: string;
  full_description: string;
  img_src: string | null;
  alt_text: string;
}

interface TightImageContent {
  id: string;
  title: string;
  cards: TightImageCard[];
}

interface VideoContent {
  id: string;
  title: string;
  video_url: string;
  description: string;
}

interface ReelItem {
  video_url: string;
}

interface ReelsContent {
  id: string;
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
| `/api/v1/menu/categories/` | 5 minutes | Categories and products change rarely |
| `/api/v1/pages/{slug}/` | 5 minutes | Content updates via admin |
| `/api/v1/settings/` | Until invalidation | Invalidate on settings change |
| `/api/v1/site-images/` | Until invalidation | Invalidate on image change |

---

## Frontend Usage Pattern

**API client** should auto-inject `?lang=` via Axios interceptor:

```typescript
apiClient.interceptors.request.use((config) => {
  const lang = getCurrentLang(); // read from URL or i18n context
  config.params = { ...config.params, lang };
  return config;
});
```

**TanStack Query keys** must include the current language:

```typescript
const { data: categories } = useQuery({
  queryKey: ['menu-categories', lang],
  queryFn: () => api.getMenuCategories(),
});

const { data: page } = useQuery({
  queryKey: ['page', slug, lang],
  queryFn: () => api.getPage(slug),
});

const { data: settings } = useQuery({
  queryKey: ['settings', lang],
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
      return <WideImageSection key={section.id} content={section.content} />;
    case 'tight_image':
      return <TightImageGrid key={section.id} content={section.content} />;
    case 'video':
      return <VideoSection key={section.id} content={section.content} />;
    case 'reels':
      return <ReelsCarousel key={section.id} content={section.content} />;
    default:
      return null;
  }
}
```
