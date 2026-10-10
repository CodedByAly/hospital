# Streets Coffee Shop — website

The website for **Streets** (Bhannine, Minieh highway, in front of Naboulsi resto-cafe), *Where Everyone Meets*.

React 19 + Vite, plain CSS, no UI or animation libraries. English and Arabic with full RTL, full menu with ordering for dine-in, pickup and delivery. Orders are sent to the shop on WhatsApp.

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
| Phone, WhatsApp, address, Maps link, socials, hours, delivery fee, Whish number, feedback endpoint, site URL | `src/config/restaurant.js` |
| Menu: categories, items, prices, sizes, flavours, extras, removable ingredients | `src/data/menu.js` |
| All interface text (English + Arabic) | `src/i18n/strings.js` |
| Colours, fonts, spacing | `src/styles/tokens.css` |
| Menu photos | `public/img/menu/<image>.webp` (name matches `image` in `menu.js`) |
| Background-free cutouts used by the add-to-cart animation | `public/img/cut/<image>.webp` + the `CUTOUTS` list in `menu.js` |
| Floating hero pieces (cups, mint, mango, strawberries, pearls) | `public/img/float/` and `src/sections/floatSets.js` |

Items without a photo show a clean placeholder automatically.

## Still to fill in

These were not provided, so the site hides or adapts around them until they are set in `src/config/restaurant.js`:

- **Whish Money number** (`payments.whish.number`). Until it is set, choosing Whish tells the customer to ask for the number on WhatsApp.
- **Opening hours** (`hours`). Until they are set, the site says to message on WhatsApp for today's hours.
- **Delivery fee** (`ordering.deliveryFee`). Until it is set, the fee is shown as "confirmed on WhatsApp".
- **Exact Google Maps pin** (`mapsUrl`). It currently opens a Maps search for the address.
- **Facebook / TikTok links.** Only Instagram and WhatsApp are listed. Add more to `socials`, and add an icon for each in `src/components/Icon.jsx`.
- **Site URL** (`siteUrl`), used for canonical and Open Graph links once the domain is known.
- **Feedback endpoint** (`feedback.endpoint`). Until it is set, feedback opens WhatsApp with the message already written.

## How ordering works

1. The guest builds an order (size, flavour, extras, notes, quantity). The cart is saved on their device.
2. At checkout they choose dine-in (table number), pickup (time) or delivery (area, address), then cash or Whish Money.
3. **Place order** opens WhatsApp with the full order written out, addressed to the shop's number. The order only reaches the shop once the guest presses send. The confirmation page says so and offers the button again.
4. Whish payments are **not** verified automatically. The checkout tells the guest the shop checks transfers by hand.

## Menu notes

The menu was transcribed from the shop's Thrubits digital menu. Medium/large (or regular/large) listings of the same drink are grouped into one item with sizes; each size keeps the original listing name in `listedAs`. A few points to confirm with the shop are marked in comments in `menu.js`:

- Syrup is listed as an extra on the regular Latte only.
- Milkshake flavours are printed under the medium size only.
- Customized Crepe is set up as one choice from the list.

Spelling was kept as on the menu ("Machiato", "Vanille"), except obvious typos in descriptions (tapioca, blueberry). Arabic names and descriptions are translations, written in a Lebanese register.

Photos were taken from the menu and Instagram screenshots. They are lower resolution than originals would be, so replacing them with the original files will noticeably sharpen the site.
