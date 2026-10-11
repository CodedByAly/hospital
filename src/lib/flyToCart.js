import { prefersReducedMotion } from './motion.js';

function visibleCartTarget() {
  for (const el of document.querySelectorAll('[data-cart-target]')) {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0 && getComputedStyle(el).visibility !== 'hidden') return el;
  }
  return null;
}

const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

// Cart icon catches the item: squash, ring ripple and a "+N" that floats up.
function land(target, quantity) {
  target.animate(
    [
      { transform: 'scale(1)' },
      { transform: 'scale(1.28, 0.82)', offset: 0.25 },
      { transform: 'scale(0.9, 1.12)', offset: 0.5 },
      { transform: 'scale(1.06, 0.96)', offset: 0.75 },
      { transform: 'scale(1)' },
    ],
    { duration: 520, easing: 'ease-out' },
  );
  if (prefersReducedMotion()) return;

  const r = target.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;

  const ring = document.createElement('div');
  ring.className = 'fly-ring';
  ring.style.cssText = `left:${cx - 22}px;top:${cy - 22}px;`;
  document.body.appendChild(ring);
  ring.animate([{ transform: 'scale(0.4)', opacity: 0.9 }, { transform: 'scale(1.9)', opacity: 0 }], {
    duration: 600,
    easing: 'cubic-bezier(.2,.7,.3,1)',
  }).onfinish = () => ring.remove();

  const plus = document.createElement('div');
  plus.className = 'fly-plus';
  plus.textContent = `+${quantity}`;
  plus.style.cssText = `left:${cx}px;top:${r.top}px;`;
  document.body.appendChild(plus);
  plus.animate(
    [
      { transform: 'translate(-50%, 0) scale(0.6)', opacity: 0 },
      { transform: 'translate(-50%, -18px) scale(1.1)', opacity: 1, offset: 0.3 },
      { transform: 'translate(-50%, -38px) scale(1)', opacity: 0 },
    ],
    { duration: 900, easing: 'cubic-bezier(.2,.7,.3,1)' },
  ).onfinish = () => plus.remove();

  navigator.vibrate?.(12);
}

/*
 * Sends the product photo (or, for items without one, an orange "+N" bubble
 * from the add button) along a curved arc into the cart. The item lifts
 * slightly, tumbles and shrinks in flight, leaves a short motion trail, and
 * the cart reacts when it lands.
 */
export function flyToCart(sourceEl, { from = null, quantity = 1 } = {}) {
  const target = visibleCartTarget();
  if (!target) return;
  const origin = sourceEl || from;
  if (!origin || prefersReducedMotion()) {
    land(target, quantity);
    return;
  }

  const a = origin.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  if (a.width === 0) {
    land(target, quantity);
    return;
  }

  const size = sourceEl ? Math.min(a.width, a.height, 150) : 46;
  const x0 = a.left + a.width / 2;
  const y0 = a.top + a.height / 2;
  const x2 = b.left + b.width / 2;
  const y2 = b.top + b.height / 2;
  const distance = Math.hypot(x2 - x0, y2 - y0);
  const lift = Math.min(Math.max(distance * 0.35, 90), 240);
  // Control point above the higher of the two ends gives a natural throw arc.
  const x1 = lerp(x0, x2, 0.45);
  const y1 = Math.min(y0, y2) - lift;
  const endScale = 24 / size;
  const spin = x2 >= x0 ? 1 : -1;

  const steps = 28;
  const frames = [];
  for (let i = 0; i <= steps; i += 1) {
    const p = i / steps;
    const t = easeInOut(p);
    const x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * x1 + t * t * x2 - x0;
    const y = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * y1 + t * t * y2 - y0;
    const scale = p < 0.12 ? lerp(1, 1.08, p / 0.12) : lerp(1.08, endScale, ((p - 0.12) / 0.88) ** 1.3);
    const rotate = spin * (p < 0.45 ? lerp(0, -16, p / 0.45) : lerp(-16, 10, (p - 0.45) / 0.55));
    frames.push({
      offset: p,
      transform: `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`,
      borderRadius: `${lerp(12, size / 2, Math.min(1, p * 1.6))}px`,
      opacity: p > 0.9 ? lerp(1, 0.6, (p - 0.9) / 0.1) : 1,
    });
  }

  const duration = Math.min(Math.max(560 + distance * 0.35, 650), 950);

  const make = (className) => {
    let el;
    if (sourceEl) {
      el = sourceEl.cloneNode(true);
      if (el.tagName === 'IMG') el.loading = 'eager';
    } else {
      el = document.createElement('div');
      el.textContent = `+${quantity}`;
    }
    el.removeAttribute('id');
    el.removeAttribute('ref');
    el.setAttribute('aria-hidden', 'true');
    el.className = className;
    el.style.cssText = `left:${x0 - size / 2}px;top:${y0 - size / 2}px;width:${size}px;height:${size}px;`;
    document.body.appendChild(el);
    return el;
  };

  // Faint trail copies a few milliseconds behind give a sense of speed.
  [
    { delay: 70, opacity: 0.18 },
    { delay: 35, opacity: 0.35 },
  ].forEach(({ delay, opacity }) => {
    const ghost = make(`fly-item fly-item--ghost ${sourceEl ? '' : 'fly-item--bubble'}`);
    ghost.style.opacity = opacity;
    ghost
      .animate(
        frames.map((f) => ({ ...f, opacity: f.opacity * opacity })),
        { duration, delay, easing: 'linear', fill: 'both' },
      )
      .onfinish = () => ghost.remove();
  });

  const flyer = make(`fly-item ${sourceEl ? '' : 'fly-item--bubble'}`);
  flyer.animate(frames, { duration, easing: 'linear', fill: 'forwards' }).onfinish = () => {
    flyer.remove();
    land(target, quantity);
  };
}
