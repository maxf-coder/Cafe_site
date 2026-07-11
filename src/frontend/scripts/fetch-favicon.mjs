import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import sharp from 'sharp'

const API_URL = process.env.VITE_API_URL || ''

if (!API_URL) {
  console.warn('VITE_API_URL is not set — favicon fetch skipped.')
  process.exit(0)
}

const publicDir = resolve('public')
const imagesDir = resolve(publicDir, 'images')
if (!existsSync(imagesDir)) mkdirSync(imagesDir, { recursive: true })

const logoPath = resolve(imagesDir, 'logo.png')
const fallbackPath = resolve(imagesDir, 'placeholderLogo.png')
const BACKEND_ORIGIN = API_URL.replace(/\/api\/v1\/?$/, '')

async function main() {
  try {
    const resp = await fetch(`${API_URL}site-images/`)
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)

    const data = await resp.json()
    const logo = data?.logo

    if (!logo?.src) throw new Error('logo.src is missing or null')

    const src = logo.src.startsWith('http') ? logo.src : `${BACKEND_ORIGIN}${logo.src}`
    const imgResp = await fetch(src)

    if (!imgResp.ok) throw new Error(`Failed to fetch logo image: HTTP ${imgResp.status}`)

    let buffer = Buffer.from(await imgResp.arrayBuffer())
    const metadata = await sharp(buffer).metadata()
    if (metadata.width && metadata.height && metadata.width !== metadata.height) {
      const size = Math.min(metadata.width, metadata.height)
      const left = Math.floor((metadata.width - size) / 2)
      const top = Math.floor((metadata.height - size) / 2)
      buffer = await sharp(buffer).extract({ left, top, width: size, height: size }).toBuffer()
    }
    writeFileSync(logoPath, buffer)
    console.log(`Fetched favicon from backend → logo.png`)
  } catch (err) {
    if (existsSync(fallbackPath)) {
      writeFileSync(logoPath, readFileSync(fallbackPath))
      console.log(`Favicon fallback to placeholderLogo.png`)
    } else {
      console.warn(`Favicon fallback failed — placeholderLogo.png not found`)
    }
  }
}

main()