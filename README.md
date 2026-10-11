# Zaher's Diner: website

Official website and online ordering for Zaher's (Tyre · Hamra · Batroun).
Built with React 19, React Router and Vite. No UI or animation libraries: styling is plain CSS with design tokens, animations use CSS and the Web Animations API.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

It's a single-page app: the host must serve `index.html` for every route. `public/_redirects` (Netlify) and `vercel.json` (Vercel) already do this.

## Updating content (no React knowledge needed)

| What | File |
| --- | --- |
| Phone numbers, WhatsApp, email, Instagram, branches, hours, map links | `src/config/site.js` |
| **Whish Money numbers** (one per branch, same as its WhatsApp) | `src/config/site.js` → each branch's `whish` |
| Delivery fee / minimum order | `src/config/site.js` → `ordering` |
| Feedback form destination (Formspree etc.) | `src/config/site.js` → `feedback.endpoint` |
| Items shown on the home page | `src/config/site.js` → `featuredItemIds` |
| Menu: items, prices, descriptions, photos, removable ingredients, options, add-ons | `src/data/menu.js` |
| Offers | `src/data/offers.js` |
| Food photos | `public/images/menu/` (square images, any size) |

Search engine data (schema.org structured data) and the splash logo are generated from `src/config/site.js` at build time.

## How ordering works

There is no ordering backend yet. When a customer places an order:

1. The order is saved in their browser and gets a number (e.g. `ZH-1011-4821`).
2. The confirmation page sends the full order to the chosen branch on **WhatsApp** (pre-written message). If a branch's `whatsapp` is ever cleared, it asks the customer to **call** instead.
3. The branch confirms by reply. For Whish payments, the customer transfers to the branch's Whish number (its WhatsApp number) and sends the screenshot with the order number. Payments are checked by staff, not automatically.

To connect a POS or backend later, change `placeOrder()` in `src/services/orders.js`.

## Still needed from the restaurant

- **Opening hours** for each branch (the site says "call the branch for today's hours" until then).
- **Street addresses / Google Maps links** for Tyre and Batroun (map buttons use a Maps search for now).
- **Delivery fee and areas** (currently "confirmed by the branch").
- **Facebook / TikTok links**, if any.
- **Original high-resolution food photos.** Current photos were cropped from screenshots of the existing site and Instagram. Items without photos show a branded placeholder.
- Menu items to confirm (marked with `review:` in `src/data/menu.js`):
  - *Crunchy Zinger Spicy*: description was cut off in the screenshot.
  - *Twister*: description was cut off in the screenshot.
  - *Zinger Spicy Sandwich*: price shows as "L8 $" on the current site, entered as $8.
- Which offers in `src/data/offers.js` are still running.
