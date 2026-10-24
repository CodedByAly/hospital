// Sends a small copy of the item's picture to the cart button, then nudges the button.
// Uses the Web Animations API, so it never touches React state.

export function flyToCart(sourceEl) {
  const targets = [...document.querySelectorAll('[data-cart-target]')]
  const target = targets.find((t) => {
    const r = t.getBoundingClientRect()
    return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight
  })
  if (!target) return

  const bump = () => {
    target.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }],
      { duration: 350, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    )
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!sourceEl || reduced || !document.body.animate) {
    bump()
    return
  }

  const from = sourceEl.getBoundingClientRect()
  const to = target.getBoundingClientRect()
  const size = Math.min(from.width, from.height, 88)

  const ghost = sourceEl.cloneNode(true)
  ghost.removeAttribute('id')
  ghost.setAttribute('aria-hidden', 'true')
  Object.assign(ghost.style, {
    position: 'fixed',
    left: `${from.left + from.width / 2 - size / 2}px`,
    top: `${from.top + from.height / 2 - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    margin: '0',
    zIndex: '400',
    borderRadius: '50%',
    overflow: 'hidden',
    pointerEvents: 'none',
    boxShadow: '0 10px 24px rgba(43, 29, 31, 0.25)',
  })
  document.body.appendChild(ghost)

  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)
  // Arc: rise a little first, then drop into the cart.
  const lift = Math.min(120, Math.abs(dy) * 0.35 + 40)

  const anim = ghost.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.45}px, ${dy * 0.3 - lift}px) scale(0.75)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.2)`, opacity: 0.6 },
    ],
    { duration: 720, easing: 'cubic-bezier(0.45, 0, 0.25, 1)' },
  )
  anim.onfinish = () => {
    ghost.remove()
    bump()
  }
}
