# Taktawook website

One-page restaurant site for Taktawook (Sarba, Jounieh & Dora). English only.

- **Stack:** React 19, Vite, GSAP (ScrollTrigger), lucide-react
- **Design:** based on Taktawook's printed menu: the grey paper, chunky headings (Lilita One), dotted price
  lines, red pills and the teal chicken footprints. Body text in Archivo.
- **Flying food:** real dishes cut out of Taktawook's own photos, floating in the hero and reacting to the
  mouse and scroll. Respects `prefers-reduced-motion`.
- **Ordering:** tap any price on the menu to add it, then send the order on WhatsApp.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

Menu prices live in `src/data/menu.js`. Photos in `public/images` were cropped from the brand's menu and Instagram.
