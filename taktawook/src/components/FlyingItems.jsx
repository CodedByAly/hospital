import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Real food cut out of Taktawook's own photos, floating around a section.
// items: [{ src: 'cut-burger', x, y, mx?, my?, w, depth: 1..3, rotate, hideMobile? }]
// depth drives mouse and scroll movement, so nearer pieces move more.
export default function FlyingItems({ items, className = '', mouse = true }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    const el = root.current
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const nodes = gsap.utils.toArray(el.querySelectorAll('[data-flyer]'))

      nodes.forEach((node, i) => {
        const depth = Number(node.dataset.depth)

        // Thrown in from the side of the screen
        gsap.from(node, {
          x: (i % 2 ? 1 : -1) * gsap.utils.random(240, 480),
          y: gsap.utils.random(-200, 200),
          rotation: gsap.utils.random(-120, 120),
          opacity: 0,
          duration: 1.3,
          delay: 0.1 + i * 0.09,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        })

        // Hangs in the air
        gsap.to(node.querySelector('[data-idle]'), {
          y: `+=${gsap.utils.random(10, 22)}`,
          rotation: `+=${gsap.utils.random(-6, 6)}`,
          duration: gsap.utils.random(2.6, 4),
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: gsap.utils.random(0, 1.2),
        })

        // Drifts with the scroll
        gsap.to(node.querySelector('[data-scroll]'), {
          yPercent: -30 * depth,
          rotation: (i % 2 ? 1 : -1) * 8 * depth,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        })
      })

      if (!mouse) return undefined
      const movers = nodes.map((node) => {
        const target = node.querySelector('[data-mouse]')
        return {
          depth: Number(node.dataset.depth),
          x: gsap.quickTo(target, 'x', { duration: 1, ease: 'power3' }),
          y: gsap.quickTo(target, 'y', { duration: 1, ease: 'power3' }),
        }
      })
      const onMove = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5
        const ny = e.clientY / window.innerHeight - 0.5
        movers.forEach((m) => {
          m.x(nx * 28 * m.depth)
          m.y(ny * 28 * m.depth)
        })
      }
      window.addEventListener('pointermove', onMove)
      return () => window.removeEventListener('pointermove', onMove)
    })

    return () => mm.revert()
  }, [mouse])

  return (
    <div ref={root} className={`flyers ${className}`} aria-hidden="true">
      {items.map((it) => (
        <div
          key={it.src + it.x}
          data-flyer
          data-depth={it.depth ?? 1}
          className={`flyer ${it.hideMobile ? 'flyer--hide-sm' : ''}`}
          style={{ '--x': it.x, '--y': it.y, '--mx': it.mx ?? it.x, '--my': it.my ?? it.y, '--w': `${it.w}px` }}
        >
          <div data-scroll>
            <div data-idle>
              <div data-mouse>
                <img src={`/images/${it.src}.webp`} alt="" style={{ rotate: `${it.rotate ?? 0}deg` }} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
