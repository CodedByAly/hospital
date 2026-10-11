import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { site, branches } from './src/config/site.js';

/*
 * Builds the SEO bits of index.html from src/config/site.js so contact details
 * only live in one place: structured data (schema.org Restaurant per branch)
 * and the inline splash logo (inline so it paints before the JS bundle loads).
 */
function restaurantHead() {
  const sameAs = Object.values(site.social).map((s) => s.url);
  const structured = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${site.url}/#org`,
        name: site.legalName,
        url: site.url,
        logo: `${site.url}/icons/icon-512.png`,
        email: site.email,
        slogan: site.tagline,
        foundingDate: String(site.since),
        sameAs,
      },
      ...branches.map((b) => ({
        '@type': 'Restaurant',
        '@id': `${site.url}/#${b.id}`,
        name: `${site.legalName} ${b.name}`,
        parentOrganization: { '@id': `${site.url}/#org` },
        url: `${site.url}/contact`,
        menu: `${site.url}/menu`,
        telephone: b.phone,
        servesCuisine: ['Burgers', 'Fried chicken', 'Sandwiches', 'Lebanese grill'],
        priceRange: '$',
        acceptsReservations: false,
        address: { '@type': 'PostalAddress', streetAddress: b.address, addressLocality: b.area, addressCountry: 'LB' },
        image: `${site.url}/images/hero-honey.webp`,
      })),
    ],
  };
  const wordmark = readFileSync(new URL('./src/assets/logo-full.svg', import.meta.url), 'utf8');

  return {
    name: 'restaurant-head',
    transformIndexHtml(html) {
      return html
        .replace('<!--structured-data-->', `<script type="application/ld+json">${JSON.stringify(structured)}</script>`)
        .replace('<!--splash-logo-->', wordmark.replace('role="img"', 'aria-hidden="true"'));
    },
  };
}

export default defineConfig({
  plugins: [react(), restaurantHead()],
  build: { target: 'es2020' },
});
