import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import FlyingItems from './FlyingItems.jsx'
import Footprints from './Footprints.jsx'
import { WHATSAPP } from '../data/menu.js'

// Desktop spots (x, y) keep clear of the headline; mobile spots (mx, my) sit around it.
const FOOD = [
  { src: 'photo-tak-burger', x: '71%', y: '15%', w: 210, depth: 3, rotate: -6, mx: '48%', my: '67%' },
  { src: 'photo-wrap-1', x: '87%', y: '32%', w: 170, depth: 1, rotate: 7, hideMobile: true },
  { src: 'photo-popcorn', x: '77%', y: '54%', w: 200, depth: 2, rotate: -4, mx: '2%', my: '73%' },
  { src: 'photo-tenders', x: '49%', y: '66%', w: 180, depth: 1, rotate: 5, hideMobile: true },
  { src: 'photo-chili-burger', x: '64%', y: '80%', w: 160, depth: 2, rotate: -9, hideMobile: true },
  { src: 'photo-wrap-2', x: '-4%', y: '80%', w: 160, depth: 2, rotate: 8, hideMobile: true },
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
