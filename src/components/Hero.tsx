import { Fragment, lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useLang } from '../i18n/LanguageProvider'
import { useUI } from '../store/ui'
import { findItem, isOrderable } from '../data/menu'
import { money } from '../utils/format'
import { restaurant } from '../config/restaurant'
import { storage } from '../utils/storage'
import { imageUrl } from './FoodImage'
import { OpenStatus } from './OpenStatus'
import { Icon } from './Icon'
import './Hero.css'

const HeroScene = lazy(() => import('../three/HeroScene'))

const RING = ['kukus-chix', 'abou-kukus-combo', 'nashvillicious', 'ranch-rush-mac', 'holy-stripinity', 'healers-fries', 'shroom-lord', 'chicken-wings', 'crispy-meal', 'risky']

const webglAvailable = () => {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGL2RenderingContext && c.getContext('webgl2')) || !!c.getContext('webgl')
  } catch {
    return false
  }
}

export function Hero() {
  const { t, l, dir } = useLang()
  const { openItem } = useUI()
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(true)
  const [ready, setReady] = useState(false)
  const [frontId, setFrontId] = useState(RING[0])
  const use3D = useMemo(() => !reduce && webglAvailable(), [reduce])

  const cards = useMemo(
    () => RING.map((id) => findItem(id)).filter((i) => i?.image).map((i) => ({ id: i!.id, image: imageUrl(i!.image!, true) })),
    [],
  )
  const front = findItem(frontId)

  // Pause rendering when the hero is scrolled out of view.
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const onReady = useCallback(() => setReady(true), [])
  const onFront = useCallback((id: string) => setFrontId(id), [])

  const words = (s: string) =>
    s.split(' ').map((w, i) => (
      <Fragment key={i}>
        <span className="hero__word">
          <motion.span
            initial={reduce ? false : { y: '110%', rotateX: -60 }}
            animate={{ y: 0, rotateX: 0 }}
            transition={{ duration: 0.9, delay: 0.25 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}
          </motion.span>
        </span>{' '}
      </Fragment>
    ))

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true" />
      <div className="container hero__grid">
        <div className="hero__copy">
          <motion.p className="hero__eyebrow" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <OpenStatus />
          </motion.p>
          <h1 id="hero-title" className="hero__title">
            <span className="sr-only">{restaurant.name} — </span>
            <span className="hero__line">{words(t.hero.title1)}</span>
            <span className="hero__line hero__line--accent">{words(t.hero.title2)}</span>
          </h1>
          <motion.p className="hero__lede" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.7 }}>
            <strong>{l(restaurant.tagline)}</strong> {t.hero.lede}
          </motion.p>
          <motion.div className="hero__ctas" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7 }}>
            <Link to="/menu" className="btn btn--yellow">
              {t.hero.ctaMenu}
              <Icon name="arrow" className="flip-rtl" />
            </Link>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                storage.set('kuku.orderType', 'pickup')
                navigate('/menu')
              }}
            >
              <Icon name="store" />
              {t.hero.ctaPickup}
            </button>
          </motion.div>
          <p className="hero__meta">
            <span>{t.hero.eyebrow}</span>
          </p>
        </div>

        <div className={`hero__stage ${ready ? 'is-ready' : ''}`} ref={stageRef}>
          {use3D ? (
            <>
              <div className="hero__canvas">
                <Suspense fallback={null}>
                  <HeroScene cards={cards} active={active} rtl={dir === 'rtl'} onSelect={(id) => openItem(id)} onFront={onFront} onReady={onReady} />
                </Suspense>
              </div>
              {!ready && <StaticStack />}
            </>
          ) : (
            <StaticStack />
          )}

          {front && (
            <button type="button" className="hero__caption" onClick={() => openItem(front.id)}>
              <span className="hero__caption-name">{front.name}</span>
              <span className="hero__caption-price price">{isOrderable(front) ? money(front.price) : t.menu.ask}</span>
              <span className="hero__caption-cta">
                {t.menu.add} <Icon name="plus" />
              </span>
            </button>
          )}
          {use3D && (
            <p className="hero__hint" aria-hidden="true">
              <Icon name="rotate" /> {t.hero.drag}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

/** Fallback / loading state: three photos fanned out in CSS 3D. */
function StaticStack() {
  const ids = ['healers-fries', 'kukus-chix', 'nashvillicious']
  return (
    <div className="hero__stack" aria-hidden="true">
      {ids.map((id, i) => {
        const item = findItem(id)
        return item?.image ? <img key={id} src={imageUrl(item.image, true)} alt="" style={{ ['--i' as string]: i - 1 }} width="360" height="360" /> : null
      })}
    </div>
  )
}
