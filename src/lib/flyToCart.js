const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** The cart button currently on screen (header on desktop, tab bar on phones). */
function visibleCartTarget() {
  const targets = [...document.querySelectorAll('[data-cart-target]')];
  return targets.find((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden';
  });
}

export function pulseCart() {
  for (const el of document.querySelectorAll('[data-cart-target]')) {
    el.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.14)' }, { transform: 'scale(1)' }],
      { duration: 380, easing: 'cubic-bezier(.3,.7,.4,1)' },
    );
  }
}

/**
 * Sends a copy of `sourceEl` (an <img>) along a short arc into the cart button.
 * Resolves when the copy has landed, so the caller can pulse the badge.
 */
export function flyToCart(sourceEl) {
  const target = visibleCartTarget();
  if (!sourceEl || !target || reducedMotion()) {
    pulseCart();
    return Promise.resolve();
  }

  const from = sourceEl.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const size = sourceEl.tagName === 'IMG' ? Math.min(from.width, from.height, 220) : 72;

  let ghost;
  if (sourceEl.tagName === 'IMG') {
    ghost = sourceEl.cloneNode(false);
    ghost.removeAttribute('loading');
    ghost.removeAttribute('srcset');
    ghost.alt = '';
  } else {
    // No photo for this item: send a brand-coloured token instead.
    ghost = document.createElement('div');
    Object.assign(ghost.style, { borderRadius: '50%', background: 'var(--orange)' });
  }
  ghost.className = '';
  ghost.setAttribute('aria-hidden', 'true');
  const isToken = ghost.tagName !== 'IMG';
  Object.assign(ghost.style, {
    position: 'fixed',
    left: `${from.left + from.width / 2 - size / 2}px`,
    top: `${from.top + from.height / 2 - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    objectFit: 'contain',
    zIndex: 1000,
    pointerEvents: 'none',
    margin: 0,
    willChange: 'transform, opacity',
    filter: 'drop-shadow(0 12px 18px rgba(0,0,0,.35))',
  });
  if (isToken) ghost.style.filter = 'none';
  document.body.appendChild(ghost);

  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const endScale = 28 / size;
  // Lift slightly before dropping into the cart so the path reads as an arc.
  const lift = Math.min(120, Math.abs(dy) * 0.35 + 40);

  const animation = ghost.animate(
    [
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.45}px, ${dy * 0.25 - lift}px) scale(${0.55 + endScale / 2})`, opacity: 1, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(${endScale})`, opacity: 0.4 },
    ],
    { duration: 720, easing: 'cubic-bezier(.5,0,.3,1)', fill: 'forwards' },
  );

  return animation.finished
    .catch(() => {})
    .then(() => {
      ghost.remove();
      pulseCart();
    });
}
