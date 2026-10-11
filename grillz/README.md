# Grillz — website

Official website for **Grillz** — *Burger. Done right.* — premium burgers & wraps near Beirut Arab University, Lebanon.

## Run it

```bash
cd grillz
npm install
npm run dev            # http://localhost:5173
npm run build          # production build in dist/
npm run build:preview  # dist-preview/ — works from any sub-path (static previews)
```

React 19 + React Router + Vite. No UI or animation libraries.

## Where things live

| What | File |
| --- | --- |
| Phone/WhatsApp, address, Maps link, hours, social links, Whish number, delivery fee | `src/config/restaurant.js` |
| Menu, prices, descriptions, removable ingredients, add-ons, offers | `src/data/menu.js` |
| Burger layers for the hero animation | `public/images/burger/` + `src/data/burger-layers.json` |
| Offer posters | `public/images/offers/` |

### Menu and prices
All 19 items, the 3 add-ons (extra cheese, extra sauce, fries + Pepsi combo) and the $10 offer are from the menu board and Instagram. The board prints "650 L.L" for 650,000 L.L, so prices are stored and shown in full. The menu has no food photos by design — the photography lives in the hero animation and the offers.

Offers can be priced in dollars; carts keep L.L and $ totals separate (e.g. "1,540,000 L.L + $10") instead of inventing an exchange rate. An offer with an `until` date hides itself after that day (the Perfect Mushroom Combo ended 16 Aug).

### Not provided yet
- **Whish Money number** (`payments.whish`) — Whish shows as unavailable until set.
- **Delivery fee** — shown as "Confirmed on WhatsApp".
- **Facebook / TikTok links** — hidden until added.

## Ordering
Checkout (pickup or delivery, validated details, cash or Whish) opens WhatsApp to 79 022 617 with the order written out, then shows a confirmation with the order number. No automatic payment verification. Set `endpoints.order` / `endpoints.feedback` to also POST JSON to a backend.

## Deploying
Upload `dist/` to any static host. `public/_redirects` handles routes on Netlify; elsewhere add a fallback to `index.html`.
