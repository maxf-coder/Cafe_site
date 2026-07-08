# Frontend Architecture

> ✅ **Implemented** — Vite + React 19 + TypeScript + Tailwind v4.
> Dev server runs on `http://localhost:5173`, proxies API to `http://localhost:8000`.
> Production build runs in Docker (nginx:1.27-alpine) or Render Static Site.
> On Docker: nginx proxies `/api/` → backend. On Render: frontend calls backend directly via CORS.

## Project Structure

```
src/frontend/
├── .dockerignore                # Excludes node_modules, .env from Docker build
├── Dockerfile                   # Multi-stage: node:22-alpine build → nginx:1.27-alpine serve
├── nginx.conf                   # Proxies /api/, /cafe-admin/, /static/ → backend:8000
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── src/
    ├── main.tsx                  # Entry point (HelmetProvider → StrictMode → App)
    ├── App.tsx                   # QueryClientProvider + BrowserRouter + I18nProvider + Routes
    ├── index.css                 # Tailwind v4 import (@import "tailwindcss")
    ├── api/                      # API client layer
    │   ├── client.ts             # Axios instance (?lang= interceptor, env var validation)
    │   ├── contentPages.ts       # fetchContentPage(slug)
    │   ├── images.ts             # fetchImages()
    │   ├── menuCategories.ts     # fetchMenuCategories()
    │   └── settings.ts           # fetchSettings()
    ├── components/
    │   ├── content/              # Content page sections
    │   │   ├── SectionRenderer.tsx
    │   │   ├── WideImageSection.tsx
    │   │   ├── TightImageGrid.tsx
    │   │   ├── VideoSection.tsx
    │   │   └── ReelsCarousel.tsx
    │   ├── layout/
    │   │   ├── AppLayout.tsx     # Shell: Helmet + RestaurantSchema + Navbar + <Outlet/> + Footer
    │   │   ├── Navbar.tsx        # Logo, links, phone CTA, language switcher
    │   │   └── Footer.tsx        # Mission, contact, schedule, socials, credits, copyright
    │   ├── menu/
    │   │   ├── MenuCategoryBar.tsx  # Sticky scrollspy category tabs
    │   │   ├── MenuSection.tsx      # Product grid per category
    │   │   ├── ProductCard.tsx      # Single product card
    │   │   ├── ProductModal.tsx     # Full product detail (HTML description)
    │   │   └── Hero.tsx          # REMOVED — Hero moved to shared/
    │   ├── seo/                  # Search engine optimization
    │   │   ├── SEOHelmet.tsx       # Per-page title, meta, OG, Twitter, canonical, hreflang
    │   │   └── RestaurantSchema.tsx # JSON-LD LocalBusiness/Restaurant structured data
    │   └── shared/
    │       ├── Hero.tsx              # Page hero renderer (used by Menu + ContentPage)
    │       ├── Loader.tsx            # Loading spinner (bouncing coffee cup)
    │       ├── ErrorState.tsx        # Error display with optional retry button
    │       ├── ImageWithSkeleton.tsx # Lazy image with shimmer skeleton placeholder
    │       └── YoutubeThumbnail.tsx  # YouTube thumbnail with auto-fallback chain
    ├── i18n/
    │   ├── context.tsx           # I18nProvider, useI18n, useTranslation
    │   └── translations.ts       # RO/EN/RU dictionaries (static strings)
    ├── pages/
    │   ├── Menu.tsx              # Hero + MenuCategoryBar + MenuSection per category
    │   └── ContentPage.tsx       # Hero + SectionRenderer per section
    ├── types/
    │   └── api.ts                # TypeScript interfaces for all API responses
    └── utils/
        └── YoutubeVideos.ts      # YouTube ID extraction, embed URL builder, thumbnail URL builder with configurable size
```

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI library |
| TypeScript | Type safety |
| Vite | Build tool and dev server |
| Tailwind v4 | Utility-first CSS (no config file needed) |
| React Router v7 | Client-side routing |
| TanStack Query v5 | Server state management |
| Axios | HTTP client |
| react-helmet-async | Dynamic `<head>` management (title, meta, OG, canonical, hreflang) |
| framer-motion | Animations (product modal, hover effects, scroll animations) |
| lucide-react | Icons (Phone, Mail, MapPin, Globe, etc.) |

---

## Routing

```tsx
<Routes>
  <Route element={<AppLayout />}>
    <Route index element={<Menu />} />                    {/* / */}
    <Route path="/content/:slug" element={<ContentPage />} />  {/* /content/despre-noi */}
  </Route>
</Routes>

> **Note**: On Render Static Site (no nginx proxy), `VITE_API_URL` points to the backend URL directly.
> On Docker + nginx, it points to `/api/v1/` (relative, proxied by nginx).
```

Only 2 routes:
- `/` — Menu page (fetches page slug `meniu` for its hero)
- `/content/:slug` — Dynamic content page (fetches page by slug from path)

All navigations are hardcoded in `Navbar.tsx`:
- `/` — Menu
- `/content/despre-noi` — About
- `/content/evenimente-out-door` — Events
- `/content/caritate` — Charity

---

## State Management

### Server State (TanStack Query)

All API data fetched via `useQuery` with these cache strategies:

| Component | Query Key | staleTime | Re-fetches |
|-----------|-----------|-----------|------------|
| Menu page | `["menu", lang]` | 5 min | On language switch |
| Menu page | `["page", "meniu", lang]` | 5 min | On language switch |
| ContentPage | `["page", slug, lang]` | 5 min | On slug/lang change |
| Navbar, Footer | `["settings", lang]` | Infinity | Never (manual invalidate) |
| Navbar, Footer, AppLayout | `["images"]` | Infinity | Never (manual invalidate) |

### UI State (React Context)

| Context | Purpose |
|---------|---------|
| `I18nProvider` | Language (`ro`/`en`/`ru`), setLang, t() translation function |
| Local state | Modal open/close, expanded sections, scroll position, etc. |

---

## i18n Approach

Custom React context-based i18n with static dictionaries:

```typescript
// context.tsx — provides:
{ lang, setLang, t }
// t("nav.menu") → "Meniu" / "Menu" / "Меню"
```

**Translation files**: `src/i18n/translations.ts` — single file with `ro`, `en`, `ru` objects.

**Fallback chain**: missing key → Romanian → key name as fallback.

**Persistence**: Language written to `localStorage("lang")` via `setLangAndPersist`.

**API sync**: `setLangAndPersist` also calls `setApiLang(lang)` from `api/client.ts` — a module-level variable that the Axios interceptor reads (faster than reading `localStorage` on every request).

**Sync flow**: 
1. App mounts → `useState` reads `localStorage`
2. Axios interceptor reads module-level `_lang` (or `localStorage` fallback) → appends `?lang=` to every request
3. User toggles → `setLangAndPersist` updates state + `localStorage` + api client `_lang`

---

## Component Hierarchy

```
main.tsx
└── HelmetProvider
    └── App
        └── QueryClientProvider
            └── I18nProvider
                └── BrowserRouter
                    └── AppLayout
                        ├── RestaurantSchema (JSON-LD)
                        ├── Helmet (html lang, favicon from images?.logo?.src)
                        ├── Skip-to-content link
                        ├── Navbar
                        │   ├── Logo (ImageWithSkeleton with images?.logo?.src)
                        │   ├── NavLinks (hardcoded routes)
                        │   ├── PhoneCTA (settings?.phone)
                        │   └── LanguageSwitcher (RO/EN/RU, with aria-pressed)
                        ├── <main id="main-content"> → <Outlet /> — one of:
                        │   ├── Menu (/)
                        │   │   ├── SEOHelmet (title, meta, OG, canonical)
                        │   │   ├── Hero (ImageWithSkeleton, from page slug "meniu")
                        │   │   ├── MenuCategoryBar (sticky scrollspy)
                        │   │   ├── MenuSection × N (one per category)
                        │   │   │   └── ProductCard × N (ImageWithSkeleton)
                        │   │   └── ProductModal (ImageWithSkeleton, overlay, HTML description)
                        │   └── ContentPage (/content/:slug)
                        │       ├── SEOHelmet (title, meta, OG, canonical, hreflang)
                        │       ├── Hero (ImageWithSkeleton, from page API)
                        │       └── SectionRenderer × N
                        │           ├── WideImageSection (ImageWithSkeleton)
                        │           ├── TightImageGrid (ImageWithSkeleton)
                        │           ├── VideoSection (YoutubeThumbnail → ImageWithSkeleton)
                        │           └── ReelsCarousel (YoutubeThumbnail → ImageWithSkeleton)
                        └── Footer
                            ├── Logo (ImageWithSkeleton)
                            ├── Mission text
                            ├── Contact (phone, email, address)
                            ├── Schedule (working_days, weekend_days)
                            ├── Social links (instagram, facebook)
                            ├── Credits section (developer_name, github, linkedin, email, disclaimer)
                            └── Copyright
```

---

---

## SEO Architecture

### Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `SEOHelmet` | `components/seo/SEOHelmet.tsx` | Accepts `{title, description?, image?, url?, type?}`. Renders `<title>`, `<meta description>`, OG/Twitter tags, `<link rel="canonical"` in `<head>` via Helmet. Falls back to `VITE_SITE_URL` or `window.location.origin` for canonical URL. |
| `RestaurantSchema` | `components/seo/RestaurantSchema.tsx` | Fetches settings from API, renders `<script type="application/ld+json">` with `@type: Restaurant` schema (name, image, telephone, address, servesCuisine, menu, sameAs, openingHours). Rendered once in `AppLayout`. |

### Per-Page Usage

| Page | Component | Title | Description |
|------|-----------|-------|-------------|
| Menu (`/`) | `SEOHelmet` in `Menu.tsx` | "Meniu \| Fiesta Gastro Cafe" | Static RO text |
| ContentPage (`/content/:slug`) | `SEOHelmet` in `ContentPage.tsx` | `{page.name} \| Fiesta Gastro Cafe` | From page API `name` field |

### Additional Head Elements

- **`AppLayout.tsx`** — `<Helmet htmlAttributes={{ lang }}>` sets `<html lang="...">` dynamically on language switch
- **`AppLayout.tsx`** — `<Helmet link rel="icon">` renders favicon from `images?.logo?.src` (or fallback)
- **`public/robots.txt`** — Generated by `scripts/generate-seo.mjs` at build time from `VITE_SITE_URL`
- **`public/sitemap.xml`** — Same script, lists all 4 pages with weekly/monthly change frequency
- **Hreflang**: `SEOHelmet` renders `<link rel="alternate" hreflang="ro/en/ru">` for each language (future: language-in-URL routing required for full effectiveness)

---

## Image Loading Pattern

`ImageWithSkeleton` is used for all images across the site. It renders an `<img>` with:

- **CSS shimmer background**: `linear-gradient(135deg, ...)` — diagonal gray with a light reflection band
- **Animation**: `@keyframes shimmer` slides the gradient from bottom-right to top-left
- **Transition**: `opacity-0 → opacity-100` on `onload` (300ms fade)
- **No wrapper div**: The shimmer is the `<img>`'s own `background` — layout is unaffected, works with any parent sizing
- **width/height attributes**: Set on every image to prevent Cumulative Layout Shift (CLS)

```tsx
<ImageWithSkeleton
  src={src}
  alt={alt}
  width="400"
  height="300"
  loading="lazy"
  fetchPriority="high"
  className="w-full h-full object-cover"
/>
```

Images that use `ImageWithSkeleton`:

| File | Dimensions | Notes |
|------|-----------|-------|
| `Hero.tsx` | 1920×1080 | `fetchPriority="high"`, no lazy |
| `Navbar.tsx` | 48×48 | Logo, square |
| `Footer.tsx` | 48×48 | Logo, square |
| `ProductCard.tsx` | 400×300 | Product thumbnail |
| `ProductModal.tsx` | 600×450 | Product detail |
| `WideImageSection.tsx` | 1200×525 | Content section image |
| `TightImageGrid.tsx` | 600×450 | Card image |
| `YoutubeThumbnail.tsx` | 480×360 | YouTube video thumbnail |

---

## Section Rendering Pattern

```tsx
function SectionRenderer({ section }: { section: PageSection }) {
  switch (section.type) {
    case 'wide_image':
      return <WideImageSection key={section.id} content={section.content} />;
    case 'tight_image_grid':
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

Each section component receives `key` prop from `section.id` for stable reconciliation. Content types match the API contract's `section.type` field.

---

## YouTube Thumbnail Fallback

### The Problem

`maxresdefault.jpg` (1280×720) is not generated for all videos. When missing, YouTube returns a **120×90 gray placeholder** with a valid JPEG body and HTTP 404. The browser fires `onload`, not `onerror` — so `onerror`-based fallbacks silently fail.

### Solution: `YoutubeThumbnail` Component

Located at `src/components/shared/YoutubeThumbnail.tsx`. Renders an `<img>` with a **fallback chain** of thumbnail sizes. On `onload`, checks `img.naturalWidth > 120` to distinguish a real thumbnail from the gray placeholder. If placeholder → advances to the next size in the chain.

```tsx
type ThumbnailSize = 'maxresdefault' | 'sddefault' | 'hqdefault' | 'mqdefault' | 'default'

<YoutubeThumbnail
  videoUrl={url}
  sizes={['maxresdefault', 'sddefault', 'hqdefault']}  // fallback chain, highest first
  className="..."
  alt="..."
/>
```

### Fallback Chains Used

| Component | Chain | Behavior |
|-----------|-------|----------|
| `VideoSection` | `maxresdefault` → `sddefault` → `hqdefault` | Tries HD first, falls back to SD (640×480), then guaranteed HQ (480×360) |
| `ReelsCarousel` | `sddefault` → `hqdefault` | 640×480 for most reels, falls back to guaranteed 480×360 |

### Size Reference

| Filename | Resolution | Aspect | Availability |
|----------|-----------|--------|-------------|
| `maxresdefault` | 1280×720 | 16:9 | ~90% of videos |
| `sddefault` | 640×480 | 4:3 | ~99% of videos |
| `hqdefault` | 480×360 | 4:3 letterboxed | **100%** |
| `mqdefault` | 320×180 | 16:9 | 100% |
| `default` | 120×90 | 4:3 | 100% |

The `getYoutubeTumbnailUrl(video_url, size)` utility in `YoutubeVideos.ts` accepts an optional `size` parameter (defaults to `maxresdefault`).

---

## Loading / Error States

Both `Menu.tsx` and `ContentPage.tsx` use the same pattern:

```tsx
if (isLoading) return <Loader />
if (isError) return <ErrorState message={t('error.page')} onRetry={() => refetch()} />
```

- **Loader** — full-height centered column with a bouncing coffee cup icon (framer-motion) + loading text
- **ErrorState** — full-height centered column with `AlertCircle` icon, message, and optional "Try again" button that calls `refetch()`
- **ImageWithSkeleton** — per-image shimmer skeleton while each image loads independently (see [Image Loading Pattern](#image-loading-pattern))

Translation keys in `common.loading` and `error.*` (RO/EN/RU).

---

## API Client

```typescript
// api/client.ts
const apiBaseUrl = import.meta.env.VITE_API_URL;
if (!apiBaseUrl) {
  throw new Error("VITE_API_URL is required. Set it in .env or pass as --build-arg in Docker.");
}

const apiClient = axios.create({
  baseURL: apiBaseUrl,
});

// Module-level lang — faster than reading localStorage on every request
let _lang = "ro";
export function setApiLang(lang: string) { _lang = lang; }

// Auto-append ?lang= from module variable (fallback to localStorage)
apiClient.interceptors.request.use((config) => {
  const lang = _lang || localStorage.getItem("lang") || "ro";
  config.params = { ...config.params, lang };
  return config;
});

// api/endpoints (no leading / — baseURL includes /api/v1/)
fetchMenuCategories()   → GET menu/categories/
fetchContentPage(slug)  → GET pages/{slug}/
fetchSettings()         → GET settings/
fetchImages()           → GET site-images/
```

---

## Styling

- **Tailwind v4** — utility-first CSS, no `tailwind.config.js` (v4 uses CSS-based config via `@import "tailwindcss"`)
- **Custom classes** in `index.css`: `rounded-squircle`, Tailwind prose for HTML descriptions
- **framer-motion** — product modal overlay animation, card hover effects
- **Responsive breakpoints**: mobile-first, `lg:` at 1024px for navbar height change

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL (Vite bakes it into the bundle at build time) | (required — build fails if missing) |
| `VITE_SITE_URL` | Canonical site URL for SEO (og:url, canonical, hreflang, sitemap) | Falls back to `window.location.origin` |

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| `react-helmet-async` for head management | Properly renders `<title>`, `<meta>`, OG, Twitter, canonical, hreflang tags in `<head>`. React 19's native `<title>` renders in `<body>`, invisible to crawlers. Helmet manages deduplication automatically. |
| Single `api/client.ts` with module-level `_lang` + interceptor | Faster than reading localStorage on every request. `setApiLang()` called on language switch keeps the Axios interceptor in sync. |
| `useI18n()` throws if used outside provider | Catches bugs during development |
| `dangerouslySetInnerHTML` for product descriptions | API returns raw HTML from TinyMCE. Sanitization pending. |
| Hero content fetched from API (not static) | Content editors can change hero text via admin |
| `ImageWithSkeleton` for lazy images | CSS-only shimmer gradient background on `<img>` (no wrapper div). Diagonal animation from `@keyframes shimmer`. Zero Cumulative Layout Shift (CLS) via aspect ratio awareness. |
| YouTube thumbnail fallback via `naturalWidth > 120` | YouTube returns a 120×90 gray JPEG (not a network error) for missing `maxresdefault` — `onerror` never fires. `onload` + dimension check reliably detects the placeholder and falls back to next size in chain. |
