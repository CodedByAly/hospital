import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// The little teal chicken tracks from the printed menu, walking across a section.
function Print({ style }) {
  return (
    <svg viewBox="0 0 40 40" className="print" style={style}>
      <path d="M20 36V18M20 18L8 6M20 18L32 6M20 18V3M20 30l-8 6" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

export default function Footprints({ className = '', steps = 14, wave = 22 }) {
  const root = useRef(null)
  const prints = Array.from({ length: steps }, (_, i) => ({
    left: `${(i / (steps - 1)) * 96}%`,
    top: `${50 + Math.sin(i * 0.65) * wave + (i % 2 ? 9 : -9)}%`,
    rotate: `${90 + Math.cos(i * 0.65) * 28}deg`,
  }))

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(root.current.children, {
        opacity: 0,
        duration: 0.2,
        stagger: 0.11,
        scrollTrigger: { trigger: root.current, start: 'top 90%' },
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <div ref={root} className={`prints ${className}`} aria-hidden="true">
      {prints.map((p, i) => (
        <Print key={i} style={{ left: p.left, top: p.top, rotate: p.rotate }} />
      ))}
    </div>
  )
}
