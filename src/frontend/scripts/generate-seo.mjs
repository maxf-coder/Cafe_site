import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'

const SITE_URL = process.env.VITE_SITE_URL || ''

if (!SITE_URL) {
  console.warn('VITE_SITE_URL is not set — sitemap.xml and robots.txt will not be generated.')
  process.exit(0)
}

const publicDir = resolve('public')
if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true })

// robots.txt
writeFileSync(resolve(publicDir, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`)

// sitemap.xml
writeFileSync(resolve(publicDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/content/despre-noi</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/content/evenimente-out-door</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/content/caritate</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
`)

console.log(`Generated robots.txt + sitemap.xml for ${SITE_URL}`)