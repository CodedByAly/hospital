# Chicago Burgers: website

The official site for **Chicago Burgers**, Gallery Semaan, Kamil Shamoun Blvd, Keserwani Center, Beirut.
It covers the menu, online ordering for pickup or delivery, payment by cash or Whish Money, contact details and feedback.

Built with React 19, React Router and Vite. No UI framework and no animation library: just plain CSS and the Web Animations API.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

`public/_redirects` lets the single-page app routes work on Netlify. On other hosts, send all paths to `index.html`.

## Where to change things

| What | File |
| --- | --- |
| Phone, WhatsApp, Whish number, address, map link, Instagram, opening hours, delivery fee, delivery areas | `src/data/restaurant.js` |
| Menu items, prices, sizes, removable ingredients, add-ons, category photos | `src/data/menu.js` |
| Food photos | `src/assets/food/`, `src/assets/instagram/` |
| SEO title, description, social preview, structured data, splash screen | `index.html` |
| Colours and fonts | `:root` in `src/styles/base.css` |

The phone number, WhatsApp and Whish Money all use the same number (`70 796 761`), set once at the top of `restaurant.js`.

### Still to fill in

These weren't provided, so the site shows a sensible fallback until they are set in `src/data/restaurant.js`:

- **Opening hours** (`openingHours`): until then the site says "For today's hours, message us on WhatsApp".
- **Delivery fee** (`ordering.deliveryFee`): until then it reads "confirmed on WhatsApp" and the total shows "+ delivery".
- **Delivery areas** (`ordering.deliveryAreas`): when set, checkout shows a dropdown instead of a free-text field.
- **Exact Google Maps place link** (`address.mapsUrl`): it currently searches the address.
- **Facebook / TikTok**: add them under `social` in the same shape as Instagram and they appear in the header, footer and contact page.
- **Site URL** (`siteUrl`) once the domain is live.

## How ordering works

1. The customer builds an order. The cart is saved in the browser, so it survives a reload.
2. At checkout they choose Delivery or Pickup, fill in their details and pick Cash or Whish Money.
3. **Send order on WhatsApp** opens WhatsApp with the full order written out, addressed to the restaurant's number. The order reaches the restaurant when the customer presses send.
4. The confirmation page shows the order number, summary, payment instructions and contact buttons.

Whish payments are **not verified automatically**. The customer transfers to the Whish number and sends the receipt on WhatsApp, and the site says so.

To connect a real backend later, set `ordering.orderEndpoint` (and `ordering.feedbackEndpoint` for the feedback form) to a URL that accepts a JSON `POST`. The checkout then submits there instead of opening WhatsApp. See `submitOrder` in `src/lib/order.js`.

## Project layout

```
src/
  data/         restaurant info + menu (edit these)
  pages/        Home, Menu, About, Contact, Checkout, Confirmation, NotFound
  components/   Header, TabBar (mobile), CartDrawer, ItemSheet, Dialog, WhishPanel, FeedbackForm, ...
  context/      CartContext (cart state, persistence, item sheet)
  lib/          pricing, order building + WhatsApp message, fly-to-cart animation, storage
  styles/       base tokens/typography/forms, shared page styles
```
