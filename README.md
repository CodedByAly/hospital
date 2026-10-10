# Adam's Burger — website

The website for **Adam's Burger** (Saida, beside LIU), *Happiness starts here — من هون بتبلش السعادة*.

React 19 + Vite, plain CSS, no UI or animation libraries. It's in English and Arabic with full RTL. It has the full menu, and guests can order for dine-in, pickup or delivery. Orders are sent to the restaurant on WhatsApp.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the build
npm run lint
```

Deploying: any static host works. `public/_redirects` handles client-side routes on Netlify; on other hosts, rewrite all paths to `/index.html`.

## Where to change things

| What | File |
| --- | --- |
| Phone, WhatsApp, email, address, Maps link, socials, hours, delivery fee, Whish number, feedback endpoint, site URL | `src/config/restaurant.js` |
| Menu: categories, items, prices, add-ons, removable ingredients | `src/data/menu.js` |
| All interface text (English + Arabic) | `src/i18n/strings.js` |
| Colours, fonts, spacing | `src/styles/tokens.css` |
| Menu photos | `public/img/menu/<image>.webp` (name matches `image` in `menu.js`) |
| Background-free cutouts used by the add-to-cart animation | `public/img/cut/<image>.webp` + the `CUTOUTS` list in `menu.js` |
| Floating pieces on the homepage (burgers, onion rings, mozzarella sticks, sauce, Pepsi) | `public/img/float/` and `src/sections/floatSets.js` |

Items without a photo show a clean placeholder automatically. Dip Sauce is the only one.

## Still to fill in

These were not provided, so the site hides or adapts around them until they are set in `src/config/restaurant.js`:

- **Whish Money number** (`payments.whish.number`). Until it is set, choosing Whish tells the customer to ask for the number on WhatsApp.
- **Delivery fee** (`ordering.deliveryFee`, in USD). Until it is set, the fee is shown as "confirmed on WhatsApp".
- **Exact Google Maps pin** (`mapsUrl`). It currently opens a Maps search for "Adam's Burger, beside LIU, Saida".
- **Facebook link.** The Instagram profile links to a Facebook page called "Adam's Burger" and to `linktr.ee/adamsburger.lb`, but their URLs weren't in the screenshots. Add them to `socials`, with an icon for each in `src/components/Icon.jsx`.
- **Services.** Dine-in, pickup and delivery are all switched on (`ordering`). Turn off any the restaurant doesn't offer.
- **Site URL** (`siteUrl`), used for canonical and Open Graph links once the domain is known.
- **Feedback endpoint** (`feedback.endpoint`). Until it is set, feedback opens WhatsApp with the message already written.

## How ordering works

1. The guest builds an order: add-ons (combo, extra patty, Mozzarella patty, dip sauce), ingredients to leave out, notes and quantity. The cart is saved on their device.
2. At checkout they choose dine-in (table number), pickup (time) or delivery (area, address), then cash or Whish Money.
3. **Place order** opens WhatsApp with the full order written out, addressed to +961 81 501 258. The order only reaches the restaurant once the guest presses send. The confirmation page says so and offers the button again.
4. Whish payments are **not** verified automatically. The checkout tells the guest the restaurant checks transfers by hand.

## Menu notes

The menu was transcribed from the restaurant's Thrubits digital menu. Prices are in US dollars.

- The menu's **Add on** section (Combo, Add chicken, Add Mozzarella patty, Add Beef patty, Dip Sauce) is offered as extras on the burgers. Beef burgers get *Add Beef patty* and chicken burgers get *Add chicken*. French Fries can take an extra Dip Sauce, and Dip Sauce is also sold on its own under Sides.
- French Fries, Mozzarella sticks and Onion Rings are listed under the menu's Add on section. On the site they have their own **Sides** category.
- **Crunchy Master**: its price was just off-screen in the screenshots. It is set to $5.00, the price shown under that card. Please confirm.
- **Dip Sauce flavours** (Signature, Honey mustard, Zinger) come from the "Fries don't come alone" post. Please confirm these are the sauces offered.
- **20% student offer**: from the restaurant's Instagram post. The site doesn't apply it automatically. It sends students to WhatsApp to ask.
- Hours come from the Instagram bio: 1:00 PM – 10:00 PM, Friday closed.

Arabic names and descriptions are translations, written in a Lebanese register.

Photos were cut from the menu and Instagram screenshots. Adam's Burger, Cheesy Beef, Cheesy Chicken and Beef mushroom use the sharper Instagram shots on a studio-style background. The rest are the small menu photos, enlarged. Replacing them with the original photo files will noticeably sharpen the site.
