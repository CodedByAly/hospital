# Chippy Restaurant website

Official website and online ordering for **Chippy Restaurant**, Hleliyeh (facing Queen Station), Saida.
"A Taste To Remember."

Built with React 18, React Router and Vite. No UI framework, no animation library. Styling is plain CSS with design tokens taken from the Chippy logo.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/ (homepage is prerendered)
npm run preview   # serve the build locally
```

Deploy `dist/` to Netlify. `public/_redirects` is already set up for the app routes.

## Where to change things

| What | File |
| --- | --- |
| Phone, WhatsApp, email, address, Maps link, Instagram, opening hours, Whish number, delivery fee, feedback endpoint, site URL | `src/config/restaurant.js` |
| Menu items, prices, descriptions, categories, removable ingredients, add-ons, photos | `src/data/menu.js` |
| Dish photos (cut-outs, transparent WebP) | `public/images/menu/<name>-480.webp` and `-960.webp` |
| Logo | `public/logo.svg`, `public/logo-light.svg` (footer), `public/favicon.svg` |
| SEO title, description, Open Graph, structured data | `index.html` |
| Colours and fonts | `src/styles/base.css` (`:root`) |

Values that were not provided yet are `null` in the config. The site hides or adapts those parts instead of showing invented details:

- `hours`: opening hours. Until set, the site asks customers to message on WhatsApp for today's hours.
- `whish.number`: Whish Money number. Until set, checkout tells the customer the number is sent with the WhatsApp confirmation. Once set, it is shown with a copy button.
- `ordering.deliveryFee`: until set, delivery shows "Confirmed on call" and totals are labelled "before delivery".
- `feedbackEndpoint`: until set, the feedback form opens the customer's email app addressed to the restaurant.
- `siteUrl`, plus the URLs in `index.html`, `robots.txt` and `sitemap.xml`: replace `chippy-restaurant.netlify.app` with the real domain.

## How ordering works

1. Customers build their order from the menu (options, removed ingredients, sides, kitchen notes, quantities). The cart is saved in the browser.
2. At checkout they choose delivery or pickup, enter their details and pick cash or Whish Money.
3. Placing the order opens WhatsApp with the full order written out, addressed to 78 703 770, and shows a confirmation page with the order number.

There is no payment gateway and no automatic payment check. Whish transfers are confirmed by the team.

## Project structure

```
src/
  config/restaurant.js   business details (single source of truth)
  data/menu.js           the menu
  context/               cart (persisted) and UI state
  components/            header, bottom bar, item sheet, cart drawer, ...
  sections/              homepage sections (hero, line-up, menu, about, contact, feedback)
  pages/                 home, checkout, confirmation, 404
  utils/                 prices, cart lines, order message, fly-to-cart animation
  styles/                CSS split by area
scripts/prerender.js     renders the homepage to static HTML after the build
```
