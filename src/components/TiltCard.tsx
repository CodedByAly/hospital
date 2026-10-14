import { useRef, type ReactNode, type PointerEvent, type HTMLAttributes } from 'react'
import './TiltCard.css'

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Max rotation in degrees. */
  max?: number
}

/**
 * Pointer-driven 3D tilt with a moving specular highlight.
 * Writes CSS variables directly (no React state) so it stays at 60fps.
 * Disabled for touch input and reduced-motion users.
 */
export function TiltCard({ children, max = 9, className = '', ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef(0)

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty('--rx', `${(0.5 - py) * max}deg`)
      el.style.setProperty('--ry', `${(px - 0.5) * max}deg`)
      el.style.setProperty('--gx', `${px * 100}%`)
      el.style.setProperty('--gy', `${py * 100}%`)
      el.dataset.tilt = 'on'
    })
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(frame.current)
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
    el.dataset.tilt = 'off'
  }

  return (
    <div ref={ref} className={`tilt ${className}`} onPointerMove={onMove} onPointerLeave={onLeave} {...rest}>
      <div className="tilt__inner">
        {children}
        <span className="tilt__glare" aria-hidden="true" />
      </div>
    </div>
  )
}
