// Bakes the rendered page and schema.org data into dist/index.html so search engines and
// link previews see the full menu without running JavaScript. The browser then hydrates it.
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'
import { site } from '../src/data/site.js'
import { menu, formatPrice } from '../src/data/menu.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const serverDir = resolve(dist, '.server')

const { render } = await import(pathToFileURL(resolve(serverDir, 'entry-server.js')).href)

const offer = (price, name) => ({
  '@type': 'Offer',
  price: formatPrice(price),
  priceCurrency: site.currency,
  ...(name && { name }),
})

const structured = {
  '@context': 'https://schema.org',
  '@type': 'CafeOrCoffeeShop',
  name: site.name,
  slogan: site.tagline,
  description: `${site.bio}. Coffee house in ${site.town}, ${site.country}.`,
  telephone: site.phone.e164,
  address: {
    '@type': 'PostalAddress',
    addressLocality: site.town,
    addressCountry: site.countryCode,
  },
  hasMap: site.maps,
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: site.hours.opens,
    closes: site.hours.closes === '24:00' ? '23:59' : site.hours.closes,
  },
  servesCuisine: ['Coffee', 'Desserts', 'Sandwiches', 'Salads'],
  acceptsReservations: false,
  sameAs: site.social.map((s) => s.href),
  ...(site.url && { url: site.url, image: `${site.url}/og-image.jpg` }),
  hasMenu: {
    '@type': 'Menu',
    name: `${site.name} menu`,
    hasMenuSection: menu.map((cat) => ({
      '@type': 'MenuSection',
      name: cat.title,
      hasMenuItem: cat.items.map((item) => ({
        '@type': 'MenuItem',
        name: item.name,
        offers: item.prices
          ? item.prices.map((p, i) => offer(p, cat.sizes?.length === item.prices.length ? cat.sizes[i] : undefined))
          : offer(item.price),
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
