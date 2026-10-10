import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import FlyingItems from './FlyingItems.jsx'
import Footprints from './Footprints.jsx'
import { WHATSAPP } from '../data/menu.js'

// Desktop spots (x, y) keep clear of the headline; mobile spots (mx, my) sit around it.
const FOOD = [
  { src: 'cut-burger', x: '70%', y: '12%', w: 220, depth: 3, rotate: -8, mx: '56%', my: '70%' },
  { src: 'cut-wings', x: '88%', y: '13%', w: 140, depth: 1, rotate: 14, hideMobile: true },
  { src: 'cut-sub', x: '76%', y: '47%', w: 290, depth: 2, rotate: 10, mx: '-14%', my: '74%' },
  { src: 'cut-curly', x: '47%', y: '64%', w: 190, depth: 1, rotate: -6, hideMobile: true },
  { src: 'cut-tenders', x: '64%', y: '82%', w: 120, depth: 2, rotate: -16, hideMobile: true },
  { src: 'cut-fries', x: '-5%', y: '80%', w: 180, depth: 2, rotate: 18, hideMobile: true },
]

export default function Hero() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.hero__title .hl > span', { yPercent: 105, duration: 1, stagger: 0.1, ease: 'power4.out' })
      gsap.from('.hero__sub, .hero__actions', { y: 24, opacity: 0, duration: 0.8, stagger: 0.12, delay: 0.45, ease: 'power3.out' })
    })
    return () => mm.revert()
  }, [])

  return (
    <section className="hero" id="top" ref={root}>
      <FlyingItems items={FOOD} />
      <Footprints className="hero__prints" />

      <div className="wrap hero__inner">
        <h1 className="hero__title">
          <span className="hl"><span>Experience</span></span>
          <span className="hl"><span>the original</span></span>
          <span className="hl hl--red"><span>taste.</span></span>
        </h1>
        <p className="hero__sub">
          Tawook, burgers, subs and grilled platters.
          <br />
          Sarba, Jounieh and Dora. Every day from 11:30 AM till midnight.
        </p>
        <div className="hero__actions">
          <a href="#menu" className="btn btn--red">See the menu</a>
          <a href={`https://wa.me/${WHATSAPP}`} className="btn btn--plain" target="_blank" rel="noreferrer">
            WhatsApp 03 131 140
          </a>
        </div>
      </div>
    </section>
  )
}
