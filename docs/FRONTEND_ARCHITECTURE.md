# Frontend Architecture

> ✅ **Implemented** — Vite + React 19 + TypeScript + Tailwind v4.
> Dev server runs on `http://localhost:5173`, proxies API to `http://localhost:8000`.
> Production build runs in Docker (nginx:1.27-alpine), proxies `/api/` → backend.

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
    ├── main.tsx                  # Entry point (StrictMode → App)
    ├── App.tsx                   # QueryClientProvider + I18nProvider + BrowserRouter
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
    │   │   ├── AppLayout.tsx     # Shell: Navbar + <Outlet/> + Footer
    │   │   ├── Navbar.tsx        # Logo, links, phone CTA, language switcher
    │   │   └── Footer.tsx        # Mission, contact, schedule, socials, copyright
    │   ├── menu/
    │   │   ├── Hero.tsx          # Home page hero from content page API
    │   │   ├── MenuCategoryBar.tsx  # Sticky scrollspy category tabs
    │   │   ├── MenuSection.tsx      # Product grid per category
    │   │   ├── ProductCard.tsx      # Single product card
    │   │   └── ProductModal.tsx     # Full product detail (HTML description)
    │   └── shared/
    │       ├── Hero.tsx              # Page hero renderer (used by Menu + ContentPage)
    │       ├── Loader.tsx            # Loading spinner (bouncing coffee cup)
    │       ├── ErrorState.tsx        # Error display with optional retry button
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
| React 19 | UI library (native `<title>`, `<link>` hoisting) |
| TypeScript | Type safety |
| Vite | Build tool and dev server |
| Tailwind v4 | Utility-first CSS (no config file needed) |
| React Router v7 | Client-side routing |
| TanStack Query v5 | Server state management |
| Axios | HTTP client |
| framer-motion | Animations (product modal, hover effects) |
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

**Sync flow**: 
1. App mounts → `useState` reads `localStorage` 
2. Axios interceptor reads `localStorage` → appends `?lang=` to every request
3. User toggles → `setLangAndPersist` updates state + `localStorage`

---

## Component Hierarchy

```
App
└── QueryClientProvider
    └── I18nProvider
        └── BrowserRouter
            └── AppLayout
                ├── <link rel="icon"> (React 19 native, from images?.logo?.src)
                ├── Navbar
                │   ├── Logo (images?.logo?.src)
                │   ├── NavLinks (hardcoded routes)
                │   ├── PhoneCTA (settings?.phone)
                │   └── LanguageSwitcher (RO/EN/RU)
                ├── <Outlet /> — one of:
                │   ├── Menu (/) 
                │   │   ├── Hero (from page slug "meniu")
                │   │   ├── MenuCategoryBar (sticky scrollspy)
                │   │   ├── MenuSection × N (one per category)
                │   │   │   └── ProductCard × N
                │   │   └── ProductModal (overlay, HTML description)
                │   └── ContentPage (/content/:slug)
                │       ├── Hero (from page API)
                │       └── SectionRenderer × N
                │           ├── WideImageSection
                │           ├── TightImageGrid
                │           ├── VideoSection
                │           └── ReelsCarousel
                └── Footer
                    ├── Logo
                    ├── Mission text
                    ├── Contact (phone, email, address)
                    ├── Schedule (working_days, weekend_days)
                    ├── Social links (instagram, facebook)
                    └── Copyright
```

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
| `ReelsCarousel` | `hqdefault` (single) | 480×360 always exists, 2.7× oversampled at 180px card width — sharp enough |

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

// Auto-append ?lang= from localStorage
apiClient.interceptors.request.use((config) => {
  const lang = localStorage.getItem("lang") || "ro";
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

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| React 19 native `<title>` hoisting | No `react-helmet` dependency needed |
| Single `api/client.ts` with interceptor | Consistent language param on every request |
| `useI18n()` throws if used outside provider | Catches bugs during development |
| `dangerouslySetInnerHTML` for product descriptions | API returns raw HTML from TinyMCE |
| Hero content fetched from API (not static) | Content editors can change hero text via admin |
| YouTube thumbnail fallback via `naturalWidth > 120` | YouTube returns a 120×90 gray JPEG (not a network error) for missing `maxresdefault` — `onerror` never fires. `onload` + dimension check reliably detects the placeholder and falls back to `sddefault` or `hqdefault` |
