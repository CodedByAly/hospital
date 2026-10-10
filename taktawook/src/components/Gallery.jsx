import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SHOTS = [
  ['platter', 'Grilled chicken platter with fries, pickles, garlic sauce and spicy dip'],
  ['bbq-combo', 'BBQ burger combo with fries and a soft drink'],
  ['salad', 'Kale salad topped with sliced grilled chicken'],
  ['crispy-combo', 'Crispy sandwich combo with fries and a soft drink'],
  ['burgers', 'Two Taktawook burgers side by side'],
  ['wrap', 'Chicken tawook wrap cut open'],
  ['curly-fries', 'A bowl of curly fries with cocktail sauce'],
]

// On wide screens the strip is pinned and slides sideways as you scroll down.
// On phones (or with reduced motion) it's a normal swipeable row.
export default function Gallery() {
  const section = useRef(null)
  const track = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => track.current.scrollWidth - window.innerWidth + 48
      gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })
      gsap.utils.toArray('.shot img', track.current).forEach((img) => {
        gsap.fromTo(img, { scale: 1.25 }, {
          scale: 1, ease: 'none',
          scrollTrigger: { trigger: section.current, start: 'top top', end: () => `+=${distance()}`, scrub: true },
        })
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section className="gallery" ref={section} aria-labelledby="gallery-title">
      <div className="gallery__head container">
        <p className="eyebrow">Straight from the kitchen</p>
        <h2 id="gallery-title">Looks good. Tastes better.</h2>
      </div>
      <div className="gallery__viewport">
        <ul className="gallery__track" ref={track}>
          {SHOTS.map(([src, alt], i) => (
            <li key={src} className={`shot shot--${i % 3}`}>
              <img src={`/images/${src}.webp`} alt={alt} loading="lazy" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
