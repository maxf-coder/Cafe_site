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
│   ├── backend/             # Django project
│   │   ├── cafe_project/    # Django settings & config
│   │   ├── menu/            # Menu app (categories, products)
│   │   ├── core/            # Core app (pages, settings, sections)
│   │   └── manage.py
│   └── frontend/            # React application
│       ├── src/
│       │   ├── api/         # API client
│       │   ├── components/  # Reusable UI components
│       │   ├── hooks/       # Custom React hooks
│       │   ├── lib/         # Utilities (i18n, query client)
│       │   └── pages/       # Page components
│       └── package.json
└── README.md
```

## Features

### In Scope
- [x] Menu page with categories and product cards
- [x] Product detail modal (click any card)
- [x] About Us page (modular content sections)
- [x] Outdoor Events page (modular content sections)
- [x] Charity page (modular content sections)
- [x] Language switcher (RO/EN/RU)
- [x] Responsive navbar with phone CTA
- [x] Footer with contact info, schedule, social links
- [x] Django Admin panel for content management
- [x] Site settings management (phone, email, address, etc.)

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

All content pages (About, Events, Charity) use modular sections:

| Type | Description |
|------|-------------|
| **Wide Image** | Full-width image with title and expandable description |
| **Tight Image Grid** | Grid of cards with images, titles, and expandable descriptions |
| **Video** | Embedded YouTube/Vimeo video with title and description |
| **Reels Carousel** | Horizontal scrollable carousel of short-form videos |

## Deployment

- **Backend**: Django + Gunicorn on Render
- **Frontend**: Built React app served as static site on Render
- **Database**: Render PostgreSQL
- **Media**: Cloudinary for image storage
- **Environment Variables**: Managed via Render dashboard
