import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Footprint } from './FoodIcons.jsx'

gsap.registerPlugin(ScrollTrigger)

// The little chicken walking across the page, same as the printed menu.
// Prints appear one by one as the trail scrolls into view.
const STEPS = Array.from({ length: 14 }, (_, i) => ({
  x: i * 7.2,
  y: 50 + Math.sin(i * 0.7) * 26 + (i % 2 ? 8 : -8),
  r: 90 + Math.cos(i * 0.7) * 30,
}))

export default function FootprintTrail({ className = '' }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(root.current.children, {
        opacity: 0,
        scale: 0.3,
        duration: 0.25,
        stagger: 0.12,
        ease: 'back.out(3)',
        scrollTrigger: { trigger: root.current, start: 'top 90%' },
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <div ref={root} className={`trail ${className}`} aria-hidden="true">
      {STEPS.map((s, i) => (
        <Footprint
          key={i}
          className="trail__print"
          style={{ left: `${s.x}%`, top: `${s.y}%`, transform: `rotate(${s.r}deg)` }}
        />
      ))}
    </div>
  )
}
