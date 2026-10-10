# Outlaw Sushi Bar — website

Menu and ordering site for **Outlaw Sushi Bar**, a sushi restaurant on the Mansourieh main road, facing the municipality. It offers dine in, take away and delivery.

React 19 + TypeScript + Vite, with Framer Motion for the 3D transitions, Lucide icons and plain CSS. The site is in English. Orders go to the restaurant on WhatsApp, and the guest picks which of the two lines receives them.

## Run it

```bash
cd outlaw
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks, then builds to dist/
npm run preview    # serve the build
```

Any static host works. `public/_redirects` handles client-side routes on Netlify; on other hosts, rewrite all paths to `/index.html`.

## Where to change things

| What | File |
| --- | --- |
| WhatsApp lines, address, services, Instagram, hours, delivery fee, site URL | `src/config/restaurant.ts` |
| Menu: categories, items, prices, sizes, descriptions | `src/data/menu.ts` |
| The rolls shown on the homepage stage | `houseRolls` in `src/data/menu.ts` |
| Colours, fonts, spacing | `src/styles/tokens.css` |
| Dish photos | `public/img/menu/<photo>.webp` (699×534) and `public/img/menu/sm/<photo>.webp` (360×275) |
| Drink and hero cut-outs | `public/img/cut/<name>.webp` |

To replace a photo, save the original under the same file name. Leaving an item without `photo` or `cutout` shows a quiet placeholder, never another dish's photo.

## The design

The logo is crossed chopsticks over an orange salmon-sun, so the homepage hero rebuilds it at full scale around a real dish: the restaurant's own Outlaw Dragon. The rest of the site is lacquer black, rice-paper white and that one orange. Three faces carry the type:

- Big Shoulders Display for headlines.
- Hanken Grotesk for reading.
- Michroma for small labels, echoing the extended letters of "OUTLAW".

The 3D work all runs on CSS transforms through Framer Motion. There is no WebGL, so it stays fast on ordinary phones:

- **Hero.** The dish, sun and chopsticks move at different depths with the mouse and on scroll.
- **House rolls.** A turning carousel you can drag, swipe, use arrows or the keyboard on.
- **September Deal.** The restaurant's posters, fanned like a hand of cards.
- **Menu index.** On desktop, the pointer carries a photo of the section it's over.
- **Menu page.** Changing section turns the page in perspective, and on phones you can swipe between sections.
- **Dishes and detail.** Each dish photo tilts toward the pointer, and the detail sheet opens with depth.

Everything respects the reduced-motion setting.

## How ordering works

1. The guest adds dishes: quick + from the list, or from the detail sheet with size, quantity and special instructions. The cart is saved on their device.
2. At checkout they choose:
   - take away (with a pickup time) or delivery (area and address)
   - which WhatsApp line gets the order: 78 997 164 or 78 944 899
   - cash or Whish Money
3. **Whish Money goes to the same number the order is sent to.** Transfers are not verified automatically, and the checkout says the restaurant checks them by hand.
4. **Send order on WhatsApp** opens WhatsApp with the full order written out. It reaches the restaurant only when the guest presses send. The confirmation page says so and offers the button again.

## Menu notes

The menu was transcribed from the restaurant's Thrubits digital menu: 22 sections and about 150 items. Prices are in US dollars, as listed.

- **Spelling.** Names keep the restaurant's own spelling ("Big Boss Drogo", "Bombifire", "Seniora", "Calamari Ring's"). Obvious typos were fixed ("cripy", "buritto", "rap" → wrap, "teriaki" → teriyaki, "smocked" → smoked).
- **"sp" items** are shown as "Special …", which is how the platters refer to them, and search finds both spellings.
- **Grouped sizes.** Water (small/big), the three wines (½ bottle/bottle) and the sushi cake (4, 8 or 15 people) are grouped into one item each, with sizes.
- **Deal prices.** Big Boss Drogo and Rainbow Dragon are $9 and $10 in the list. One pop-up also showed $14, which looks like a previous price.
- **Placement.** "Special One" ($18) sits at the end of Dragon Maki, where it appears on the menu.
- **September Deal** is a dated promotion. When it ends, remove that category in `menu.ts`, and the homepage deal section disappears with it.

## Photos

All photos are the restaurant's own menu photos, cut from the screenshots of their Thrubits menu. They are low resolution (about 466 px wide), so replacing them with the original files will noticeably sharpen the site. A few menu photos look like generic stock images used on their Thrubits menu: the sushi boats (Rainbow and Visitors sets), the sushi cake, and the poke, salmon veggie and spicy salmon salads. Swap them for real photos when possible.

## Still to fill in (`src/config/restaurant.ts`)

- **Opening hours** (`hours`). Until set, the site asks guests to check on WhatsApp.
- **Delivery fee** (`ordering.deliveryFee`). Until set, it shows as "confirmed on WhatsApp".
- **Facebook link** (`facebook`). The Instagram profile links a page named "Outlaw sushi bar".
- **Exact map pin** (`mapsQuery`). It currently searches for the restaurant's name in Mansourieh.
- **Site URL** (`siteUrl`), for canonical and Open Graph links.
