# Qambri — Seafood Restaurant website

Official website for **Qambri (كامبري)**, a seafood restaurant on Dimass St, Barja, Lebanon.
Bilingual (English / Arabic with full RTL), mobile-first, with a menu, cart and checkout that sends orders to the restaurant on WhatsApp.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

Built with React 19, React Router and Vite. No UI or animation libraries — styles are plain CSS, animations use CSS and the Web Animations API.

## Updating content

Everything the restaurant may want to change lives in two files:

| What | Where |
| --- | --- |
| Phone, WhatsApp, email, address, Google Maps link | `src/config/restaurant.js` |
| Opening hours (`hours`) | `src/config/restaurant.js` |
| Social links (Instagram, Facebook, TikTok, Linktree) | `src/config/restaurant.js` → `social` |
| **Whish Money number** (`payments.whish`) | `src/config/restaurant.js` |
| Delivery fee (`ordering.deliveryFee`) | `src/config/restaurant.js` |
| Order / feedback backend URLs (`endpoints`) | `src/config/restaurant.js` |
| Menu items, prices, categories, ingredients, photos | `src/data/menu.js` |
| Interface text (English + Arabic) | `src/i18n/strings.js` |

Food photos are in `public/images/food/` (WebP + JPEG fallback). To give an item a photo, add `name.webp` and `name.jpg` there and set `image: 'name'` on the item in `menu.js`. Items without a photo show a clean branded placeholder.

### Not provided yet

These are intentionally left empty. The site handles them honestly until they're filled in:

- **Whish Money number** — `payments.whish: null`. The Whish option shows at checkout as "not available yet". Set it to e.g. `{ display: '79 000 000', raw: '79000000' }` to turn it on (the number is shown with a copy button).
- **Opening hours** — `hours: null`. The site asks customers to call or WhatsApp for today's hours.
- **Delivery fee** — `deliveryFee: null`. Shown as "Confirmed on WhatsApp".
- **Facebook / TikTok URLs** — `null`, so they aren't shown. Instagram and the Linktree are linked.
- **Google Maps** — currently a search link for the restaurant; replace with the exact place link.

## How ordering works

1. Customer builds an order (options, removed ingredients, extra sauces, notes).
2. At checkout they choose pickup or delivery, enter details and pick cash or Whish.
3. "Send order on WhatsApp" opens WhatsApp to the restaurant number with the full order written out (order number, items, totals, address, payment). Arabic orders also include the English menu names for the kitchen.
4. The confirmation page shows the order number, summary and contact options.

There is no automatic payment verification — Whish transfers are confirmed by the restaurant by hand. If a backend is added later, set `endpoints.order` and orders are also POSTed as JSON (see `src/lib/order.js`). Feedback works the same way through `endpoints.feedback` (e.g. a Formspree URL); until then it's sent via WhatsApp.

## Project structure

```
src/
  config/restaurant.js   restaurant details and settings
  data/menu.js           the menu
  i18n/                  strings (EN/AR) and the language/RTL provider
  context/               cart (persisted in localStorage) and overlay state
  lib/                   formatting, WhatsApp links, order building, fly-to-cart animation
  components/            header, tab bar, cart drawer, item sheet, footer…
  pages/                 Home, Menu, About, Contact, Checkout, OrderConfirmation
  styles/                tokens + base, layout, overlays, pages
```

## Deploying

Any static host works. `public/_redirects` is included for Netlify so client-side routes (`/menu`, `/checkout`…) resolve. For other hosts, configure a fallback to `index.html`.
