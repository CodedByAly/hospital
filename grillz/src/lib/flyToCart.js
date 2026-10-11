/**
 * "Flying item" animation: a copy of the product photo is lifted from where
 * the customer tapped and tossed along a curved path into the cart icon.
 *
 * The path is a quadratic Bézier sampled into keyframes, so the motion can
 * follow an arc (which a single CSS transform cannot). Timing mimics a real
 * toss: a short lift, then acceleration towards the cart, then the cart icon
 * gives a small "catch".
 */

const BUMP_EVENT = 'grillz:cart-bump';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function visibleCartTarget() {
  const targets = [...document.querySelectorAll('[data-cart-target]')];
  return targets.find((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden';
  });
}

export function bumpCart() {
  window.dispatchEvent(new Event(BUMP_EVENT));
}

export function onCartBump(handler) {
  window.addEventListener(BUMP_EVENT, handler);
  return () => window.removeEventListener(BUMP_EVENT, handler);
}

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * @param {DOMRect} fromRect where the flight starts
 * @param {string|null} imageSrc product photo, or null for the brand token
 */
export function flyToCart(fromRect, imageSrc) {
  const target = visibleCartTarget();
  if (!target || !fromRect || prefersReducedMotion()) {
    bumpCart();
    return;
  }
  const to = target.getBoundingClientRect();

  // Start size: the photo's own size, capped so big hero images don't fly full-size.
  const size = Math.max(44, Math.min(140, Math.min(fromRect.width, fromRect.height)));
  const sx = fromRect.left + fromRect.width / 2;
  const sy = fromRect.top + fromRect.height / 2;
  const ex = to.left + to.width / 2;
  const ey = to.top + to.height / 2;

  // Control point above both ends gives the arc; higher for longer throws.
  const distance = Math.hypot(ex - sx, ey - sy);
  const cx = sx + (ex - sx) * 0.35;
  const cy = Math.min(sy, ey) - Math.min(180, 60 + distance * 0.18);

  const node = document.createElement('div');
  node.className = 'fly-item';
  node.setAttribute('aria-hidden', 'true');
  node.style.width = node.style.height = `${size}px`;
  if (imageSrc) {
    const img = new Image();
    img.src = imageSrc;
    img.alt = '';
    node.appendChild(img);
  } else {
    node.classList.add('fly-item--token');
  }
  document.body.appendChild(node);

  const endScale = Math.max(0.16, 22 / size);
  const steps = 28;
  const frames = [];
  for (let i = 0; i <= steps; i += 1) {
    const p = i / steps;
    // Lift for the first ~12%, then the eased toss.
    const lift = p < 0.12 ? Math.sin((p / 0.12) * Math.PI) * 6 : 0;
    const t = easeInOut(p);
    const x = (1 - t) ** 2 * sx + 2 * (1 - t) * t * cx + t ** 2 * ex - size / 2;
    const y = (1 - t) ** 2 * sy + 2 * (1 - t) * t * cy + t ** 2 * ey - size / 2 - lift;
    const scale = p < 0.12 ? 1 + 0.05 * Math.sin((p / 0.12) * Math.PI) : 1 - (1 - endScale) * easeInOut((p - 0.12) / 0.88);
    const rotate = -7 * Math.sin(p * Math.PI);
    frames.push({
      transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`,
      opacity: p > 0.88 ? 1 - (p - 0.88) / 0.12 * 0.7 : 1,
      borderRadius: `${12 + 38 * t}%`,
      offset: p,
    });
  }

  const duration = Math.min(900, 560 + distance * 0.22);
  const animation = node.animate(frames, { duration, easing: 'linear', fill: 'forwards' });
  animation.onfinish = () => {
    node.remove();
    bumpCart();
  };
  animation.oncancel = () => node.remove();
}
