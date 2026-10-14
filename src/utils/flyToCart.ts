/**
 * Flies a copy of a product image into the visible cart icon along a curved,
 * slightly tumbling 3D path. Pure DOM + Web Animations API: no re-renders.
 */
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const visibleTarget = () => {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-cart-target]'))
  return targets.find((el) => {
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'
  })
}

export function flyToCart(from: DOMRect, src: string | undefined, onLand?: () => void) {
  const target = visibleTarget()
  if (!target || prefersReducedMotion()) {
    onLand?.()
    return
  }
  const to = target.getBoundingClientRect()
  const size = Math.min(Math.max(Math.min(from.width, from.height), 72), 180)

  const startX = from.left + from.width / 2 - size / 2
  const startY = from.top + from.height / 2 - size / 2
  const endX = to.left + to.width / 2 - size / 2
  const endY = to.top + to.height / 2 - size / 2

  const ghost = document.createElement('div')
  ghost.className = 'fly-ghost'
  ghost.style.width = ghost.style.height = `${size}px`
  ghost.style.left = `${startX}px`
  ghost.style.top = `${startY}px`
  if (src) ghost.style.backgroundImage = `url("${src}")`
  document.body.appendChild(ghost)

  // Quadratic bezier with the control point lifted above both ends.
  const dx = endX - startX
  const dy = endY - startY
  const cx = dx * 0.35
  const cy = Math.min(0, dy) - Math.max(140, Math.abs(dx) * 0.25)
  const steps = 16
  const frames: Keyframe[] = []
  const dir = dx >= 0 ? 1 : -1
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
    const x = 2 * (1 - e) * e * cx + e * e * dx
    const y = 2 * (1 - e) * e * cy + e * e * dy
    const scale = 1 - 0.82 * e
    const rotY = dir * 28 * Math.sin(Math.PI * e)
    const rotX = 18 * Math.sin(Math.PI * e)
    const rotZ = dir * 14 * e
    frames.push({
      transform: `translate3d(${x}px, ${y}px, 0) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`,
      boxShadow: `0 ${24 - 18 * e}px ${48 - 36 * e}px rgba(5, 12, 20, ${0.35 - 0.2 * e})`,
      opacity: i === steps ? 0.2 : 1,
      borderRadius: `${18 + 30 * e}%`,
      offset: t,
    })
  }

  const anim = ghost.animate(frames, { duration: 820, easing: 'linear', fill: 'forwards' })
  anim.onfinish = () => {
    ghost.remove()
    target.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.22) rotate(-6deg)' },
        { transform: 'scale(0.96)' },
        { transform: 'scale(1)' },
      ],
      { duration: 420, easing: 'cubic-bezier(.3,.7,.4,1)' },
    )
    onLand?.()
  }
}
