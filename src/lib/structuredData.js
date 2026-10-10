import { categories, imageUrl, itemsIn } from '../data/menu'
import { restaurant } from '../config/restaurant'

/**
 * schema.org Menu generated from data/menu.js, so search engines see the
 * same items and prices as the page (the business itself is described
 * statically in index.html).
 */
export function injectMenuStructuredData() {
  const base = restaurant.siteUrl || window.location.origin
  const offer = (price) => ({ '@type': 'Offer', price, priceCurrency: restaurant.currency.code })
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: `${restaurant.fullName} menu`,
    inLanguage: ['en', 'ar'],
    url: `${base}/menu`,
    hasMenuSection: categories.map((c) => ({
      '@type': 'MenuSection',
      name: c.name.en,
      hasMenuItem: itemsIn(c.id).map((item) => ({
        '@type': 'MenuItem',
        name: item.name.en,
        ...(item.description && { description: item.description.en }),
        ...(item.image && { image: new URL(imageUrl(item.image), window.location.href).href }),
        offers: item.sizes ? item.sizes.map((s) => ({ ...offer(s.price), name: s.label.en })) : offer(item.price),
      })),
    })),
  }
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}
