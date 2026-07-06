# Fiesta Gastro Cafe - Project Overview

## Project Description

A multi-language (Romanian, English, Russian) website for Fiesta Gastro Cafe. The site presents the cafe's menu, brand story, event capabilities, and community involvement in a clear, engaging digital format.

**Target Users:**
- Local customers browsing the menu and placing phone orders
- Event planners seeking outdoor venue information
- Community members interested in charitable initiatives
- Tourists or new residents discovering the cafe

## Core Goals

1. Enable users to browse the full menu by category with quick access to item details
2. Provide clear information about the cafe's identity, values, and activities
3. Facilitate immediate contact for orders via prominently displayed phone number
4. Support three languages (RO/EN/RU) with seamless switching
5. Deliver a consistent experience across desktop, tablet, and mobile

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Django 6.0 + DRF + Whitenoise + Gunicorn + django-modeltranslation + django-polymorphic + django-cleanup + adminsortable2 + django-tinymce |
| **Frontend** | React 19 + Vite + TypeScript + Tailwind v4 + framer-motion + lucide-react |
| **Database** | PostgreSQL |
| **State Management** | TanStack Query (server state) + React Context (UI state / i18n) |
| **Routing** | React Router v7 |
| **i18n** | django-modeltranslation (backend) + Custom React Context (frontend) |
| **Hosting** | Docker Compose → Render Web Service (backend) + Render Static Site (frontend) |
| **Media Storage** | Cloudflare R2 via django-storages[s3] |

## Project Structure

```
Cafe_site/
├── docker-compose.yml           # 3 services: db, backend, frontend
├── docs/                        # Project documentation
├── src/
│   ├── backend/                 # Django project
│   │   ├── .dockerignore
│   │   ├── Dockerfile           # Multi-stage, uv-based, non-root user
│   │   ├── entrypoint.sh        # Migrations → Gunicorn
│   │   ├── cafe_project/        # Settings, urls, middleware
│   │   ├── menu/                # Menu app (categories, products, translations)
│   │   ├── core/                # Core app (pages, sections, settings, translations)
│   │   ├── logs/                # Rotating log files (auto-created)
│   │   └── manage.py
│   └── frontend/                # React project (Vite + TypeScript + Tailwind)
│       ├── .dockerignore
│       ├── Dockerfile           # Multi-stage, nginx:1.27-alpine
│       ├── nginx.conf           # Proxy /api/, /cafe-admin/, /static/ → backend
│       ├── src/
│       │   ├── api/             # Axios client + endpoint functions
│       │   ├── components/      # layout, menu, content, shared components
│       │   ├── i18n/            # Translation context + RO/EN/RU dicts
│       │   ├── pages/           # Menu.tsx, ContentPage.tsx
│       │   ├── types/           # TypeScript interfaces
│       │   └── utils/           # Helpers
│       ├── vite.config.ts
│       └── package.json
└── README.md
```

## Features

### In Scope
- [x] Menu page with categories and product cards (frontend built)
- [x] Product detail modal (click any card)
- [x] About Us page (modular content sections from API)
- [x] Outdoor Events page (modular content sections from API)
- [x] Charity page (modular content sections from API)
- [x] Language switcher (RO/EN/RU)
- [x] Responsive navbar with phone CTA
- [x] Footer with contact info, schedule, social links
- [x] Django Admin panel for content management
- [x] Site settings key-value store (model + admin + endpoint)
- [x] Site images key-image store (model + admin + endpoint)
- [x] Multi-language content model (RO/EN/RU via django-modeltranslation)
- [x] API endpoint language switching (?lang= query parameter)
- [x] Request logging (console + rotating file)
- [x] Admin protections (slugs locked on edit, pages undeletable)

### Out of Scope
- [ ] Online ordering or shopping cart
- [ ] User registration/login (except admin)
- [ ] Table reservation system
- [ ] Real-time chat or support widget
- [ ] Payment processing or donation forms
- [ ] User-generated content (reviews, comments)
- [ ] Dynamic pricing or inventory sync
- [ ] Push notifications or email subscriptions
- [ ] Multi-location support

## Content Section Types

All content pages (About, Events, Charity) use modular sections with **multi-table inheritance**:

| Type | Model | Description |
|------|-------|-------------|
| **Wide Image** | `WideImageSection` | Full-width image with title, description, expandable rich text |
| **Tight Image Grid** | `TightImageSection` + `TightImageCard` | Grid of cards with images, titles, and expandable descriptions |
| **Video** | `VideoSection` | Embedded YouTube/Vimeo video with title and description |
| **Reels Carousel** | `ReelsSection` + `ReelItem` | Horizontal scrollable carousel of short-form videos |

All section types inherit from `PageSection` (base model with `page`, `sort_order`, `is_published`). The `Page.published_sections` property filters `is_published=True` and returns proper child class instances via `django-polymorphic` — no manual type dispatch needed in the ORM layer.

## Multi-Language Architecture

Content is stored in three language columns per field (`name_ro`, `name_en`, `name_ru`) via `django-modeltranslation`. The active language is selected by a `?lang=ro|en|ru` query parameter on every API request. Slugs are **not** translated — they remain in Romanian as permanent URL identifiers.

See `docs/BACKEND_ARCHITECTURE.md` for the full language configuration.

## Deployment

The project runs in Docker Compose with 3 services (`db`, `backend`, `frontend`). Deploy to Render:

- **Backend**: Django + Gunicorn in Docker via Render Web Service
- **Frontend**: Built React app served via nginx in Docker via Render Static Site
- **Database**: Render PostgreSQL (or Docker Compose `db` service in development)
- **Media**: Cloudflare R2 (S3-compatible object storage, signed URLs)
- **Environment Variables**: `.env` files locally, Render dashboard in production

### Quick Start
```bash
docker compose build
docker compose up -d
```

See `docs/BACKEND_ARCHITECTURE.md` for caching, rate limiting, and production settings.
