# Restaurant websites

Two independent sites live in this repository. Each one has its own README with setup and editing
instructions.

| Folder | Site | What it does |
| --- | --- | --- |
| `/` (root) | **Bean Avenue**, coffee house in Aley | Dine-in menu, visit info, feedback |
| `chez-em-joud/` | **Chez Em Joud** | Menu with ordering for delivery or pickup via WhatsApp, cash payment |

## Bean Avenue

```bash
npm install
npm run dev
npm run build     # outputs dist/
```

Menu: `src/data/menu.js` · Café details: `src/data/site.js` · Photos: `public/images/`.
The feedback form opens WhatsApp unless `feedbackEndpoint` in `src/data/site.js` is set.

## Chez Em Joud

```bash
cd chez-em-joud
npm install
npm run dev
npm run build     # outputs chez-em-joud/dist/
```

See `chez-em-joud/README.md`.
