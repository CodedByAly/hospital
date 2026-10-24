// Bakes the rendered page and schema.org data into dist/index.html so search engines and
// link previews see the full menu without running JavaScript. The browser then hydrates it.
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'
import { site } from '../src/data/site.js'
import { categories } from '../src/data/menu.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const serverDir = resolve(dist, '.server')
const { render } = await import(pathToFileURL(resolve(serverDir, 'entry-server.js')).href)

const structured = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: site.name,
  slogan: site.tagline,
  description: `${site.bio} ${site.specialties.join(', ')}. Delivery and pickup.`,
  telephone: site.phone.e164,
  address: {
    '@type': 'PostalAddress',
    addressCountry: site.countryCode,
    ...(site.town && { addressLocality: site.town }),
    ...(site.address && { streetAddress: site.address }),
  },
  ...(site.maps && { hasMap: site.maps }),
  servesCuisine: ['Sandwiches', 'Burgers', 'Lebanese'],
  priceRange: '$',
  paymentAccepted: 'Cash',
  currenciesAccepted: 'USD',
  acceptsReservations: false,
  sameAs: site.social.map((s) => s.href),
  ...(site.url && { url: site.url, image: `${site.url}/og-image.jpg` }),
  hasMenu: {
    '@type': 'Menu',
    name: `${site.name} menu`,
    hasMenuSection: categories.map((cat) => ({
      '@type': 'MenuSection',
      name: cat.title,
      hasMenuItem: cat.items.map((item) => ({
        '@type': 'MenuItem',
        name: item.name,
        description: item.desc,
        offers: { '@type': 'Offer', price: item.price.toFixed(2), priceCurrency: 'USD' },
      })),
    })),
  },
}

const json = JSON.stringify(structured).replace(/</g, '\\u003c')
const file = resolve(dist, 'index.html')
let html = readFileSync(file, 'utf8')
html = html
  .replace('<!--app-->', render())
  .replace('<!--structured-data-->', `<script type="application/ld+json">${json}</script>`)

if (site.url) {
  html = html.replace(
    '</title>',
    `</title>\n    <link rel="canonical" href="${site.url}/" />\n    <meta property="og:url" content="${site.url}/" />`,
  )
  html = html.replace('content="/og-image.jpg"', `content="${site.url}/og-image.jpg"`)
}

writeFileSync(file, html)
rmSync(serverDir, { recursive: true, force: true })
console.log('Prerendered dist/index.html')
