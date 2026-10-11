import { prefersReducedMotion } from './motion.js';

function visibleCartTarget() {
  const targets = document.querySelectorAll('[data-cart-target]');
  for (const el of targets) {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0 && getComputedStyle(el).visibility !== 'hidden') return el;
  }
  return null;
}

function bump(target) {
  target?.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }],
    { duration: 320, easing: 'cubic-bezier(.3,.7,.4,1)' },
  );
}

/*
 * Sends a copy of `sourceEl` (the product photo) along a short arc into the
 * cart button. Horizontal and vertical movement use different easings so the
 * path curves instead of travelling in a straight line.
 */
export function flyToCart(sourceEl) {
  const target = visibleCartTarget();
  if (!target) return;
  if (!sourceEl || prefersReducedMotion()) {
    bump(target);
    return;
  }

  const from = sourceEl.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  if (from.width === 0) {
    bump(target);
    return;
  }

  const size = Math.min(from.width, from.height, 160);
  const startX = from.left + from.width / 2 - size / 2;
  const startY = from.top + from.height / 2 - size / 2;
  const dx = to.left + to.width / 2 - (startX + size / 2);
  const dy = to.top + to.height / 2 - (startY + size / 2);
  const endScale = 26 / size;

  const outer = document.createElement('div');
  outer.className = 'fly-item';
  outer.style.cssText = `left:${startX}px;top:${startY}px;width:${size}px;height:${size}px;`;
  const inner = sourceEl.cloneNode(true);
  inner.removeAttribute('id');
  inner.setAttribute('aria-hidden', 'true');
  inner.className = 'fly-item__inner';
  if (inner.tagName === 'IMG') inner.loading = 'eager';
  outer.appendChild(inner);
  document.body.appendChild(outer);

  const duration = 680;
  outer.animate(
    [{ transform: 'translateX(0)' }, { transform: `translateX(${dx}px)` }],
    { duration, easing: 'cubic-bezier(.25,.1,.25,1)', fill: 'forwards' },
  );
  const fall = inner.animate(
    [
      { transform: 'translateY(0) scale(1)', opacity: 1, borderRadius: '12px' },
      { transform: `translateY(${dy}px) scale(${endScale})`, opacity: 0.9, borderRadius: '50%' },
    ],
    { duration, easing: dy < 0 ? 'cubic-bezier(.2,.7,.4,1)' : 'cubic-bezier(.6,0,.9,.5)', fill: 'forwards' },
  );
  fall.onfinish = () => {
    outer.remove();
    bump(target);
  };
}
