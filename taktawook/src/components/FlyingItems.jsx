import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FLYERS } from './FoodIcons.jsx'

gsap.registerPlugin(ScrollTrigger)

// items: [{ type: 'Burger', x: '8%', y: '20%', size: 110, depth: 1..3, rotate }]
// depth drives both the mouse parallax strength and the scroll speed, so
// "closer" items move more and sell the 3D effect.
export default function FlyingItems({ items, className = '', mouse = true }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    const el = root.current
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const nodes = gsap.utils.toArray(el.querySelectorAll('[data-flyer]'))

      nodes.forEach((node, i) => {
        const depth = Number(node.dataset.depth)
        const scrollLayer = node.querySelector('[data-scroll]')
        const idleLayer = node.querySelector('[data-idle]')

        // Entrance: items fly in from off-screen with a spin
        gsap.from(node, {
          x: (i % 2 ? 1 : -1) * gsap.utils.random(200, 420),
          y: gsap.utils.random(-260, 260),
          rotation: gsap.utils.random(-200, 200),
          scale: 0.2,
          opacity: 0,
          duration: 1.4,
          delay: 0.15 + i * 0.08,
          ease: 'back.out(1.6)',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        })

        // Idle: endless bobbing and wobbling in the air
        gsap.to(idleLayer, {
          y: `+=${gsap.utils.random(14, 30)}`,
          rotation: `+=${gsap.utils.random(-14, 14)}`,
          duration: gsap.utils.random(2.2, 3.8),
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: gsap.utils.random(0, 1.5),
        })

        // Scroll: nearer items drift up faster than far ones
        gsap.to(scrollLayer, {
          yPercent: -40 * depth,
          rotation: `+=${(i % 2 ? 1 : -1) * 25 * depth}`,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        })
      })

      if (!mouse) return undefined
      const movers = nodes.map((node) => ({
        depth: Number(node.dataset.depth),
        x: gsap.quickTo(node.querySelector('[data-mouse]'), 'x', { duration: 0.9, ease: 'power3' }),
        y: gsap.quickTo(node.querySelector('[data-mouse]'), 'y', { duration: 0.9, ease: 'power3' }),
      }))
      const onMove = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5
        const ny = e.clientY / window.innerHeight - 0.5
        movers.forEach((m) => {
          m.x(nx * 36 * m.depth)
          m.y(ny * 36 * m.depth)
        })
      }
      window.addEventListener('pointermove', onMove)
      return () => window.removeEventListener('pointermove', onMove)
    })

    return () => mm.revert()
  }, [mouse])

  return (
    <div ref={root} className={`flyers ${className}`} aria-hidden="true">
      {items.map((it, i) => {
        const Icon = FLYERS[it.type]
        return (
          <div
            key={i}
            data-flyer
            data-depth={it.depth ?? 1}
            className={`flyer flyer--d${it.depth ?? 1} ${it.hideMobile ? 'flyer--hide-sm' : ''}`}
            style={{ '--x': it.x, '--y': it.y, '--mx': it.mx ?? it.x, '--my': it.my ?? it.y, width: it.size, height: it.size }}
          >
            <div data-scroll>
              <div data-idle>
                <div data-mouse>
                  <Icon width="100%" height="100%" style={{ transform: `rotate(${it.rotate ?? 0}deg)` }} />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
