import { Helmet } from 'react-helmet-async'

interface SEOHelmetProps {
  title: string
  description?: string
  image?: string
  url?: string
  type?: string
}

const SITE_NAME = "Fiesta Gastro Cafe"
const DEFAULT_DESC = "Descoperă meniul nostru variat, evenimente speciale și atmosfera unică la Fiesta Gastro Cafe."

export default function SEOHelmet({ title, description, image, url, type = "website" }: SEOHelmetProps) {
  const fullTitle = `${title} | ${SITE_NAME}`
  const desc = description || DEFAULT_DESC
  const siteUrl = url || import.meta.env.VITE_SITE_URL || window.location.origin

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={siteUrl} />
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {image && <meta name="twitter:image" content={image} />}

      <link rel="canonical" href={siteUrl} />
    </Helmet>
  )
}