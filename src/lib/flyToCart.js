// Sends a copy of a dish photo along an arc into the visible cart button.
// Uses the Web Animations API, so it runs on the compositor and never blocks input.

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

function visibleCartTarget() {
  const targets = [...document.querySelectorAll('[data-cart-target]')];
  return targets.find((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden';
  });
}

export function bumpCart() {
  const target = visibleCartTarget();
  target?.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.16)' }, { transform: 'scale(0.96)' }, { transform: 'scale(1)' }],
    { duration: 420, easing: 'cubic-bezier(.3,.7,.4,1)' }
  );
}

export function flyToCart(sourceEl) {
  const target = visibleCartTarget();
  if (!sourceEl || !target || prefersReducedMotion() || !sourceEl.animate) {
    bumpCart();
    return;
  }

  const from = sourceEl.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  if (from.width === 0) {
    bumpCart();
    return;
  }

  const img = sourceEl.tagName === 'IMG' ? sourceEl : sourceEl.querySelector('img');
  const photo = img?.currentSrc || img?.src;
  // Items without a photo send a small wine-coloured token instead.
  const size = photo ? Math.min(from.width, from.height, 180) : 30;
  const ghost = document.createElement('div');
  ghost.className = photo ? 'fly-ghost' : 'fly-ghost fly-ghost--dot';
  ghost.setAttribute('aria-hidden', 'true');
  if (photo) ghost.style.backgroundImage = `url("${photo}")`;
  Object.assign(ghost.style, {
    width: `${size}px`,
    height: `${size}px`,
    left: `${from.left + from.width / 2 - size / 2}px`,
    top: `${from.top + from.height / 2 - size / 2}px`,
  });
  document.body.appendChild(ghost);

  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const endScale = Math.max(28 / size, 0.12);
  // Lift towards the viewer first, then drop into the cart along a curve.
  const lift = Math.min(140, Math.abs(dy) * 0.35 + 60);

  const animation = ghost.animate(
    [
      { transform: 'translate3d(0,0,0) scale(1) rotateX(0deg) rotateZ(0deg)', borderRadius: '14px', opacity: 1, offset: 0 },
      { transform: `translate3d(${dx * 0.18}px, ${-lift}px, 80px) scale(0.86) rotateX(14deg) rotateZ(-6deg)`, borderRadius: '30%', opacity: 1, offset: 0.32 },
      { transform: `translate3d(${dx * 0.72}px, ${dy * 0.55 - lift * 0.4}px, 40px) scale(${0.3 + endScale}) rotateX(6deg) rotateZ(8deg)`, borderRadius: '50%', opacity: 0.95, offset: 0.72 },
      { transform: `translate3d(${dx}px, ${dy}px, 0) scale(${endScale}) rotateX(0deg) rotateZ(12deg)`, borderRadius: '50%', opacity: 0.4, offset: 1 },
    ],
    { duration: 820, easing: 'cubic-bezier(.45,.05,.35,1)', fill: 'forwards' }
  );

  const done = () => {
    ghost.remove();
    bumpCart();
  };
  animation.onfinish = done;
  animation.oncancel = done;
}
