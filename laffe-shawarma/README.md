# Laffet Shawarma — لفّة شاورما

Official website for **Laffet Shawarma**, Hamra main street (facing Spinneys), Beirut.

The site is in English and Arabic. It opens in English, has a language switcher, and switches to a right-to-left layout in Arabic. The visitor's choice is remembered. Features:

- Menu with photo cards and search (works in both languages)
- Online ordering for pickup or delivery
- Payment by cash or Whish Money
- Order confirmation page
- Contact page and feedback form

Built with React 19, Vite and React Router. No UI libraries.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview
```

It's a single-page app. `public/_redirects` handles routes on Netlify.

## Where to edit

| File | What's in it |
| --- | --- |
| `src/config/restaurant.js` | Name, phone and WhatsApp, address, maps link, hours, Instagram, delivery fee and areas, **Whish number**, order and feedback endpoints |
| `src/data/menu.js` | Categories, items, prices (LBP), photos, options, extras and removable ingredients — all in English and Arabic |
| `src/i18n/strings.js` | All interface text in English and Arabic |
| `index.html` | Default page title, SEO description, Open Graph tags and structured data (JSON-LD) |
| `src/styles/base.css` | Colours (taken from the logo) and fonts. Barlow Condensed for English headings, Lalezar for Arabic headings |

### Still to provide or confirm

- **Whish Money number** (`payment.whish.number`). Until it's set, checkout tells the customer the number will be sent on WhatsApp.
- **Google Maps link** (`mapsUrl`). For now it's a search for the address from the Instagram bio.
- **Delivery.** The profile only says "for orders: 70111330", so delivery is switched on but needs confirming. Also missing: the delivery fee (`deliveryFee`) and delivery areas (`deliveryAreas`).
- **Arabic item names** are translations of the English menu. Edit them freely in `menu.js`.
- **Large Lamb Shawarma Wrap photo.** The photo comes from the post captioned "Beef shawarma". It's flagged with a `review` field in `menu.js`.
- **"Potatos"** on the printed menu is spelled "Potatoes" on the site.
- **Facebook / TikTok** accounts can be added under `social` if they exist.

### Photos

Photos live in `src/assets/images/`. To give an item a photo:

```js
import burger from '../assets/images/cheese-burger.webp'
{ id: 'cheese-burger', ..., image: burger }
```

Items without a photo show the logo on a paper background instead.

## Orders and payment

- **No server yet.** Placing an order opens WhatsApp to 70 111 330 with the full order written out, in the language the customer is using. The order number and details are saved on the customer's device for the confirmation page.
- **Order endpoint.** Set `ordering.orderEndpoint` to POST orders as JSON instead of using WhatsApp.
- **Whish Money.** The site shows the number with a copy button. **There is no automatic payment verification**: the customer sends the receipt on WhatsApp and the restaurant checks it.
- **Feedback form.** Sent on WhatsApp, or to `feedbackEndpoint` (e.g. Formspree) if one is set.
