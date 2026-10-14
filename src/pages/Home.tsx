import { useCallback, useEffect, useRef, useState, type PointerEvent, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { copy as t } from '../content/copy'
import { categories, isOrderable, itemsByCategory, menu } from '../data/menu'
import type { MenuItem } from '../data/types'
import { restaurant, whatsappLink, phoneLink, mapsLink } from '../config/restaurant'
import { clock, money } from '../utils/format'
import { flyToCart } from '../utils/flyToCart'
import { useCart } from '../store/cart'
import { useUI } from '../store/ui'
import { usePageMeta } from '../hooks/usePageMeta'
import { Hero } from '../components/Hero'
import { TiltCard } from '../components/TiltCard'
import { FoodImage, imageUrl } from '../components/FoodImage'
import { SocialLinks } from '../components/SocialLinks'
import { Icon } from '../components/Icon'
import './Home.css'

export default function Home() {
  usePageMeta(null)
  return (
    <>
      <Hero />
      <Ticker />
      <Deals />
      <Board />
      <Sauces />
      <Visit />
    </>
  )
}

/* ------------------------------------------------------------------ */

function Ticker() {
  const names = menu.filter((m) => !['drinks', 'sauce-boss'].includes(m.category)).map((m) => m.name)
  const row = names.join('  •  ') + '  •  '
  return (
    <div className="ticker" aria-label={t.home.tickerLabel}>
      <div className="ticker__band">
        <div className="ticker__track" aria-hidden="true">
          <span>{row}</span>
          <span>{row}</span>
        </div>
        <p className="sr-only">{names.join(', ')}</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function Deals() {
  const reduce = useReducedMotion()
  const { openItem } = useUI()
  const bundles = itemsByCategory('bundles')
  return (
    <section className="deals section" id="deals" aria-labelledby="deals-title">
      <div className="container">
        <header className="deals__head">
          <h2 id="deals-title" className="display">{t.home.dealsTitle}</h2>
          <p>{t.home.dealsSub}</p>
        </header>
        <ul className="deals__grid">
          {bundles.map((b, i) => (
            <motion.li
              key={b.id}
              initial={reduce ? false : { opacity: 0, rotateY: i % 2 ? -65 : 65, rotateX: 10, y: 40 }}
              whileInView={{ opacity: 1, rotateY: 0, rotateX: 0, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -12% 0px' }}
              transition={{ type: 'spring', stiffness: 90, damping: 16, delay: (i % 3) * 0.08 }}
              style={{ transformPerspective: 1100 }}
            >
              <TiltCard max={8} className="ticket-wrap">
                <article className="ticket" onClick={() => openItem(b.id)}>
                  <div className="ticket__photo">
                    <FoodImage image={b.image} alt={b.name} sizes="(max-width: 760px) 90vw, 400px" />
                    {b.compareAt && (
                      <span className="ticket__stamp" aria-hidden="true">
                        <small>{t.home.was} {money(b.compareAt)}</small>
                        <strong>{money(b.price)}</strong>
                      </span>
                    )}
                  </div>
                  <div className="ticket__body">
                    <h3>{b.name}</h3>
                    <p>{b.description}</p>
                    <div className="ticket__foot">
                      <span className="price">
                        {money(b.price)}
                        {b.compareAt && <s>{money(b.compareAt)}</s>}
                      </span>
                      <button type="button" className="btn btn--yellow btn--sm" onClick={(e) => { e.stopPropagation(); openItem(b.id) }}>
                        {t.menu.add} <Icon name="plus" />
                      </button>
                    </div>
                  </div>
                </article>
              </TiltCard>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

const BOARD_SECTIONS = ['starters', 'mac-mania', 'finest-burgers', 'grilled-bliss', 'deluxe-fries', 'kids-meal'] as const

function Board() {
  const { openItem } = useUI()
  const { add } = useCart()
  const floatRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const f = floatRef.current
    const w = wrapRef.current
    if (!f || !w || e.pointerType !== 'mouse') return
    const r = w.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const tilt = (x / r.width - 0.5) * 30
    f.style.transform = `translate3d(${x + 30}px, ${y - 110}px, 0) perspective(700px) rotateY(${tilt}deg) rotateZ(${tilt / 6}deg)`
  }
  const show = (item?: MenuItem) => {
    const f = floatRef.current
    if (!f || !imgRef.current) return
    if (item?.image) {
      imgRef.current.src = imageUrl(item.image, true)
      f.dataset.on = 'true'
    } else f.dataset.on = 'false'
  }

  const order = (item: MenuItem, el: HTMLElement) => {
    const needs = (item.options ?? []).some((g) => g.required)
    if (!isOrderable(item) || needs) return openItem(item.id)
    flyToCart(el.getBoundingClientRect(), item.image ? imageUrl(item.image, true) : undefined)
    add({ itemId: item.id, qty: 1, selections: {}, removed: [], notes: '' })
  }

  return (
    <section className="board section" aria-labelledby="board-title">
      <div className="container">
        <div className="board__frame" ref={wrapRef} onPointerMove={move} onPointerLeave={() => show()}>
          <header className="board__head">
            <h2 id="board-title" className="display">{t.home.boardTitle}</h2>
            <p>{t.home.boardSub}</p>
          </header>
          <div className="board__cols">
            {BOARD_SECTIONS.map((id) => {
              const cat = categories.find((c) => c.id === id)!
              return (
                <div key={id} className="board__group">
                  <h3>{cat.name}</h3>
                  <ul>
                    {itemsByCategory(id).map((item) => (
                      <li key={item.id} onPointerEnter={() => show(item)}>
                        <button type="button" className="board__row" onClick={() => openItem(item.id)}>
                          <span className="board__name">{item.name}</span>
                          <span className="board__dots" aria-hidden="true" />
                          <span className="board__price">{isOrderable(item) ? money(item.price) : t.menu.ask}</span>
                        </button>
                        <button type="button" className="board__add" aria-label={`${t.menu.add} ${item.name}`} onClick={(e) => order(item, e.currentTarget)}>
                          <Icon name="plus" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
          <Link to="/menu" className="btn btn--yellow board__all">
            {t.home.fullMenu} <Icon name="arrow" />
          </Link>
          <div className="board__float" ref={floatRef} data-on="false" aria-hidden="true">
            <img ref={imgRef} alt="" width="360" height="360" />
          </div>
        </div>
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
  const go = useCallback((d: number) => setIndex((i) => (i + d + sauces.length) % sauces.length), [sauces.length])
  const current = sauces[index]

  // Gentle auto-advance until the visitor interacts.
  const touched = useRef(false)
  useEffect(() => {
    const id = window.setInterval(() => !touched.current && go(1), 4200)
    return () => window.clearInterval(id)
  }, [go])

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { touched.current = true; go(1) }
    if (e.key === 'ArrowLeft') { touched.current = true; go(-1) }
  }

  return (
    <section className="sauces section" aria-labelledby="sauces-title" aria-roledescription="carousel">
      <div className="container sauces__grid">
        <div className="sauces__copy">
          <h2 id="sauces-title" className="display">{t.home.saucesTitle}</h2>
          <p>{t.home.saucesSub}</p>
          <div className="sauces__detail" aria-live="polite">
            <motion.div key={current.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h3 className="display">{current.name}</h3>
              <p>{current.description}</p>
              <div className="sauces__actions">
                <span className="price">{money(current.price)}</span>
                <button type="button" className="btn btn--yellow btn--sm" onClick={() => openItem(current.id)}>
                  {t.menu.add} <Icon name="plus" />
                </button>
              </div>
            </motion.div>
          </div>
          <div className="sauces__nav">
            <button type="button" className="btn btn--white btn--sm" onClick={() => { touched.current = true; go(-1) }} aria-label={t.home.prev}>
              <Icon name="back" />
            </button>
            <span className="sauces__count">{String(index + 1).padStart(2, '0')} / {String(sauces.length).padStart(2, '0')}</span>
            <button type="button" className="btn btn--white btn--sm" onClick={() => { touched.current = true; go(1) }} aria-label={t.home.next}>
              <Icon name="arrow" />
            </button>
          </div>
        </div>

        <div
          className="sauces__stage"
          tabIndex={0}
          onKeyDown={onKey}
          onPointerDown={(e) => { drag.current = { x: e.clientX }; touched.current = true }}
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
                  transform: `translateX(${off * 58}%) translateZ(${-abs * 240}px) rotateY(${off * -42}deg)`,
                  zIndex: 10 - abs,
                  opacity: abs > 2 ? 0 : 1 - abs * 0.18,
                  filter: `blur(${abs > 0 ? abs * 1.2 : 0}px)`,
                }}
                aria-hidden={off !== 0}
              >
                {s.image && <img src={imageUrl(s.image)} alt={s.name} width="680" height="680" loading="lazy" draggable={false} />}
                <span className="sauce-cup__shadow" aria-hidden="true" />
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
    <section className="visit" aria-labelledby="visit-title">
      <div className="container visit__grid">
        <div className="visit__info">
          <h2 id="visit-title" className="display">
            {t.home.visitTitle}
            <br />
            <span>{t.home.visitSub}</span>
          </h2>
          <p className="visit__hours">
            {clock(restaurant.hours.open)} – {clock(restaurant.hours.close)}
          </p>
          <ul className="visit__lines">
            <li><Icon name="phone" /><a href={phoneLink}>{restaurant.phoneDisplay}</a></li>
            <li><Icon name="mail" /><a href={`mailto:${restaurant.email}`}>{restaurant.email}</a></li>
            <li><Icon name="pin" /><a href={mapsLink} target="_blank" rel="noreferrer">{restaurant.address}</a></li>
          </ul>
          <div className="visit__ctas">
            <a className="btn btn--wa" href={whatsappLink()} target="_blank" rel="noreferrer">
              <Icon name="whatsapp" /> {t.contact.whatsapp}
            </a>
            <a className="btn btn--white" href={mapsLink} target="_blank" rel="noreferrer">
              <Icon name="pin" /> {t.home.directions}
            </a>
          </div>
          <SocialLinks className="visit__socials" />
        </div>
        <div className="visit__map">
          <iframe
            title={`${restaurant.name} on the map`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(restaurant.mapsSearchQuery)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}
