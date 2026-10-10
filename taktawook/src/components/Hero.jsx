import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, MessageCircle } from 'lucide-react'
import FlyingItems from './FlyingItems.jsx'
import FootprintTrail from './FootprintTrail.jsx'
import { WHATSAPP } from '../data/menu.js'

const FLYERS = [
  { type: 'Fries', x: '33%', y: '10%', size: 92, depth: 1, rotate: 10, hideMobile: true },
  { type: 'Burger', x: '47%', y: '13%', size: 120, depth: 3, rotate: -12, mx: '-2%', my: '54%' },
  { type: 'Chili', x: '88%', y: '10%', size: 84, depth: 2, rotate: 20, mx: '80%', my: '7%' },
  { type: 'Drumstick', x: '0%', y: '74%', size: 104, depth: 2, rotate: 24, mx: '78%', my: '62%' },
  { type: 'Soda', x: '46%', y: '78%', size: 86, depth: 1, rotate: -8, hideMobile: true },
  { type: 'Wrap', x: '90%', y: '72%', size: 110, depth: 3, rotate: -18, mx: '70%', my: '90%' },
  { type: 'Chick', x: '48%', y: '88%', size: 72, depth: 2, rotate: 6, hideMobile: true },
]

const LINE_1 = ['The', 'original']
const LINE_2 = ['Lebanese', 'taste.']

export default function Hero() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('.hero__word > span', { yPercent: 110, rotate: 6, duration: 1.1, stagger: 0.08 })
        .from('.hero__eyebrow', { y: 20, opacity: 0, duration: 0.7 }, 0.1)
        .from('.hero__lead, .hero__ctas', { y: 30, opacity: 0, duration: 0.9, stagger: 0.12 }, 0.5)
        .from('.hero__photo', { scale: 0.6, rotate: -14, opacity: 0, duration: 1.4, ease: 'back.out(1.4)' }, 0.2)
        .from('.hero__sticker', { scale: 0, rotate: -180, duration: 1, ease: 'back.out(2)' }, 0.9)
      gsap.to('.hero__sticker-ring', { rotate: 360, duration: 18, ease: 'none', repeat: -1 })
    })
    return () => mm.revert()
  }, [])

  return (
    <section className="hero" id="top" ref={root}>
      <FlyingItems items={FLYERS} className="hero__flyers" />
      <FootprintTrail className="hero__trail" />

      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="hero__eyebrow">Lebanese chicken, grilled &amp; crispy</p>
          <h1 className="hero__title">
            <span className="hero__line">
              {LINE_1.map((w) => (
                <span className="hero__word" key={w}>
                  <span>{w}</span>
                </span>
              ))}
            </span>
            <span className="hero__line hero__line--accent">
              {LINE_2.map((w) => (
                <span className="hero__word" key={w}>
                  <span>{w}</span>
                </span>
              ))}
            </span>
          </h1>
          <p className="hero__lead">
            Tawook wraps, loaded burgers, crispy subs and charcoal-grilled platters. Made fresh in Sarba and
            Dora, delivered straight to your door.
          </p>
          <div className="hero__ctas">
            <a href="#menu" className="btn btn--primary">
              Explore the menu <ArrowRight size={20} aria-hidden="true" />
            </a>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              className="btn btn--ghost"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={20} aria-hidden="true" /> Order on WhatsApp
            </a>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__blob" aria-hidden="true" />
          <img
            className="hero__photo"
            src="/images/fries-burger.webp"
            alt="A Taktawook burger next to a box of curly fries and a glass of orange juice"
            width="739"
            height="892"
            fetchPriority="high"
          />
          <div className="hero__sticker" aria-hidden="true">
            <svg viewBox="0 0 200 200" className="hero__sticker-ring">
              <defs>
                <path id="ring" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
              </defs>
              <text>
                <textPath href="#ring">SAUCE • BITE • REPEAT • SAUCE • BITE • REPEAT •</textPath>
              </text>
            </svg>
            <img src="/images/logo.png" alt="" />
          </div>
        </div>
      </div>
    </section>
  )
}
