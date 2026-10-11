const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** The cart button currently visible on screen (desktop header or mobile bar). */
function visibleCartTarget() {
  return [...document.querySelectorAll('[data-cart-target]')].find((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden';
  });
}

function bump(target) {
  target.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }],
    { duration: 380, easing: 'cubic-bezier(.3,.7,.4,1)' },
  );
}

/**
 * Animates a copy of `sourceEl` (an <img> or any element) along a short arc
 * into the cart button. Resolves when the animation ends.
 */
export function flyToCart(sourceEl) {
  const target = visibleCartTarget();
  if (!target) return Promise.resolve();
  if (!sourceEl || reducedMotion()) {
    bump(target);
    return Promise.resolve();
  }

  const from = sourceEl.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  if (from.width === 0) {
    bump(target);
    return Promise.resolve();
  }

  const size = Math.min(from.width, from.height, 160);
  const startX = from.left + from.width / 2 - size / 2;
  const startY = from.top + from.height / 2 - size / 2;
  const endX = to.left + to.width / 2 - size / 2;
  const endY = to.top + to.height / 2 - size / 2;
  const dx = endX - startX;
  const dy = endY - startY;
  const endScale = 28 / size;

  const ghost = document.createElement('div');
  ghost.className = 'fly-ghost';
  ghost.style.cssText = `left:${startX}px;top:${startY}px;width:${size}px;height:${size}px;`;
  if (sourceEl.tagName === 'IMG' && sourceEl.currentSrc) {
    ghost.style.backgroundImage = `url("${sourceEl.currentSrc}")`;
  } else {
    ghost.classList.add('fly-ghost--plain');
  }
  document.body.appendChild(ghost);

  // Arc: rise slightly while moving, then drop into the cart.
  const lift = Math.min(120, Math.abs(dy) * 0.35 + 40);
  const anim = ghost.animate(
    [
      { transform: 'translate(0,0) scale(1)', opacity: 1, borderRadius: '12px' },
      {
        transform: `translate(${dx * 0.45}px, ${dy * 0.25 - lift}px) scale(${0.55 + endScale * 0.2})`,
        opacity: 1,
        borderRadius: '30%',
        offset: 0.45,
      },
      { transform: `translate(${dx}px, ${dy}px) scale(${endScale})`, opacity: 0.6, borderRadius: '50%' },
    ],
    { duration: 720, easing: 'cubic-bezier(.45,.05,.35,1)', fill: 'forwards' },
  );

  return anim.finished
    .catch(() => {})
    .then(() => {
      ghost.remove();
      bump(target);
    });
}
