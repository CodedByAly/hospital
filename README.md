# Sukun Coffee Shop — Website

Official website for **Sukun Coffee Shop**, Azmi Street, Tripoli. Built with React + Vite, no UI libraries.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the build locally
```

`dist/` is a static site — deploy it to Netlify, Vercel, Cloudflare Pages or any static host.

## Where to change things

| What | File |
| --- | --- |
| Phone numbers, WhatsApp number, address, Google Maps link, Instagram, opening hours, student offer | `src/data/restaurant.js` |
| Menu sections, drinks and prices | `src/data/menu.js` |
| Photos | `public/images/` |
| Page title, description, social preview, Google structured data | `index.html` |

Notes:

- **Opening hours** are empty until confirmed. Fill `hours` in `restaurant.js` and they appear on the Visit section and footer automatically.
- **Food and Tobacco** sections of the menu were not in the screenshots. Add them to `menu.js` as new categories; empty categories are hidden.
- **Feedback form**: with no backend configured it opens WhatsApp with the message pre-filled. To receive it by email instead, set `feedbackEndpoint` in `restaurant.js` to a form service URL that accepts a JSON POST (e.g. Formspree).
- To remove the student offer band, set `offer: null`.

## Structure

```
src/
  data/          restaurant info + menu (edit these)
  components/    one file per section (Header, Hero, Story, MenuSection, Offer, Gallery, Visit, Feedback, Footer…)
  hooks/         scroll reveal + scroll progress helpers
  styles/        base.css (tokens, type, header, splash) and sections.css
```
