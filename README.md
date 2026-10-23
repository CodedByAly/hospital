# Moods Burger

Website for Moods Burger, Kraytem, Beirut. Menu, online delivery ordering
sent to the restaurant on WhatsApp, a dine-in menu, and full English / Arabic
(RTL) support.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

Deploys as a static site. `public/_redirects` (Netlify) and `vercel.json`
(Vercel) send every route to `index.html` so links like `/menu` work.

## Where to change things

| What | File |
| --- | --- |
| Phone, WhatsApp, email, address, map link, opening hours, social links | `src/config/restaurant.js` |
| Whish Money number, delivery fee, feedback form endpoint | `src/config/restaurant.js` |
| Menu items, prices, options, add-ons, removable ingredients | `src/data/menu.js` |
| All website text (English / Arabic) | `src/i18n/en.js`, `src/i18n/ar.js` |
| Colours, fonts, spacing | `src/styles/tokens.css` |
| Food photos | `public/images/` (referenced by `image` in `menu.js`) |
| Page title, description, social preview, Google structured data | `index.html` |

Option prices in `menu.js` are added to the item's base price. For example,
The Smasher is `9` with Triple patty `+2` and Combo `+4`, which gives 9$, 11$,
13$ and 15$ exactly as on the printed menu.

## Still to fill in

These were not provided, so the site hides or adapts the related feature until
they're set:

- **Whish Money number** (`ordering.whish.number`). The Whish payment option
  appears at checkout as soon as it's set. In `npm run dev` the option shows a
  reminder note; on the live site it stays hidden until then.
- **Facebook page URL** (`restaurant.social.facebook`). The Instagram profile
  links to a Facebook page, but its address wasn't shared. TikTok is also empty.
- **Delivery fee** (`ordering.deliveryFee`). Shown as "Confirmed on WhatsApp"
  until set.
- **Feedback endpoint** (`feedbackEndpoint`), e.g. a Formspree form URL.
  Until then the feedback form opens the customer's email app addressed to
  Moodsburgerlb@gmail.com.
- **Live domain**. Once known, make `og:image`, `image` and `logo` in
  `index.html` absolute URLs (social previews and Google need full URLs) and
  add `<link rel="canonical">`.
- **Photos** for Onion Rings, House Fries, Caesar Salad, desserts and drinks.
  Those items currently show a plain branded placeholder.

## How ordering works

1. The customer builds an order (Delivery mode) and fills in the checkout form.
2. Pressing **Send order on WhatsApp** opens WhatsApp with the full order
   written out (items, options, removed ingredients, totals, address, payment
   method), addressed to the restaurant's WhatsApp number.
3. The customer presses send in WhatsApp. The website then shows an order
   confirmation with an order number and a button to send it again.

There is no automatic payment verification: for Whish, the customer transfers
in the Whish app and shares the screenshot in the same WhatsApp chat.

## Dine-in menu

The menu has a Delivery / Dine-in switch. Dine-in shows the same menu and
prices without ordering buttons. A QR code on the tables can link straight to
it: `https://<your-domain>/menu?mode=dine-in`.

## Structure

```
src/
  config/restaurant.js   restaurant details and ordering settings
  data/menu.js           the menu
  i18n/                  English and Arabic text, language provider
  context/               cart (saved in the browser) and UI state
  lib/                   prices, opening hours, order message, fly-to-cart
  hooks/                 dialogs, scroll reveal, enter/exit animation
  components/            header, footer, item panel, cart drawer, ...
  pages/                 Home, Menu, About, Contact, Checkout, OrderConfirmation
  styles/                design tokens and base styles
```

Built with React 18, React Router and Vite. No UI or animation libraries.
Fonts are self-hosted: Bricolage Grotesque, plus IBM Plex Sans Arabic and
Lalezar for Arabic.
