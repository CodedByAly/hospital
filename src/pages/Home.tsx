import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { copy as t } from '../content/copy'
import { categories, itemsByCategory } from '../data/menu'
import type { CategoryId } from '../data/types'
import { restaurant, whatsappLink, phoneLink, mapsLink } from '../config/restaurant'
import { clock, money } from '../utils/format'
import { useUI } from '../store/ui'
import { usePageMeta } from '../hooks/usePageMeta'
import { Hero } from '../components/Hero'
import { MenuCard } from '../components/MenuCard'
import { Reveal } from '../components/Reveal'
import { imageUrl } from '../components/FoodImage'
import { SocialLinks } from '../components/SocialLinks'
import { Icon } from '../components/Icon'
import './Home.css'

export default function Home() {
  usePageMeta(null)
  return (
    <>
      <Hero />
      <Bundles />
      <Browse />
      <Sauces />
      <Visit />
    </>
  )
}

function SectionHead({ eyebrow, title, sub, action }: { eyebrow: string; title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <Reveal className="sec-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {sub && <p className="sec-head__sub">{sub}</p>}
      </div>
      {action}
    </Reveal>
  )
}

/* ------------------------------------------------------------------ */

function Bundles() {
  const bundles = itemsByCategory('bundles')
  return (
    <section className="section bundles" aria-labelledby="bundles-title" id="bundles">
      <div className="container">
        <SectionHead eyebrow={t.home.dealsEyebrow} title={t.home.dealsTitle} sub={t.home.dealsSub} />
        <ul className="bundles__grid">
          {bundles.map((b, i) => (
            <Reveal as="li" key={b.id} delay={(i % 3) * 0.06}>
              <MenuCard item={b} variant="tile" />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

const BROWSE: CategoryId[] = ['starters', 'finest-burgers', 'grilled-bliss', 'mac-mania', 'deluxe-fries', 'kids-meal']

function Browse() {
  const [cat, setCat] = useState<CategoryId>(BROWSE[0])
  const items = itemsByCategory(cat)
  return (
    <section className="section browse" aria-labelledby="browse-title">
      <div className="container">
        <SectionHead
          eyebrow={t.home.browseEyebrow}
          title={t.home.browseTitle}
          action={
            <Link to="/menu" className="btn btn--white btn--sm">
              {t.home.fullMenu} <Icon name="arrow" />
            </Link>
          }
        />
        <div className="browse__tabs" role="tablist" aria-label={t.home.browseTitle}>
          {BROWSE.map((id) => (
            <button key={id} type="button" role="tab" aria-selected={cat === id} className={`browse__tab ${cat === id ? 'is-on' : ''}`} onClick={() => setCat(id)}>
              {cat === id && <motion.span layoutId="browse-pill" className="browse__pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span>{categories.find((c) => c.id === id)!.name}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={cat}
            className="browse__list"
            role="tabpanel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {items.map((item) => (
              <li key={item.id}>
                <MenuCard item={item} />
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

function Sauces() {
  const sauces = itemsByCategory('sauce-boss')
  const [index, setIndex] = useState(1)
  const { openItem } = useUI()
  const drag = useRef<{ x: number } | null>(null)
  const touched = useRef(false)
  const go = useCallback((d: number) => setIndex((i) => (i + d + sauces.length) % sauces.length), [sauces.length])
  const current = sauces[index]

  useEffect(() => {
    const id = window.setInterval(() => !touched.current && go(1), 4500)
    return () => window.clearInterval(id)
  }, [go])

  const step = (d: number) => {
    touched.current = true
    go(d)
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') step(1)
    if (e.key === 'ArrowLeft') step(-1)
  }

  return (
    <section className="section sauces" aria-labelledby="sauces-title" aria-roledescription="carousel">
      <div className="container sauces__grid">
        <div className="sauces__copy">
          <p className="eyebrow">{t.home.saucesEyebrow}</p>
          <h2 id="sauces-title">{t.home.saucesTitle}</h2>
          <p className="sec-head__sub">{t.home.saucesSub}</p>
          <div className="sauces__detail" aria-live="polite">
            <motion.div key={current.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h3>{current.name}</h3>
              <p>{current.description}</p>
            </motion.div>
          </div>
          <div className="sauces__nav">
            <button type="button" className="icon-btn sauces__arrow" onClick={() => step(-1)} aria-label={t.home.prev}>
              <Icon name="back" />
            </button>
            <span className="sauces__count">{index + 1} / {sauces.length}</span>
            <button type="button" className="icon-btn sauces__arrow" onClick={() => step(1)} aria-label={t.home.next}>
              <Icon name="arrow" />
            </button>
            <button type="button" className="btn btn--white btn--sm sauces__add" onClick={() => openItem(current.id)}>
              {t.menu.add} · {money(current.price)}
            </button>
          </div>
        </div>

        <div
          className="sauces__stage"
          tabIndex={0}
          onKeyDown={onKey}
          onPointerDown={(e) => {
            drag.current = { x: e.clientX }
            touched.current = true
          }}
          onPointerUp={(e) => {
            if (!drag.current) return
            const dx = e.clientX - drag.current.x
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
            drag.current = null
          }}
          aria-label={t.home.saucesTitle}
        >
          {sauces.map((s, i) => {
            let off = i - index
            if (off > sauces.length / 2) off -= sauces.length
            if (off < -sauces.length / 2) off += sauces.length
            const abs = Math.abs(off)
            return (
              <button
                key={s.id}
                type="button"
                className="sauce-cup"
                tabIndex={-1}
                onClick={() => (off === 0 ? openItem(s.id) : setIndex(i))}
                style={{
                  transform: `translateX(${off * 56}%) translateZ(${-abs * 220}px) rotateY(${off * -34}deg)`,
                  zIndex: 10 - abs,
                  opacity: abs > 2 ? 0 : 1 - abs * 0.22,
                }}
                aria-hidden={off !== 0}
              >
                {s.image && <img src={imageUrl(s.image)} alt={s.name} width="680" height="680" loading="lazy" draggable={false} />}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

function Visit() {
  return (
    <section className="section visit" aria-labelledby="visit-title">
      <div className="container visit__grid">
        <Reveal className="visit__info">
          <p className="eyebrow">{t.home.visitEyebrow}</p>
          <h2 id="visit-title">{t.home.visitTitle}</h2>
          <dl className="visit__list">
            <div>
              <dt>{t.contact.hours}</dt>
              <dd>{t.contact.everyday}, {clock(restaurant.hours.open)} – {clock(restaurant.hours.close)}</dd>
            </div>
            <div>
              <dt>{t.contact.address}</dt>
              <dd><a href={mapsLink} target="_blank" rel="noreferrer">{restaurant.address}</a></dd>
            </div>
            <div>
              <dt>{t.contact.phone}</dt>
              <dd><a href={phoneLink}>{restaurant.phoneDisplay}</a></dd>
            </div>
            <div>
              <dt>{t.contact.email}</dt>
              <dd><a href={`mailto:${restaurant.email}`}>{restaurant.email}</a></dd>
            </div>
          </dl>
          <div className="visit__ctas">
            <a className="btn btn--wa" href={whatsappLink()} target="_blank" rel="noreferrer">
              <Icon name="whatsapp" /> {t.contact.whatsapp}
            </a>
            <a className="btn btn--white" href={mapsLink} target="_blank" rel="noreferrer">
              {t.home.directions}
            </a>
          </div>
          <SocialLinks className="visit__socials" />
        </Reveal>
        <Reveal delay={0.1} className="visit__map">
          <iframe
            title={`${restaurant.name} on the map`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(restaurant.mapsSearchQuery)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </div>
    </section>
  )
}
