import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { copy as t } from '../content/copy'
import { useUI } from '../store/ui'
import { findItem, isOrderable, menu } from '../data/menu'
import { restaurant } from '../config/restaurant'
import { clock, money } from '../utils/format'
import { imageUrl } from './FoodImage'
import { OpenStatus } from './OpenStatus'
import { Icon } from './Icon'
import './Hero.css'

const HeroScene = lazy(() => import('../three/HeroScene'))

/** Dishes that float in the studio, in fly-through order. */
const DISHES = [
  'kukus-chix', 'nashvillicious', 'abou-kukus-combo', 'ranch-rush-mac', 'holy-stripinity', 'healers-fries',
  'shroom-lord', 'chicken-wings', 'crispy-meal', 'risky', 'heroes-fries', 'mini-corn-ribs', 'bbq-freak',
  'sweet-n-fire-mac', 'curly-fries', 'strips', 'bee-glory', 'banana-caramel-pudding',
]

const webglAvailable = () => {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

const useCompact = () => {
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 760px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)')
    const on = () => setCompact(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return compact
}

export function Hero() {
  const { openItem } = useUI()
  const reduce = useReducedMotion()
  const compact = useCompact()
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(true)
  const [ready, setReady] = useState(false)
  const use3D = useMemo(() => webglAvailable(), [])
  const fly = use3D && !reduce

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const still = useMotionValue(0)
  const progress = fly ? scrollYProgress : still

  const dishes = useMemo(
    () =>
      DISHES.slice(0, compact ? 14 : DISHES.length)
        .map(findItem)
        .filter((i) => i?.image)
        .map((i) => ({ id: i!.id, image: imageUrl(i!.image!, true), name: i!.name, price: isOrderable(i!) ? money(i!.price) : t.menu.ask })),
    [compact],
  )

  // Stop rendering once the hero has scrolled away.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const onReady = useCallback(() => setReady(true), [])

  return (
    <section ref={sectionRef} className={`hero ${fly ? 'hero--fly' : ''}`} aria-labelledby="hero-title">
      <div className="hero__sticky">
        <div className={`hero__scene ${ready ? 'is-ready' : ''}`}>
          {use3D && (
            <Suspense fallback={null}>
              <HeroScene dishes={dishes} progress={progress} active={active} compact={compact} onSelect={(id) => openItem(id)} onReady={onReady} />
            </Suspense>
          )}
          {!ready && <StaticStudio />}
        </div>

        <div className="container hero__overlay">
          <Stage progress={progress} range={[0, 0.06, 0.24, 0.32]} first className="hero__stage hero__stage--intro">
            <p className="hero__status"><OpenStatus /></p>
            <h1 id="hero-title" className="hero__title display">
              <span className="sr-only">{restaurant.name}: </span>
              {['The Rolls-Royce', 'of chicken', 'in Lebanon.'].map((line, i) => (
                <span key={line} className={`hero__line ${i === 2 ? 'hero__line--yellow' : ''}`}>
                  <motion.span
                    initial={reduce ? false : { y: '105%', rotateX: -70 }}
                    animate={{ y: 0, rotateX: 0 }}
                    transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.div initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}>
              <p className="hero__lede">{t.hero.lede}</p>
              <div className="hero__ctas">
                <Link to="/menu" className="btn btn--yellow">
                  {t.nav.order} <Icon name="arrow" />
                </Link>
                <a href="#deals" className="btn btn--white">
                  {t.hero.ctaDeals}
                </a>
              </div>
            </motion.div>
          </Stage>

          {fly && (
            <>
              <Stage progress={progress} range={[0.34, 0.42, 0.58, 0.66]} className="hero__stage hero__stage--mid">
                <p className="hero__kicker">{t.hero.midKicker}</p>
                <h2 className="hero__big display">
                  {t.hero.mid1}
                  <br />
                  <span>{t.hero.mid2}</span>
                </h2>
                <ul className="hero__facts">
                  <li><strong>{menu.length}</strong>{t.hero.factItems}</li>
                  <li><strong>8</strong>{t.hero.factSauces}</li>
                  <li><strong>{clock(restaurant.hours.open)}</strong>{t.hero.factOpen}</li>
                </ul>
              </Stage>
              <Stage progress={progress} range={[0.7, 0.78, 0.98, 1]} last className="hero__stage hero__stage--end">
                <h2 className="hero__big display">{t.hero.end}</h2>
                <Link to="/menu" className="btn btn--yellow hero__end-cta">
                  {t.hero.endCta} <Icon name="arrow" />
                </Link>
              </Stage>
            </>
          )}
        </div>

        {fly && <ScrollCue progress={progress} />}
        {use3D && <p className="hero__hint" aria-hidden="true">{t.hero.hint}</p>}
      </div>
    </section>
  )
}

/** Overlay copy that rises in and tilts away across a slice of the scroll. */
function Stage({ progress, range, first, last, className, children }: { progress: MotionValue<number>; range: [number, number, number, number]; first?: boolean; last?: boolean; className: string; children: ReactNode }) {
  const opacity = useTransform(progress, range, [first ? 1 : 0, 1, 1, last ? 1 : 0])
  const y = useTransform(progress, range, [first ? 0 : 70, 0, 0, last ? 0 : -70])
  const rotateX = useTransform(progress, range, [first ? 0 : -20, 0, 0, last ? 0 : 16])
  const visibility = useTransform(opacity, (o) => (o < 0.02 ? 'hidden' : 'visible'))
  return (
    <motion.div className={className} style={{ opacity, y, rotateX, visibility, transformPerspective: 1000 }}>
      {children}
    </motion.div>
  )
}

function ScrollCue({ progress }: { progress: MotionValue<number> }) {
  const scaleY = useTransform(progress, [0, 1], [0.04, 1])
  const opacity = useTransform(progress, [0.92, 1], [1, 0])
  return (
    <motion.div className="hero__cue" style={{ opacity }} aria-hidden="true">
      <span>{t.hero.scroll}</span>
      <i>
        <motion.b style={{ scaleY }} />
      </i>
    </motion.div>
  )
}

/** Shown while the 3D scene loads, and as the fallback without WebGL. */
function StaticStudio() {
  const ids = ['kukus-chix', 'nashvillicious', 'healers-fries']
  return (
    <div className="hero__static" aria-hidden="true">
      {ids.map((id, i) => {
        const item = findItem(id)
        return item?.image ? <img key={id} src={imageUrl(item.image, true)} alt="" className={`hero__static-${i}`} width="360" height="360" /> : null
      })}
    </div>
  )
}
