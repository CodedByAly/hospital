import { useEffect, useRef } from 'react';
import layers from '../data/burger-layers.json';
import { asset } from '../lib/asset';

/**
 * The exploded burger from @grillz.burger.lb, cut into its six real layers.
 *
 * On load the layers drop one by one onto the bottom bun and land with a
 * small squash, like a burger being built on the pass. Scrolling then lifts
 * them apart into the exploded shot from the original photo.
 */

const ORDER = ['bun-bottom', 'lettuce', 'chicken', 'cheese', 'pickles', 'bun-top']; // build order
const LABELS = {
  'bun-top': 'Toasted bun',
  pickles: 'Pickles',
  cheese: 'Melted cheese',
  chicken: 'Grilled chicken',
  lettuce: 'Lettuce',
  'bun-bottom': 'Toasted bun',
};
// How far each layer sinks into the one below when stacked (photo px).
const NEST = { lettuce: 92, chicken: 62, cheese: 92, pickles: 86, 'bun-top': 52 };

const F = layers._frame;

// Stacked y positions, computed bottom-up from the real layer heights.
const stacked = {};
{
  let top = layers['bun-bottom'].y;
  stacked['bun-bottom'] = top;
  for (const n of ORDER.slice(1)) {
    const y = top - layers[n].h + NEST[n];
    stacked[n] = y;
    top = y;
  }
}
// Centre the assembled burger vertically in the frame.
const stackTop = Math.min(...ORDER.map((n) => stacked[n]));
const stackBottom = layers['bun-bottom'].y + layers['bun-bottom'].h;
const STACK_SHIFT = (F.h - (stackBottom - stackTop)) / 2 - stackTop;

const pct = (v, total) => `${(v / total) * 100}%`;

export default function BurgerStack({ className = '' }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nodes = Object.fromEntries(ORDER.map((n) => [n, root.querySelector(`[data-layer="${n}"]`)]));

    let spread = reduce ? 1 : 0; // 0 = stacked, 1 = exploded
    let target = spread;
    let frame = 0;
    let built = reduce;

    const place = () => {
      const h = root.clientHeight;
      const k = h / F.h;
      for (const n of ORDER) {
        const from = stacked[n] + STACK_SHIFT;
        const to = layers[n].y;
        const y = from + (to - from) * spread;
        // Each layer rides its own Y, plus a whisper of tilt while airborne.
        const tilt = (ORDER.indexOf(n) % 2 ? 1 : -1) * spread * 1.2;
        nodes[n].style.transform = `translate3d(0, ${(y - layers[n].y) * k}px, 0) rotate(${tilt}deg)`;
      }
      root.style.setProperty('--spread', spread.toFixed(3));
    };

    const tick = () => {
      // Critically-damped follow: smooth, no wobble.
      spread += (target - spread) * 0.12;
      if (Math.abs(target - spread) < 0.001) spread = target;
      place();
      frame = spread !== target ? requestAnimationFrame(tick) : 0;
    };

    const onScroll = () => {
      if (!built) return;
      // Assembled at the top of the page; fully apart after ~40% of a screen of scrolling.
      const p = window.scrollY / (window.innerHeight * 0.4);
      target = Math.min(1, Math.max(0, p));
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onResize = () => place();
    place();

    // Build sequence: each layer drops from above and lands with a squash.
    let timers = [];
    if (!reduce) {
      const delay0 = document.documentElement.dataset.splash === 'on' ? 1250 : 200;
      ORDER.forEach((n, i) => {
        const el = nodes[n].firstElementChild;
        el.style.opacity = '0';
        timers.push(
          window.setTimeout(() => {
            el.style.opacity = '';
            el.animate(
              [
                { transform: 'translateY(-140%) scale(1, 1)', opacity: 0, offset: 0 },
                { transform: 'translateY(-60%) scale(1, 1.02)', opacity: 1, offset: 0.4 },
                { transform: 'translateY(0) scale(1.05, 0.9)', offset: 0.78, easing: 'ease-out' },
                { transform: 'translateY(-4%) scale(0.99, 1.02)', offset: 0.9 },
                { transform: 'translateY(0) scale(1, 1)', offset: 1 },
              ],
              { duration: 620, easing: 'cubic-bezier(.45,0,.9,.6)', fill: 'backwards' },
            );
          }, delay0 + i * 170),
        );
      });
      timers.push(
        window.setTimeout(() => {
          built = true;
          onScroll();
        }, delay0 + ORDER.length * 170 + 600),
      );
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className={`burger-stack ${className}`} ref={rootRef} role="img" aria-label="A Grillz burger: toasted bun, pickles, melted cheese, grilled chicken and lettuce">
      <span className="burger-stack__shadow" aria-hidden="true" />
      {[...ORDER].reverse().map((n) => {
        const l = layers[n];
        return (
          <div
            key={n}
            data-layer={n}
            className="burger-stack__layer"
            style={{ left: pct(l.x, F.w), top: pct(l.y, F.h), width: pct(l.w, F.w), height: pct(l.h, F.h), zIndex: ORDER.indexOf(n) + 1 }}
          >
            <img src={asset(`images/burger/${n}.webp`)} alt="" draggable="false" decoding="async" />
            <span className={`burger-stack__label burger-stack__label--${ORDER.indexOf(n) % 2 ? 'left' : 'right'}`} aria-hidden="true">
              {LABELS[n]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
