# Life Kitchen website

Website and online ordering for **Life Kitchen** (Dekwaneh). A non-profit kitchen built inside an NGO: *a bite for you, a bite for them*.

React 18 + Vite + React Router. No UI or animation libraries, just plain CSS (logical properties for RTL) and the Web Animations API.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview
```

When you deploy, set `VITE_SITE_URL=https://your-domain` so social previews and Google structured data use absolute links. SPA routing is already set up for Netlify (`public/_redirects`) and Vercel (`vercel.json`).

## Where to change things

| What | File |
| --- | --- |
| Phone, WhatsApp, hours, location, social links, **Whish number**, delivery fee, order/feedback endpoints | `src/config/restaurant.js` |
| Menu items, prices, categories, add-ons, removable ingredients, photos | `src/data/menu.js` |
| Plat du jour, meal plan, frozen boxes, student offer, mission text | `src/data/highlights.js` |
| All interface text (English / Arabic) | `src/i18n/en.js`, `src/i18n/ar.js` |
| Colours and fonts | top of `src/styles/global.css` |
| Logo vector | `src/assets/logoPaths.js`, `public/favicon.svg`, `public/images/` |

### Adding food photos
Put the image in `public/images/menu/` (WebP, about 1200px wide) and set `image: '/images/menu/<file>.webp'` on the item in `src/data/menu.js`. Items without a photo show a quiet branded placeholder.

## How orders work

There is no backend yet. At checkout the customer's order is opened in **WhatsApp**, addressed to the restaurant number with the whole order filled in (order number, items, add-ons, removed ingredients, pickup time or address, payment method). The restaurant confirms by replying.

To receive orders on a server instead, set `endpoints.orders` in `src/config/restaurant.js`. The order is then POSTed as JSON, and the confirmation page says so. Feedback works the same way through `endpoints.feedback` (Formspree-compatible).

Whish Money payments are **not verified automatically**. The customer is shown the number and asked to transfer; staff check the transfer by hand.

## Still needed from the restaurant

- **Whish Money number.** Empty for now, so checkout tells customers the number will be sent on WhatsApp.
- **Facebook page URL.** The page name is "Life Kitchen"; the link stays hidden until the URL is added. TikTok is the same.
- **Street address.** Only "Dekwaneh" and the Google Maps link are used.
- **Delivery fee and areas.** Shown as "confirmed on WhatsApp" until set.
- **Food photos** for menu items.
- **Original logo file** (SVG/AI). The current logo is a trace of the Instagram version.
- Confirm the WhatsApp number is `+961 3 525 615` (taken from the Instagram bio phone number).
- Confirm that add-ons / combo upgrade apply to sandwiches and burgers.
- Confirm the student offer (ALBA / Balamand) is still running.
