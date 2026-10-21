# Jungs – restaurant website

Official website for **Jungs**, Chekka (Lebanon). Menu, ordering for pickup and delivery, Whish Money / cash payment, contact and feedback.

Built with React 18, React Router and Vite. No UI or animation libraries; styling is plain CSS.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the build locally
```

Deploys as a static site. `public/_redirects` handles client-side routes on Netlify; on other hosts, rewrite all paths to `index.html`.

## Where to change things

| What | File |
| --- | --- |
| Phone, WhatsApp, Whish number, email, address, Maps link, hours, social links, delivery fee | `src/config/restaurant.js` |
| Menu: categories, items, prices, descriptions, options, add-ons, removable ingredients | `src/data/menu.js` |
| Colors and fonts | `src/styles/base.css` (`:root` tokens) |
| Photos | `public/images/` (referenced in `src/pages/Home.jsx`) |
| Page title / description / structured data | `index.html` |

## How orders work

There is no backend yet. When a customer places an order, the site builds the full order (number, items, options, customer details, payment method) and opens WhatsApp with the message already written to the restaurant's number. The customer presses send. The confirmation page reminds them and offers a button to reopen it.

Whish payments are **not** verified automatically. The customer transfers to the Whish number shown at checkout and shares the screenshot in the WhatsApp chat; the team checks it.

To use a real backend later, set `endpoints.orders` / `endpoints.feedback` in `src/config/restaurant.js`. The site will then POST the order or feedback as JSON to that URL instead of opening WhatsApp (`src/lib/submit.js`).

## To confirm with the restaurant

- **Delivery fee** – not provided, so `deliveryFee` is `null` and the site says the fee is confirmed on WhatsApp. Set a number to show it everywhere.
- **Days open** – only "1pm – 12am" was given; the site uses it every day.
- **Address** – only "Chekka" was given. Add a street or landmark in `address` if wanted.
- **Google Maps link** – taken from the Instagram bio (`maps.app.goo.gl/RLyZMXXykiACEr1s9`); worth tapping once to confirm it opens the right pin.
- **Salad calories** – printed on the menu but too small to read in the photo. Add `calories` to each salad in `menu.js` and they will appear.
- **Combo / Full Meal choices** – "Any sub or burger" was mapped to the beef subs, Chicken Tandoori, The Fajita and all burgers; "Sandwich or burger" also includes the BBQ wrap. Edit the lists at the bottom of `menu.js` if that is not right.
- **Soft drink / juice flavors** and **extra dip flavors** are not listed on the menu, so customers can mention them in the order notes.
- Spelling was tidied in three places: "Ceasar" → "Caesar", "greenbell" → "green bell", "Bbq Boneless Chicken Wrap" → "BBQ Boneless Chicken Wrap".
