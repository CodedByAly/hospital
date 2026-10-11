# O'snack — website

Official website for **O'snack** ("Taste That Talks!"), Tarik El Jdideh, Beirut.
Menu browsing, a cart and checkout that sends the finished order to the restaurant on WhatsApp, in English and Arabic (RTL).

Built with React 18, React Router and Vite. No UI or animation libraries.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

`public/_redirects` makes client-side routes work on Netlify. On other hosts, send every unknown path to `index.html`.

## Where to change things

| What | File |
| --- | --- |
| Phone, WhatsApp, address, Maps link, socials, delivery area/fee, opening hours, **Whish number**, feedback endpoint, site URL | `src/config/restaurant.js` |
| Menu items, prices, categories, add-ons, removable ingredients, photos | `src/data/menu.js` |
| All interface text (English / Arabic) | `src/i18n/en.js`, `src/i18n/ar.js` |
| Food photos | `public/images/menu/` (466×314 JPG, referenced from `menu.js`) |
| Logo | `public/images/brand/` |
| Colours, type, spacing | tokens at the top of `src/styles/base.css` |
| SEO tags and structured data | `index.html` |

Leave a config value empty and the related UI hides itself or shows a neutral fallback:

- `whish.number` empty → the Whish Money option shows "Coming soon" and can't be selected.
- `openingHours` empty → hours blocks are hidden.
- `deliveryFee: null` → delivery shows "Confirmed by phone" and the total reads "+ delivery".
- `feedbackEndpoint` empty → feedback is sent through WhatsApp; set a URL (Formspree, a serverless function…) to receive it as JSON instead.

## How ordering works

There is no backend. On checkout the order is saved in the customer's browser and WhatsApp opens with the whole order written out (items, options, address, payment) addressed to the restaurant's number. The customer presses send. The confirmation page lets them reopen WhatsApp if it didn't open, and shows the order number.

Payments are not verified by the website. Cash is paid on delivery or at pickup; Whish transfers are made by the customer to the configured number.

## Project structure

```
src/
  config/      restaurant details
  data/        menu
  i18n/        translations + language context (persists choice, sets dir="rtl")
  context/     cart (persisted to localStorage) and overlay state
  lib/         price formatting, cart maths, WhatsApp message, fly-to-cart animation
  hooks/       dialog focus trap, scroll spy, reveal-on-scroll, page meta
  components/  header, mobile bar, footer, item sheet, cart drawer, cards…
  pages/       Home, Menu, About, Contact, Checkout, Confirmation, 404
  styles/      base, layout, components, pages
```
