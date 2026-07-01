# Frontend Architecture

> ✅ **Implemented** — Vite + React 19 + TypeScript + Tailwind v4.
> Dev server runs on `http://localhost:5173`, proxies API to `http://localhost:8000`.

## Project Structure

```
src/frontend/
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
    │   ├── client.ts             # Axios instance (?lang= interceptor)
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
    │       └── Loader.tsx           # Loading spinner
    ├── i18n/
    │   ├── context.tsx           # I18nProvider, useI18n, useTranslation
    │   └── translations.ts       # RO/EN/RU dictionaries (static strings)
    ├── lib/
    │   ├── contentData.ts        # Legacy static data (unused)
    │   └── menuData.ts           # Legacy static data (unused)
    ├── pages/
    │   ├── Menu.tsx              # Hero + MenuCategoryBar + MenuSection per category
    │   └── ContentPage.tsx       # Hero + SectionRenderer per section
    ├── types/
    │   └── api.ts                # TypeScript interfaces for all API responses
    └── utils/
        └── YoutubeVideos.ts      # YouTube ID extraction + auto thumbnail URL
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

## API Client

```typescript
// api/client.ts
const apiClient = axios.create({
  baseURL: "http://localhost:8000/api/v1/",
});

// Auto-append ?lang= from localStorage
apiClient.interceptors.request.use((config) => {
  const lang = localStorage.getItem("lang") || "ro";
  config.params = { ...config.params, lang };
  return config;
});

// api/endpoints
fetchMenuCategories()   → GET /menu/categories/
fetchContentPage(slug)  → GET /pages/{slug}/
fetchSettings()         → GET /settings/
fetchImages()           → GET /site-images/
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
| `VITE_API_URL` | Backend API base URL (unused — hardcoded in client.ts) | `http://localhost:8000` |

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| React 19 native `<title>` hoisting | No `react-helmet` dependency needed |
| Single `api/client.ts` with interceptor | Consistent language param on every request |
| `useI18n()` throws if used outside provider | Catches bugs during development |
| `dangerouslySetInnerHTML` for product descriptions | API returns raw HTML from TinyMCE |
| Hero content fetched from API (not static) | Content editors can change hero text via admin |
