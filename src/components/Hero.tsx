import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { copy as t } from '../content/copy'
import { useUI } from '../store/ui'
import { findItem, isOrderable } from '../data/menu'
import { restaurant, phoneLink } from '../config/restaurant'
import { money } from '../utils/format'
import { imageUrl } from './FoodImage'
import { OpenStatus } from './OpenStatus'
import { Icon } from './Icon'
import './Hero.css'

/** Dishes the hero photo cycles through. */
const SHOWCASE = ['kukus-chix', 'abou-kukus-combo', 'nashvillicious', 'ranch-rush-mac', 'holy-stripinity']

export function Hero() {
  const { openItem } = useUI()
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const item = findItem(SHOWCASE[index])!

  // Rotate the photo every few seconds.
  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % SHOWCASE.length), 5200)
    return () => window.clearInterval(id)
  }, [reduce])

  // Scroll: the stack tips back and sinks slightly as the page moves on.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const tiltX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 18]), { stiffness: 120, damping: 24 })
  const sink = useTransform(scrollYProgress, [0, 1], [0, 80])

  // Pointer: a slow, small tilt so the photos feel like objects on a table.
  const rx = useSpring(0, { stiffness: 90, damping: 18 })
  const ry = useSpring(0, { stiffness: 90, damping: 18 })
  const rotateX = useTransform([rx, tiltX], ([a, b]: number[]) => a + b)
  const onMove = (e: PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = stageRef.current!.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <section ref={sectionRef} className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <motion.p className="hero__eyebrow" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <OpenStatus />
          </motion.p>
          <motion.h1
            id="hero-title"
            className="hero__title"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="sr-only">{restaurant.name}. </span>
            {t.hero.title}
          </motion.h1>
          <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }}>
            <p className="hero__lede">{t.hero.lede}</p>
            <div className="hero__ctas">
              <Link to="/menu" className="btn btn--red">
                {t.nav.order} <Icon name="arrow" />
              </Link>
              <Link to="/menu" className="btn btn--white">
                {t.hero.ctaMenu}
              </Link>
            </div>
            <ul className="hero__facts">
              <li><Icon name="store" /> {t.hero.factPickup}</li>
              <li><Icon name="cash" /> {t.hero.factPay}</li>
              <li><Icon name="phone" /> <a href={phoneLink}>{restaurant.phoneDisplay}</a></li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          ref={stageRef}
          className="hero__stage"
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: reduce ? 0 : sink }}
        >
          <motion.div className="hero__stack" style={reduce ? undefined : { rotateX, rotateY: ry }}>
            <button type="button" className="hero__photo" onClick={() => openItem(item.id)} aria-label={`${item.name}, ${money(item.price)}`}>
              <AnimatePresence initial={false}>
                <motion.img
                  key={item.id}
                  src={imageUrl(item.image!)}
                  alt=""
                  width="680"
                  height="680"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                />
              </AnimatePresence>
              <span className="hero__sheen" aria-hidden="true" />
            </button>

            <div className="hero__caption-wrap">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={item.id}
                className="hero__caption"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4 }}
              >
                <span>
                  <strong>{item.name}</strong>
                  <small>{isOrderable(item) ? money(item.price) : t.menu.ask}</small>
                </span>
                <button type="button" className="hero__caption-add" onClick={() => openItem(item.id)} aria-label={`${t.menu.add} ${item.name}`}>
                  <Icon name="plus" />
                </button>
              </motion.div>
            </AnimatePresence>
            </div>
          </motion.div>

          <div className="hero__dots" role="tablist" aria-label={t.hero.dishes}>
            {SHOWCASE.map((id, i) => (
              <button key={id} type="button" role="tab" aria-selected={i === index} aria-label={findItem(id)?.name} className={i === index ? 'is-on' : ''} onClick={() => setIndex(i)} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
