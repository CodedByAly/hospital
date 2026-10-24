# Bean Avenue

Website for Bean Avenue, a coffee house in Aley, Lebanon. It is a single page with the dine-in
menu, hours, location, contact details and a feedback form. There is no online ordering.

Built with React and Vite. At build time the page is prerendered to static HTML, so the full menu,
prices and schema.org data are in the HTML that search engines and link previews read.

## Running it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs dist/ (static files, host anywhere)
npm run preview   # serves the production build
```

To deploy on Netlify, use `npm run build` as the build command and `dist` as the publish
directory (already set in `netlify.toml`).

## Updating content

You don't need to touch any components for everyday changes.

| What | Where |
| --- | --- |
| Menu items, prices, categories, add-ons | `src/data/menu.js` |
| Phone, WhatsApp, Instagram, Maps link, hours | `src/data/site.js` |
| Feedback form destination | `feedbackEndpoint` in `src/data/site.js` |
| Photos | `public/images/` |
| Page title, description, share image | `index.html`, `public/og-image.jpg` |

**Feedback form:** while `feedbackEndpoint` is empty, the form opens WhatsApp with the message
already written out, ready to send to the café's number. Paste a Formspree, Getform or custom API
URL into `feedbackEndpoint` and the form will POST JSON there instead.

**Opening hours** drive the live "Open now" label, which uses Beirut time.

## Structure

```
src/
  data/          site.js (café details), menu.js (the menu)
  components/    Header, Hero, menu/, About, Visit, Feedback, Footer, Splash, ...
  hooks/         open/closed status, scroll reveal
  styles/        design tokens and shared styles
scripts/
  prerender.js   puts the rendered HTML and structured data into dist/index.html
```

The logo in `src/components/logoPaths.js` was traced from the café's Instagram assets. Swap it for
the designer's original vector file if one is available.
