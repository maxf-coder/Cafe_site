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
| **Backend** | Django 6.x + Django REST Framework |
| **Frontend** | React 18 + Vite + TypeScript |
| **Database** | PostgreSQL |
| **Styling** | Tailwind CSS + shadcn/ui |
| **State Management** | TanStack Query (server state) + React Context (UI state) |
| **Routing** | React Router |
| **i18n** | Custom i18n context |
| **Hosting** | Render |
| **Media Storage** | Cloudinary (production), local media (development) |

## Project Structure

```
Cafe_site/
├── docs/                    # Project documentation
├── src/
│   └── backend/             # Django project
│       ├── cafe_project/    # Django settings & config
│       ├── menu/            # Menu app (categories, products)
│       ├── core/            # Core app (pages, settings, sections)
│       └── manage.py
│                              (frontend/ — not yet created)
└── README.md
```

## Features

### In Scope
- [ ] Menu page with categories and product cards (frontend not built)
- [ ] Product detail modal (click any card)
- [ ] About Us page (modular content sections)
- [ ] Outdoor Events page (modular content sections)
- [ ] Charity page (modular content sections)
- [ ] Language switcher (RO/EN/RU)
- [ ] Responsive navbar with phone CTA
- [ ] Footer with contact info, schedule, social links
- [x] Django Admin panel for content management (backend models + admin ready)
- [x] Site settings key-value store (model + admin ready)

**Status:** Backend API layer is complete — serializers, views, URLs, and drf-spectacular schema documentation are implemented and tested. Frontend is not yet built.

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

All section types inherit from `PageSection` (base model with `page`, `sort_order`, `is_published`). Querying uses `django-polymorphic` — `PageSection.objects.all()` automatically returns the correct child class instances (`WideImageSection`, `VideoSection`, etc.), so no manual type dispatch is needed in the ORM layer.

## Deployment (Planned)

- **Backend**: Django + Gunicorn on Render
- **Frontend**: Built React app served as static site on Render
- **Database**: Render PostgreSQL (currently local PostgreSQL)
- **Media**: Cloudinary for image storage (currently local `media/` folder)
- **Environment Variables**: Managed via `.env` locally, Render dashboard in production
