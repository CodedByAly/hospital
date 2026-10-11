# Khalifa Bites — website

Official website for **Khalifa Bites** — *The Original Lebanese Flavor* — on the Saida Highway, Lebanon.
Burgers, crispy chicken, subs, hot dogs and shawarma, with online ordering that hands the finished order to the restaurant on WhatsApp.

## Run it

```bash
cd khalifa-bites
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

React 19 + React Router + Vite. No UI or animation libraries — plain CSS and the Web Animations API.

## Where things live

| What | File |
| --- | --- |
| Phone / WhatsApp, address, Maps link, hours, social links, Whish number, delivery fee, backend URLs | `src/config/restaurant.js` |
| Menu: sections, items, prices, descriptions, sauce choices, removable ingredients, sizes | `src/data/menu.js` |
| Item photos (transparent WebP) | `public/images/menu/` |
| Instagram posters on the homepage | `public/images/posts/` + `src/components/InstagramGrid.jsx` |
| Logo (vector, from the menu PDF) | `public/images/logo.svg`, `logo-white.svg` |

### The menu

All 70 priced lines from the printed menu are in `src/data/menu.js`, with names, descriptions and USD prices exactly as printed. The item photos were extracted from the menu PDF itself and matched to each item by their position on the page.

- Where the menu offers a choice ("served with texas sauce or honey mustard sauce", Zinger "dunked in honey BBQ or buffalo sauce"), the item asks for it.
- Ingredients listed in a description can be removed ("No pickles").
- Small / Large / Markook shawarma and the 1 KG chicken / beef boxes are grouped as sizes of one product, each with its own price, photo and description.
- The menu has no priced add-ons, so none are offered.

To change a price, edit the `price` of that item (or variant). To add a photo, drop `name.webp` into `public/images/menu/` and set `image: 'name'`.

### Not provided yet

These are empty on purpose; the site handles them honestly until they're filled in `src/config/restaurant.js`:

- **Whish Money number** (`payments.whish`) — Whish shows as "not available online yet". Set `{ display: '76 000 000', raw: '76000000' }` to enable it (the number then shows with a copy button).
- **Opening hours** (`hours`) — customers are asked to call or WhatsApp.
- **Delivery fee** (`ordering.deliveryFee`) — shown as "Confirmed on WhatsApp".
- **Facebook / TikTok** — hidden until added. Instagram (@khalifa.bites) and WhatsApp are linked.
- **Exact address / Google Maps place link** — currently "Saida Highway, Saida" with a Maps search.

## How ordering works

1. The customer builds an order (size, sauce, removed ingredients, notes, quantity).
2. Checkout: pickup or delivery, contact details (validated), cash or Whish.
3. "Send order on WhatsApp" opens WhatsApp to 76 086 068 with the full order written out, and the confirmation page shows the order number and summary.

Payments are not verified automatically. If a backend is added later, set `endpoints.order` (and `endpoints.feedback`, e.g. a Formspree URL) and orders/feedback are also POSTed as JSON.

## Deploying

Upload `dist/` to any static host. `public/_redirects` (Netlify) keeps routes like `/menu` and `/checkout` working on refresh; on other hosts, add a fallback to `index.html`.
