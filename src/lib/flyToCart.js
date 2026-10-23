const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** The cart button currently visible (header on desktop, tab bar on phones). */
function visibleCartTarget() {
  return [...document.querySelectorAll('[data-cart-target]')].find((el) => {
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0
  })
}

/**
 * Flies a small copy of `source` (an image or a tile) into the cart icon.
 * The horizontal and vertical motions use different easings, which draws
 * a natural arc. Resolves when the item lands (immediately if motion is reduced).
 */
export function flyToCart(source) {
  const target = visibleCartTarget()
  if (!source || !target || reducedMotion() || !document.body.animate) return Promise.resolve()

  const from = source.getBoundingClientRect()
  const to = target.getBoundingClientRect()
  if (!from.width || from.bottom < 0 || from.top > window.innerHeight) return Promise.resolve()

  const size = Math.min(from.width, from.height, 140)
  const startX = from.left + from.width / 2 - size / 2
  const startY = from.top + from.height / 2 - size / 2
  const dx = to.left + to.width / 2 - size / 2 - startX
  const dy = to.top + to.height / 2 - size / 2 - startY

  const outer = document.createElement('div')
  outer.className = 'fly-item'
  outer.style.cssText = `left:${startX}px;top:${startY}px;width:${size}px;height:${size}px`
  const inner = document.createElement('div')
  inner.className = 'fly-item__inner'
  const clone = source.cloneNode(true)
  clone.removeAttribute('id')
  clone.setAttribute('aria-hidden', 'true')
  inner.appendChild(clone)
  outer.appendChild(inner)
  document.body.appendChild(outer)

  const duration = Math.min(900, Math.max(560, Math.hypot(dx, dy) * 0.9))
  const horizontal = outer.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${dx}px)` }], {
    duration,
    easing: 'cubic-bezier(.45,0,.55,1)',
    fill: 'forwards',
  })
  // Lift first, then drop into the icon.
  inner.animate(
    [
      { transform: 'translateY(0) scale(1)', opacity: 1 },
      { transform: `translateY(${dy < 0 ? dy * 0.7 - 30 : -50}px) scale(.7)`, opacity: 1, offset: 0.35 },
      { transform: `translateY(${dy}px) scale(.16)`, opacity: 0.6 },
    ],
    { duration, easing: 'cubic-bezier(.3,0,.6,1)', fill: 'forwards' },
  )

  return horizontal.finished.catch(() => {}).then(() => outer.remove())
}
