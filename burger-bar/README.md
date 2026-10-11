# Burger Bar: website

Website and online ordering for Burger Bar, Al-Manara main road, West Bekaa.
Built with React 19, React Router and Vite. Styling is plain CSS with design tokens; animations use CSS and the Web Animations API.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

It's a single-page app: the host must serve `index.html` for every route. `public/_redirects` (Netlify) and `vercel.json` (Vercel) already do this.

## Updating content

| What | File |
| --- | --- |
| Phone, WhatsApp, Whish number, address, Instagram | `src/config/site.js` |
| Opening hours (drives the live "Open until..." status and Google data) | `src/config/site.js` → `schedule` |
| Delivery fee / minimum order | `src/config/site.js` → `ordering` |
| Feedback form destination (Formspree etc.) | `src/config/site.js` → `feedback.endpoint` |
| Quick picks on the home page | `src/config/site.js` → `featuredItemIds` |
| Menu: items, prices, descriptions, photos, options | `src/data/menu.js` |
| Food photos | `public/images/menu/` |

## How ordering works

There is no ordering backend yet. When a customer places an order:

1. The order is saved in their browser and gets a number (e.g. `BB-1011-4821`).
2. The confirmation page sends the full order to Burger Bar on **WhatsApp** as a pre-written message.
3. The restaurant confirms by reply. For Whish payments, the customer transfers to the Whish number and sends the screenshot with the order number. Payments are checked by hand, not automatically.

To connect a POS or backend later, change `placeOrder()` in `src/services/orders.js`.

## To confirm with the restaurant

- **WhatsApp and Whish number.** Both are set to 76 799 767 (the "Order now" number on Instagram). Change them in `src/config/site.js` if different.
- **Monday closing.** Taken from the Instagram post announcing Monday as the weekly day off.
- **Philadelphia (sandwich) price.** Hidden in the screenshot, so it shows "Ask for price" until set.
- **djej 3al fa7m price.** Partly hidden; entered as $6.00.
- **Possibly missing sandwiches** between Philadelphia and Stivo (Wrap): that part of the menu wasn't fully visible.
- **Google Maps link** for the restaurant (the Directions button uses a Maps search until then).
- **Delivery fee and areas** (currently "confirmed on WhatsApp").
- **More food photos.** Only items with an Instagram photo show one; the rest are text-only cards.
- Item descriptions and ingredients: the current menu has none for most items, so the site doesn't invent them.
