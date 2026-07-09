import { Helmet } from 'react-helmet-async'

interface SEOHelmetProps {
  title: string
  description?: string
  image?: string
  url?: string
  type?: string
}

const DEFAULT_DESC = "Descoperă meniul nostru variat, evenimente speciale și atmosfera unică la Fiesta Gastro Cafe."

export default function SEOHelmet({ title, description, url, type = "website" }: SEOHelmetProps) {
  const desc = description || DEFAULT_DESC
  const siteUrl = url || import.meta.env.VITE_SITE_URL || window.location.origin

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={desc} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={siteUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <link rel="canonical" href={siteUrl} />
    </Helmet>
  )
}