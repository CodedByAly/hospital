/**
 * Sends a small copy of the product image from `sourceEl` to the visible cart
 * button, following a gentle arc. Resolves when the animation has finished.
 */
export function flyToCart(sourceEl, imageSrc) {
  const target = [...document.querySelectorAll('[data-cart-target]')].find((el) => el.offsetParent !== null)
  if (!sourceEl || !target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return Promise.resolve()
  }

  const from = sourceEl.getBoundingClientRect()
  const to = target.getBoundingClientRect()
  const size = Math.min(Math.max(Math.min(from.width, from.height), 56), 140)

  const ghost = document.createElement('div')
  ghost.className = 'fly-ghost'
  ghost.setAttribute('aria-hidden', 'true')
  if (imageSrc) ghost.style.backgroundImage = `url("${imageSrc}")`
  Object.assign(ghost.style, {
    width: `${size}px`,
    height: `${size}px`,
    left: `${from.left + from.width / 2 - size / 2}px`,
    top: `${from.top + from.height / 2 - size / 2}px`,
  })
  document.body.appendChild(ghost)

  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)
  const lift = Math.min(120, Math.abs(dy) * 0.35 + 40)
  const end = 28 / size

  const animation = ghost.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 1, offset: 0 },
      { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - lift}px) scale(${(1 + end) / 1.6})`, opacity: 1, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(${end})`, opacity: 0.4, offset: 1 },
    ],
    { duration: 720, easing: 'cubic-bezier(.45,.05,.35,1)', fill: 'forwards' },
  )

  return animation.finished
    .catch(() => {})
    .then(() => {
      ghost.remove()
      target.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.14)' }, { transform: 'scale(1)' }],
        { duration: 320, easing: 'ease-out' },
      )
    })
}
