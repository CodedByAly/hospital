// Sends a copy of the dish photo along a curved path into whichever
// cart button is currently on screen (header on desktop, bottom bar on
// phones). Purely visual: the cart is already updated when this runs.

function visibleCartTarget() {
  const targets = document.querySelectorAll('[data-cart-target]')
  for (const el of targets) {
    const r = el.getBoundingClientRect()
    if (r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden') return el
  }
  return null
}

function bump(target) {
  target.classList.remove('is-bumping')
  // Force reflow so the animation can restart on quick repeat adds.
  void target.offsetWidth
  target.classList.add('is-bumping')
}

export function flyToCart(sourceEl) {
  if (typeof window === 'undefined') return
  const target = visibleCartTarget()
  if (!target) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || !sourceEl || !sourceEl.animate) {
    bump(target)
    return
  }

  const from = sourceEl.getBoundingClientRect()
  const to = target.getBoundingClientRect()
  if (!from.width) {
    bump(target)
    return
  }

  // Start size: the visible photo, capped so large hero images don't
  // cover the screen mid-flight.
  const size = Math.min(160, Math.max(from.width, from.height))
  const startX = from.left + from.width / 2 - size / 2
  const startY = from.top + from.height / 2 - size / 2
  const dx = to.left + to.width / 2 - (startX + size / 2)
  const dy = to.top + to.height / 2 - (startY + size / 2)

  // Outer element moves horizontally (linear), inner vertically with an
  // ease-in, which together trace a natural arc.
  const outer = document.createElement('div')
  outer.className = 'fly-item'
  outer.style.cssText = `left:${startX}px;top:${startY}px;width:${size}px;height:${size}px;`
  const inner = document.createElement('div')
  inner.className = 'fly-item__inner'

  let visual
  if (sourceEl.tagName === 'IMG') {
    visual = document.createElement('img')
    visual.src = sourceEl.currentSrc || sourceEl.src
    visual.alt = ''
  } else {
    visual = document.createElement('span')
    visual.className = 'fly-item__dot'
  }
  inner.appendChild(visual)
  outer.appendChild(inner)
  document.body.appendChild(outer)

  const duration = 720
  const lift = Math.min(-40, dy * 0.15 - 90)
  outer.animate(
    [{ transform: 'translateX(0)' }, { transform: `translateX(${dx}px)` }],
    { duration, easing: 'cubic-bezier(.45,.05,.55,.95)', fill: 'forwards' },
  )
  const anim = inner.animate(
    [
      { transform: 'translateY(0) scale(1)', opacity: 1 },
      { transform: `translateY(${lift}px) scale(.62)`, opacity: 1, offset: 0.35 },
      { transform: `translateY(${dy}px) scale(.12)`, opacity: 0.35 },
    ],
    { duration, easing: 'cubic-bezier(.5,0,.75,.6)', fill: 'forwards' },
  )
  anim.onfinish = () => {
    outer.remove()
    bump(target)
  }
}
