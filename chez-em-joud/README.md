# Chez Em Joud

Website for Chez Em Joud: the menu, online ordering for delivery or pickup, contact details and a
feedback form. English only.

**How ordering works:** customers build their order on the site (quantities, ingredients to leave
out, notes), choose delivery or pickup, fill in their details and press *Send order on WhatsApp*.
WhatsApp opens with the full order written out, addressed to the restaurant's number. The restaurant
confirms the order and timing in that chat. Payment is cash on delivery or cash at pickup. There is
no online payment and no automatic payment check.

Built with React and Vite. The page is prerendered at build time, so the menu and prices are in the
HTML that Google reads.

## Running it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs dist/ (static files, host anywhere)
npm run preview   # serves the production build
```

## Updating content

| What | Where |
| --- | --- |
| Dishes, prices, descriptions, ingredients that can be left out | `src/data/menu.js` |
| Phone / WhatsApp, Instagram, Facebook, address, hours, delivery fee | `src/data/site.js` |
| Photos | `public/images/` (then set `image` on the dish in `menu.js`) |
| Page title, description, share image | `index.html`, `public/og-image.jpg` |

- **Delivery fee:** `ordering.deliveryFee` is `null`, which shows "Confirmed on WhatsApp". Set a number
  to charge a fixed fee.
- **Address, town, Google Maps, opening hours:** empty for now. Fill them in and they appear in the
  contact section, footer and Google data automatically.
- **Facebook:** paste the page link into the `facebook` entry in `site.social` to show it.
- **Feedback form:** opens WhatsApp unless `feedbackEndpoint` is set to a form service URL.
