import { useRef, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { useLang, fmt } from '../i18n/LanguageProvider'
import { categories, featuredIds, findItem, itemsByCategory } from '../data/menu'
import type { MenuItem } from '../data/types'
import { restaurant, whatsappLink, phoneLink, mapsLink } from '../config/restaurant'
import { clock, num } from '../utils/format'
import { usePageMeta } from '../hooks/usePageMeta'
import { Hero } from '../components/Hero'
import { MenuCard } from '../components/MenuCard'
import { Reveal } from '../components/Reveal'
import { SocialLinks } from '../components/SocialLinks'
import { imageUrl } from '../components/FoodImage'
import { Icon } from '../components/Icon'
import './Home.css'

export default function Home() {
  const { t, l, lang } = useLang()
  usePageMeta(null)
  const featured = featuredIds.map(findItem).filter(Boolean) as MenuItem[]

  return (
    <>
      <Hero />

      <section className="section featured" aria-labelledby="featured-title">
        <div className="container">
          <div className="section-head">
            <Reveal>
              <p className="eyebrow">{l(restaurant.specialties)}</p>
              <h2 id="featured-title">{t.home.featuredTitle}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p>{t.home.featuredSub}</p>
              <Link to="/menu" className="btn btn--ghost btn--sm featured__all">
                {t.home.fullMenu} <Icon name="arrow" className="flip-rtl" />
              </Link>
            </Reveal>
          </div>
          <ul className="featured__grid">
            {featured.map((item, i) => (
              <Reveal as="li" key={item.id} delay={(i % 4) * 0.06}>
                <MenuCard item={item} variant="feature" />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CategoryIndex />

      <section className="section how" aria-labelledby="how-title">
        <div className="container">
          <Reveal>
            <h2 id="how-title" className="how__title">{t.home.howTitle}</h2>
          </Reveal>
          <ol className="how__steps">
            {t.home.how.map((s, i) => (
              <Reveal as="li" key={s.t} delay={i * 0.08} className="how__step">
                <span className="how__num" aria-hidden="true">{num(i + 1, lang)}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section visit" aria-labelledby="visit-title">
        <div className="container visit__grid">
          <Reveal className="visit__info">
            <p className="eyebrow">{l(restaurant.address)}</p>
            <h2 id="visit-title">{t.home.visitTitle}</h2>
            <dl className="visit__list">
              <div>
                <dt><Icon name="clock" /> {t.contact.hours}</dt>
                <dd>{t.contact.everyday} · <span dir="ltr">{clock(restaurant.hours.open, lang)} – {clock(restaurant.hours.close, lang)}</span></dd>
              </div>
              <div>
                <dt><Icon name="pin" /> {t.contact.address}</dt>
                <dd><a href={mapsLink} target="_blank" rel="noreferrer">{l(restaurant.address)}</a></dd>
              </div>
              <div>
                <dt><Icon name="phone" /> {t.contact.phone}</dt>
                <dd><a href={phoneLink} dir="ltr">{restaurant.phoneDisplay}</a></dd>
              </div>
            </dl>
            <div className="visit__ctas">
              <a className="btn btn--wa" href={whatsappLink()} target="_blank" rel="noreferrer">
                <Icon name="whatsapp" /> {t.contact.whatsapp}
              </a>
              <a className="btn btn--ghost" href={mapsLink} target="_blank" rel="noreferrer">
                <Icon name="pin" /> {t.contact.directions}
              </a>
            </div>
            <SocialLinks className="visit__socials" />
          </Reveal>
          <Reveal delay={0.1} className="visit__map">
            <iframe
              title={`${restaurant.name} — map`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(restaurant.mapsSearchQuery)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>
    </>
  )
}

/** Typographic index of every menu section, with a floating 3D photo that follows the cursor. */
function CategoryIndex() {
  const { t, l, lang } = useLang()
  const floatRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const move = (e: PointerEvent<HTMLElement>) => {
    const f = floatRef.current
    if (!f || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const tilt = ((x / r.width) - 0.5) * 24
    f.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) perspective(700px) rotateY(${tilt}deg) rotateX(${-tilt / 3}deg)`
  }

  const show = (image?: string) => {
    const f = floatRef.current
    const img = imgRef.current
    if (!f || !img) return
    if (image) {
      img.src = imageUrl(image, true)
      f.dataset.on = 'true'
    } else {
      f.dataset.on = 'false'
    }
  }

  return (
    <section className="section cats" aria-labelledby="cats-title">
      <div className="container">
        <Reveal>
          <h2 id="cats-title" className="cats__title">{t.home.categoriesTitle}</h2>
        </Reveal>
        <div className="cats__wrap" onPointerMove={move} onPointerLeave={() => show()}>
        <ul className="cats__list">
          {categories.map((c, i) => {
            const items = itemsByCategory(c.id)
            const cover = items.find((it) => it.image)?.image
            return (
              <li key={c.id} onPointerEnter={() => show(cover)}>
                <Link to={`/menu#${c.id}`} className="cats__row">
                  <span className="cats__idx" aria-hidden="true">{num(i + 1, lang).padStart(2, '0')}</span>
                  <span className="cats__name">{l(c.name)}</span>
                  <span className="cats__count">{items.length === 1 ? t.menu.item : fmt(t.menu.items, { n: num(items.length, lang) })}</span>
                  <Icon name="arrow" className="cats__arrow flip-rtl" />
                </Link>
              </li>
            )
          })}
        </ul>
        <div className="cats__float" ref={floatRef} aria-hidden="true" data-on="false">
          <img ref={imgRef} alt="" width="360" height="360" />
        </div>
        </div>
      </div>
    </section>
  )
}
