import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { site, branches, schedule } from './src/config/site.js';

/*
 * Builds the SEO structured data in index.html from src/config/site.js so the
 * restaurant's details only live in one place.
 */
function restaurantHead() {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const openingHours = Object.entries(schedule)
    .filter(([, s]) => s)
    .map(([d, s]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${dayNames[d]}`,
      opens: s.open,
      closes: s.close,
    }));
  const b = branches[0];
  const structured = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: site.legalName,
    url: site.url,
    logo: `${site.url}/icons/logo-256.png`,
    image: `${site.url}/images/gallery/hero-classic.webp`,
    telephone: b.phone,
    slogan: site.tagline,
    servesCuisine: ['Burgers', 'Sandwiches', 'Grilled chicken', 'Lebanese'],
    priceRange: '$',
    menu: `${site.url}/menu`,
    acceptsReservations: false,
    address: { '@type': 'PostalAddress', streetAddress: 'Main road', addressLocality: 'Al-Manara', addressRegion: 'West Bekaa', addressCountry: 'LB' },
    openingHoursSpecification: openingHours,
    sameAs: Object.values(site.social).map((s) => s.url),
  };

  return {
    name: 'restaurant-head',
    transformIndexHtml(html) {
      return html.replace('<!--structured-data-->', `<script type="application/ld+json">${JSON.stringify(structured)}</script>`);
    },
  };
}

export default defineConfig({
  plugins: [react(), restaurantHead()],
  build: { target: 'es2020' },
});
