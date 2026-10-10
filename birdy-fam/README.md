# Birdy Fam website

Restaurant website and online ordering for Birdy Fam (Achrafieh and Jal el Dib).
React 19 + Vite, no UI libraries.

## Run it

```bash
npm install
npm run dev       # local development
npm run build     # production build in dist/
npm run preview   # serve the production build
```

The site is a single-page app with three routes (`/`, `/checkout`, `/order-confirmed`).
`public/_redirects` (Netlify) and `vercel.json` (Vercel) send every path to `index.html`;
other hosts need the same "SPA fallback" rule.

## Where to change things

| What | File |
| --- | --- |
| Phone / WhatsApp number, Whish number, hours, branches, map links, Instagram, delivery fee, feedback endpoint | `src/data/restaurant.js` |
| Menu: categories, items, prices, descriptions, flavour choices, add-ons, removable ingredients, photos | `src/data/menu.js` |
| Colours, fonts, spacing | top of `src/styles/global.css` |
| Page title, description, social preview, Google structured data | `index.html` |

### Adding food photos
Put the image in `public/images/menu/` (WebP, about 1200px wide) and set `image: '/images/menu/<file>.webp'`
on the item in `src/data/menu.js`. Items without a photo show a branded placeholder.

## How ordering works
There is no server. At checkout the order is written out as a WhatsApp message to the restaurant
number and the customer presses send. Whish Money payments are checked by the team; the site shows
the Whish number and instructions but does not verify transfers.

The feedback form also goes through WhatsApp until `feedbackEndpoint` in `restaurant.js` is set to a
URL that accepts a JSON POST (e.g. Formspree, a Google Apps Script, or your own API).

## Still to confirm with the restaurant
- Delivery fee (`ordering.deliveryFee` is `null`, so the branch confirms it on WhatsApp).
- Food photos (none supplied yet).
- Facebook / TikTok accounts (only Instagram was provided).
- Live domain: update `siteUrl` in `restaurant.js` and make the URLs in `index.html` absolute.
- The pastry category is called "Pastries" because the printed pastry menu has no heading.
