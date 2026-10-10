# Taktawook website

One-page restaurant site for Taktawook (Sarba, Jounieh & Dora). English only.

- **Stack:** React 19, Vite, GSAP (ScrollTrigger), lucide-react
- **Design:** UI UX Pro Max "Vibrant & Block-based" style with the Taktawook brand colors, Fredoka + Nunito
- **Highlights:** flying food that reacts to the mouse and scroll, dishes that fly into the bag,
  full menu with tabs/search/filters/sizes/Meal Booster, a bag that sends the order on WhatsApp,
  live "Open now" badge (Beirut time), pinned horizontal gallery, `prefers-reduced-motion` support

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

Menu prices live in `src/data/menu.js`. Photos in `public/images` were cropped from the brand's menu and Instagram.
