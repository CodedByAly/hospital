/**
 * Animates a copy of `sourceEl` into whichever cart button is currently visible
 * (header on desktop, bottom bar on mobile), then nudges that button.
 */
export function flyToCart(sourceEl) {
  const target = [...document.querySelectorAll('[data-cart-target]')].find((el) => el.offsetParent !== null)
  if (!sourceEl || !target) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return bump(target)

  const from = sourceEl.getBoundingClientRect()
  const to = target.getBoundingClientRect()
  const size = Math.min(from.width, from.height, 160)

  const ghost = sourceEl.cloneNode(true)
  ghost.removeAttribute('id')
  ghost.setAttribute('aria-hidden', 'true')
  Object.assign(ghost.style, {
    position: 'fixed',
    left: `${from.left + (from.width - size) / 2}px`,
    top: `${from.top + (from.height - size) / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    margin: 0,
    zIndex: 1000,
    pointerEvents: 'none',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 12px 30px rgba(40, 10, 10, .28)',
    willChange: 'transform, opacity',
  })
  document.body.appendChild(ghost)

  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)
  const end = 28 / size
  // A slight upward arc reads as "tossed into the bag" rather than a straight slide.
  const anim = ghost.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 1, borderRadius: '12px' },
      { transform: `translate(${dx * 0.55}px, ${dy * 0.35 - 60}px) scale(${0.55})`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(${end})`, opacity: 0.4, borderRadius: '50%' },
    ],
    { duration: 720, easing: 'cubic-bezier(.45,.05,.3,1)' },
  )
  anim.onfinish = () => {
    ghost.remove()
    bump(target)
  }
}

function bump(el) {
  el.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.14)' }, { transform: 'scale(1)' }],
    { duration: 320, easing: 'ease-out' },
  )
}
