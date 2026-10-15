/**
 * Animates a small copy of the dish (its photo, or the brand mark) from where the
 * customer tapped to whichever cart button is currently visible.
 */

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

function visibleCartTarget() {
  const targets = [...document.querySelectorAll('[data-cart-target]')];
  return targets
    .map((el) => ({ el, rect: el.getBoundingClientRect() }))
    .find(({ rect }) => rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight);
}

export function flyToCart(sourceEl, imageSrc) {
  if (!sourceEl || prefersReducedMotion() || typeof Element.prototype.animate !== 'function') {
    return Promise.resolve();
  }
  const target = visibleCartTarget();
  if (!target) return Promise.resolve();

  const from = sourceEl.getBoundingClientRect();
  const to = target.rect;
  const size = Math.min(72, Math.max(44, Math.min(from.width, from.height)));

  const startX = from.left + from.width / 2 - size / 2;
  const startY = from.top + from.height / 2 - size / 2;
  const endX = to.left + to.width / 2 - size / 2;
  const endY = to.top + to.height / 2 - size / 2;

  // Outer element moves horizontally (linear), inner vertically (eased) = natural arc.
  const outer = document.createElement('div');
  const inner = document.createElement('div');
  outer.className = 'fly-item';
  inner.className = 'fly-item__inner';
  outer.style.cssText = `width:${size}px;height:${size}px;left:0;top:0;`;

  if (imageSrc) {
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = '';
    inner.appendChild(img);
  } else {
    inner.classList.add('fly-item__inner--mark');
    const mark = document.createElement('img');
    mark.src = '/favicon.svg';
    mark.alt = '';
    inner.appendChild(mark);
  }
  outer.appendChild(inner);
  document.body.appendChild(outer);

  const duration = 640;
  const goingUp = endY < startY;

  // Horizontal and vertical motion use different easings, which bends the path into a curve.
  // Heading up (header cart): fast sideways, then accelerate upward.
  // Heading down (bottom order bar): a small lift first, then drop.
  const x = outer.animate(
    [{ transform: `translateX(${startX}px)` }, { transform: `translateX(${endX}px)` }],
    { duration, easing: goingUp ? 'cubic-bezier(.25,.75,.4,1)' : 'cubic-bezier(.45,0,.55,1)', fill: 'forwards' },
  );
  const yFrames = goingUp
    ? [
        { transform: `translateY(${startY}px) scale(1)`, opacity: 1 },
        { transform: `translateY(${endY}px) scale(.3)`, opacity: 0.7 },
      ]
    : [
        { transform: `translateY(${startY}px) scale(1)`, opacity: 1 },
        { transform: `translateY(${Math.max(8, startY - 60)}px) scale(.85)`, opacity: 1, offset: 0.3 },
        { transform: `translateY(${endY}px) scale(.3)`, opacity: 0.7 },
      ];
  inner.animate(yFrames, {
    duration,
    easing: goingUp ? 'cubic-bezier(.55,0,.85,.4)' : 'cubic-bezier(.4,0,.6,1)',
    fill: 'forwards',
  });

  return x.finished
    .catch(() => {})
    .then(() => {
      outer.remove();
      target.el.classList.remove('is-bumping');
      // Restart the bump animation on the cart button.
      void target.el.offsetWidth;
      target.el.classList.add('is-bumping');
    });
}
