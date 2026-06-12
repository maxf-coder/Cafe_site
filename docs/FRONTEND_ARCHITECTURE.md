# Frontend Architecture

> **⚠️ NOT YET IMPLEMENTED — Target architecture for when the React frontend is built.**
> Currently no `src/frontend/` directory exists. This document is a planning reference.

## Project Structure

```
src/frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── src/
    ├── main.tsx              # App entry point
    ├── App.tsx               # Root component with routing
    ├── api/                  # API client
    │   ├── client.ts         # Axios instance
    │   └── endpoints.ts      # API endpoint functions
    ├── components/           # Reusable UI components
    │   ├── layout/           # Navbar, Footer, AppLayout
    │   ├── menu/             # MenuCategoryBar, MenuSection, ProductCard, ProductModal
    │   ├── content/          # WideImageSection, TightImageGrid, VideoSection, ReelsCarousel
    │   └── ui/               # shadcn/ui components
    ├── hooks/                # Custom React hooks
    │   └── use-mobile.tsx    # Mobile detection
    ├── lib/                  # Utilities
    │   ├── i18n.tsx          # Internationalization context
    │   ├── query-client.ts   # TanStack Query configuration
    │   ├── menuData.ts       # Menu data utilities
    │   └── contentData.ts    # Content data utilities
    └── pages/                # Page components
        ├── Meniu.tsx
        ├── DespreNoi.tsx
        ├── Evenimente.tsx
        └── Caritate.tsx
```

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI library |
| TypeScript | Type safety |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Accessible component library |
| React Router | Client-side routing |
| TanStack Query | Server state management |
| Axios | HTTP client |

---

## Routing

```tsx
<Routes>
  <Route element={<AppLayout />}>
    <Route path="/" element={<Meniu />} />
    <Route path="/despre-noi" element={<DespreNoi />} />
    <Route path="/evenimente" element={<Evenimente />} />
    <Route path="/caritate" element={<Caritate />} />
  </Route>
  <Route path="*" element={<PageNotFound />} />
</Routes>
```

---

## State Management

### Server State (TanStack Query)

Data from the API is managed by TanStack Query:

```typescript
// Fetch and cache menu categories
const { data: categories } = useQuery({
  queryKey: ['menu-categories'],
  queryFn: api.getMenuCategories,
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Fetch page content
const { data: page } = useQuery({
  queryKey: ['page', slug],
  queryFn: () => api.getPage(slug),
  staleTime: 5 * 60 * 1000,
});

// Fetch settings (cache forever)
const { data: settings } = useQuery({
  queryKey: ['settings'],
  queryFn: api.getSettings,
  staleTime: Infinity,
});
```

### UI State (React Context)

| Context | Purpose |
|---------|---------|
| `I18nProvider` | Language state (RO/EN/RU) and translation function |
| Local state | Modal open/close, expanded sections, etc. |

---

## i18n Approach

Custom React context-based i18n:

```typescript
interface I18nContextType {
  lang: 'ro' | 'en' | 'ru';
  setLang: (lang: 'ro' | 'en' | 'ru') => void;
  t: (path: string) => string;
}

// Usage:
const { t, lang, setLang } = useI18n();
const title = t('hero.title'); // Returns translated string
```

**Translation files** stored in `src/lib/translations/`:
- `ro.ts` - Romanian (default)
- `en.ts` - English
- `ru.ts` - Russian

**Fallback chain:** Missing translation → Romanian → placeholder key

**Persistence:** Language selection stored in `localStorage`

---

## Component Hierarchy

```
App
└── I18nProvider
    └── QueryClientProvider
        └── BrowserRouter
            └── AppLayout
                ├── Navbar
                │   ├── Logo
                │   ├── NavLinks
                │   ├── PhoneCTA
                │   └── LanguageSwitcher
                ├── Main Content (Routes)
                │   ├── Meniu
                │   │   ├── MenuHero
                │   │   ├── MenuCategoryBar
                │   │   ├── MenuSection (per category)
                │   │   │   └── ProductCard
                │   │   └── ProductModal
                │   ├── DespreNoi
                │   │   ├── ContentPageHero
                │   │   └── SectionRenderer
                │   │       ├── WideImageSection
                │   │       ├── TightImageGrid
                │   │       ├── VideoSection
                │   │       └── ReelsCarousel
                │   ├── Evenimente (same structure)
                │   └── Caritate (same structure)
                └── Footer
                    ├── ContactInfo
                    ├── Schedule
                    └── SocialLinks
```

---

## Section Rendering Pattern

Content pages use a dynamic section renderer:

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

---

## API Client

```typescript
// api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
});

// api/endpoints.ts
export const getMenuCategories = () => apiClient.get('/api/menu/categories/');
export const getPage = (slug: string) => apiClient.get(`/api/pages/${slug}/`);
export const getSettings = () => apiClient.get('/api/settings/');
```

---

## Styling

- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for accessible base components (Button, Dialog, Card, etc.)
- **Custom theme** in `tailwind.config.js` with cafe brand colors
- **Responsive design** with mobile-first breakpoints

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |
