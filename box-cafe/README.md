# Box Cafe — dine-in menu

Menu website for **Box Cafe** (By Société Last Exit), with its Cooked Crème crêpes and the Box Bun menu.

When the site opens, the Box Cafe logo lands and rises, and the guest picks their branch under it:
**Achrafieh, Antelias or Zaarour**. Each branch shows its own hours and Google Maps directions. The
Box Bun burger menu only appears for Zaarour, as on the printed menu. It is a menu only: no ordering.

A table QR code can skip the picker by linking straight to a branch: `…/#achrafieh`, `…/#antelias`, `…/#zaarour`.

## Run

```bash
npm install
npm run dev      # local preview
npm run build    # production files in dist/ (upload the contents of dist/)
```

## Edit content

- `src/data/branches.js` — branch names, hours, map links, which branch has Box Bun, phone and Instagram.
- `src/data/menu.js` — every section, item and price. Two-size drinks use `sizes: [small, large]`,
  shown with the menu's blue (small) and yellow (large) dots.
- `public/img/` — product cut-outs taken from the menu PDF.

## Not provided yet

- Antelias opening hours (the Instagram bio lists Rabieh Mon–Sat 10am–7:30pm; confirm if that is the Antelias branch).
- Whether Achrafieh serves the full cafe menu (the printed menu names Zaarour & Antelias only).
