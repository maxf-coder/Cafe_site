import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { fetchSettings } from '@/api/settings'
import { useI18n } from '@/i18n/context'

const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin

export default function RestaurantSchema() {
  const { lang } = useI18n()
  const { data: settings } = useQuery({
    queryKey: ["settings", lang],
    queryFn: fetchSettings,
  })

  if (!settings) return null

  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Fiesta Gastro Cafe",
    "image": settings.logo_url || "",
    "description": settings.mission || "",
    "telephone": settings.phone || "",
    "servesCuisine": "Internațională",
    "menu": `${SITE_URL}/`,
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings.address || "",
      "addressLocality": "",
      "addressRegion": "",
      "postalCode": "",
      "addressCountry": "MD"
    },
    "sameAs": [
      settings.instagram_link || "",
      settings.facebook_link || ""
    ].filter(Boolean),
    "openingHoursSpecification": []
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}