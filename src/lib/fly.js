// "Flying item" animation: a small branded token travels from the button that was pressed
// to whichever cart button is currently visible (header on desktop, dock on mobile).

const targets = new Set()

export function registerCartTarget(el) {
  targets.add(el)
  return () => targets.delete(el)
}

function visibleTarget() {
  for (const el of targets) {
    const r = el.getBoundingClientRect()
    if (r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden') return el
  }
  return null
}

function bump(el) {
  el.classList.remove('is-bumped')
  void el.offsetWidth // restart the animation
  el.classList.add('is-bumped')
}

export function flyToCart(sourceEl, label) {
  const target = visibleTarget()
  if (!target) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!sourceEl || reduced || !Element.prototype.animate) {
    bump(target)
    return
  }

  const from = sourceEl.getBoundingClientRect()
  const to = target.getBoundingClientRect()
  const size = 44
  const startX = from.left + from.width / 2 - size / 2
  const startY = from.top + from.height / 2 - size / 2
  const dx = to.left + to.width / 2 - size / 2 - startX
  const dy = to.top + to.height / 2 - size / 2 - startY

  // Two nested elements: the outer moves on X with a linear-ish curve, the inner on Y with
  // an ease that first lifts then drops, which together trace a natural arc.
  const outer = document.createElement('div')
  outer.className = 'fly-token'
  outer.style.cssText = `left:${startX}px;top:${startY}px;width:${size}px;height:${size}px`
  const inner = document.createElement('div')
  inner.className = 'fly-token__inner'
  inner.textContent = label ?? ''
  outer.appendChild(inner)
  document.body.appendChild(outer)

  const duration = Math.min(900, Math.max(560, Math.hypot(dx, dy) * 0.9))
  const lift = Math.min(-60, dy * 0.15 - 80)

  outer.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${dx}px)` }], {
    duration,
    easing: 'cubic-bezier(.45,.05,.55,.95)',
    fill: 'forwards',
  })
  const fall = inner.animate(
    [
      { transform: 'translateY(0) scale(1)', opacity: 1, offset: 0 },
      { transform: `translateY(${lift}px) scale(1.05)`, opacity: 1, offset: 0.3 },
      { transform: `translateY(${dy}px) scale(.35)`, opacity: 0.85, offset: 1 },
    ],
    { duration, easing: 'cubic-bezier(.33,0,.67,1)', fill: 'forwards' },
  )
  fall.onfinish = () => {
    outer.remove()
    bump(target)
  }
}
