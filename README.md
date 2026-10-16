# Talia Resto Cafe — website

The official website and dine-in menu for **Talia Resto Cafe**, Bikkerman Street, Saida (next to LIU).

Built with React 18 and Vite. No UI framework, no animation library: every interaction is hand-written CSS and
the Web Animations API, which keeps the bundle small (about 75 KB gzipped for all JavaScript).

## What's on the site

- **Splash** — the Talia wordmark draws in and the three coffee beans drop into place. Shown once per visit,
  skipped automatically for visitors who prefer reduced motion. The page renders underneath, so it never blocks
  search engines or screen readers.
- **Hero with a 3D dish carousel** — signature dishes stand in a ring on a recreation of Talia's photo set
  (olive wall, terrazzo table). It turns slowly by itself, can be dragged or flicked, tilts with the cursor,
  and pauses when off screen.
- **Menu** — the full menu (180 items in 21 categories) grouped into Food, Drinks, Argili and Sweets.
  Sticky section tabs, a category rail that follows your scroll, a 3D page-turn between sections, and search.
  Photo-heavy categories show cards that tilt toward the cursor; categories without photos use a printed-menu
  list.
- **Dish sheet** — large photo, description, price, quantity and a free-text "requests" box
  (e.g. "no tomatoes"). Choice groups and add-ons are supported as soon as they are added to the menu data.
- **Your order (dine-in)** — add, edit, change quantities, remove, clear. Every add sends a copy of the photo
  flying into the order button. The order is saved in the browser, so it survives a refresh.
- **Table details and confirmation** — name, table number, notes and payment method (cash, plus Whish Money when
  a number is configured). The confirmation shows an order number, the full summary and a button that sends the
  order to Talia's WhatsApp, with the restaurant's contact details in case something is wrong.
- **About, Visit & contact, Feedback, Footer** — address, hours, phone, WhatsApp, Instagram, Google Maps, and a
  feedback form with an optional star rating.
- **Mobile** — a bottom dock (Home, Menu, Visit, Search, and the order button with a running total), bottom
  sheets with swipe-to-close, and touch-sized controls throughout.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
npm run lint
```

## Editing content

Almost everything a restaurant changes lives in two files.

### `src/data/restaurant.js`

Name, address, phone, WhatsApp number, opening hours, social links, Google Maps link, payment settings and the
feedback endpoint. Anything set to `null` is hidden on the site.

| Setting | What it does |
| --- | --- |
| `whatsapp` | Digits only, international format. Used for every WhatsApp button and the order message. |
| `hours.closes` | Closing time. Currently `null` because it hasn't been provided; set e.g. `'12:00 AM'`. |
| `socials` | Instagram and WhatsApp today. Facebook / TikTok entries are ready to uncomment. |
| `ordering.payments.whishNumber` | **Not provided yet, so the Whish option is hidden.** Set e.g. `'96170123456'` and Whish Money appears at checkout with a copy button. There is no automatic payment verification: staff confirm transfers. |
| `feedbackEndpoint` | `null` sends feedback through WhatsApp. Set a URL (Formspree, a serverless function…) to POST it as JSON instead. |
| `mapsUrl` | Currently a Google Maps search for the address. Replace with the exact share link of the pin. |
| `siteUrl` | The live domain, once known. Also update `og:image` in `index.html` to an absolute URL. |

### `src/data/menu.js`

Every category and item, in the same order as Talia's printed menu. Each item is one line:

```js
i('zaatar', 'Zaatar', 'Classic thyme and sesame manakish', 2, 'zaatar'),
//  id        name      description                         price  photo file
```

- **Change a price**: edit the number.
- **Add an item**: copy a line, give it a new unique id.
- **Price unknown**: use `null`. The item is shown with "Ask our staff" and can't be added to an order.
  *Fresh Orange Juice* is set like this because its price wasn't visible in the menu screenshots.
- **Options / add-ons**: see the comment at the top of the file for the format.

### Photos

Dish photos are in `public/images/menu/` as `name.webp` (590 px) and `name-sm.webp` (320 px), cut from Talia's
own menu photography. Items without a photo show a clean branded placeholder. To add one, drop both sizes in
that folder and set the item's `image` to the file name.

Items currently without a photo: Mozzarella Sticks, Cheese Fries, BBQ Sandwich, four of the burgers, Talia
Frappe, Iced Hazelnut Latte, Iced Irish Latte, Iced Tea Peach / Lemon, Hot Chocolate, Tea, Flavored Tea, White
Coffee, Affogato, Caramel / Hazelnut / Coconut Latte, the cold beverages, argili, and all crepes and desserts
except the Pistachio Crepe.

## Project structure

```
src/
  data/            restaurant info and the menu (edit these)
  context/         cart state (persisted) and UI state (open sheets, toasts)
  lib/             price formatting, pricing rules, storage, fly-to-cart animation
  hooks/           media queries, accessible dialog behaviour
  components/      page sections and shared pieces
    menu/          menu, cards, rows, dish sheet
    order/         order list, table details, confirmation
  styles/global.css  design tokens (colours, type, spacing) and base styles
```

## Design notes

- **Colours** come from the brand itself: espresso ink from the logo, the wine stripe on Talia's napkins, the
  olive wall and the terrazzo table from the food photography. All are defined once as CSS variables in
  `src/styles/global.css`.
- **Type**: Bodoni Moda for headings (high-contrast, like the Talia wordmark) and Manrope for text.
- **Logo**: traced to an SVG from the supplied artwork (`src/components/Logo.jsx`), so it stays sharp at any size
  and can be recoloured.

## SEO and accessibility

- Title, description, Open Graph / Twitter tags, `CafeOrCoffeeShop` structured data, `robots.txt`, favicon and
  share image (`public/og-image.jpg`).
- Semantic sections and heading order, alt text on every photo, labelled controls, visible focus, focus-trapped
  dialogs that close with Escape and return focus, `prefers-reduced-motion` support.
