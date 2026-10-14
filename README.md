# Kuku Chix Joint — website

The official ordering website for **Kuku Chix Joint**, a fried chicken spot in Khaldeh, Lebanon.

Built with React + TypeScript + Vite. It's English-only, works mobile-first, and orders go to the restaurant on WhatsApp.

## Features

- Full menu with all 11 sections, prices, struck-through bundle prices and descriptions, copied from the restaurant's ordering page
- Item dialog with the required choices (flavour, free dip, "pick 2/4 sauces"), paid extras, ingredients to leave out, notes and quantity
- Cart that stays saved between visits: edit items, change quantities, remove them, clear the cart, and see the LBP total next to the dollar total
- Photo-led hero: the restaurant's real dish photos rotate in a gently tilting 3D frame that follows the mouse and eases back as you scroll
- Menu laid out like a real ordering app (name, description and price beside the photo), plus a 3D sauce carousel and a fly-to-cart animation
- Checkout for pickup (time slots generated from opening hours) or delivery (area, address, building), with form validation
- Payment by cash or Whish Money (shows the Whish number, +961 81 777 384, with a copy button)
- Order confirmation page with an order number, a summary, expected time, and buttons to call or WhatsApp the restaurant
- Feedback form: posts to an endpoint if one is configured, otherwise sends the feedback through WhatsApp
- SEO: per-page titles, Open Graph tags, `Restaurant` JSON-LD, sitemap, robots.txt
- Accessibility: keyboard focus trapping in dialogs, a skip link, visible focus states, and respect for reduced-motion settings

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the build
```

The site is a single-page app, so the host must rewrite every route to `index.html`. `public/_redirects` handles this on Netlify and `vercel.json` handles it on Vercel.

## Editing content

| What | Where |
| --- | --- |
| Phone, WhatsApp, email, address, hours, socials, Whish number, delivery fee, LBP rate | `src/config/restaurant.ts` |
| Menu items, prices, descriptions, options, removable ingredients | `src/data/menu.ts` |
| Food photos | `public/images/menu/<item>.webp` (+ `<item>-sm.webp` thumbnail) |
| Interface text | `src/content/copy.ts` |
| Order delivery (WhatsApp today) | `src/services/orders.ts` |
| Feedback delivery | `src/services/feedback.ts`, or set `VITE_FEEDBACK_ENDPOINT` in `.env` |

## Values still to confirm with the restaurant

These are flagged in the code and the UI adapts until they're filled in:

- **Opening hours.** The ordering page says 3:00 PM–12:00 AM, but the Instagram bio says 12:00 PM–1:00 AM.
- **Google Maps link.** The short link was cut off in the screenshot, so a Maps search is used for now.
- **Delivery fee.** Not provided; shown as "confirmed on WhatsApp".
- **Spice levels.** Items say "choose your spice level", but the levels weren't listed. Mild / Medium / Hot are placeholders.
- **RANCH burger price.** Hidden in every screenshot. The item shows "Ask us" until `price` is set.
- Items marked `verify:` in `menu.ts` had part of their text hidden in the screenshots.
