import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { restaurant, whatsappLink, phoneLink } from '../config/restaurant'
import { categories, getItem, menuItems } from '../data/menu'
import { usePageMeta } from '../hooks/usePageMeta'
import { useLang } from '../i18n/LanguageContext'
import { formatPrice } from '../lib/format'
import MenuCard, { useQuickAdd } from '../components/MenuCard'
import OpenStatus from '../components/OpenStatus'
import Reveal from '../components/Reveal'
import { ArrowIcon, ClockIcon, InstagramIcon, PhoneIcon, PinIcon, PlusIcon, StoreIcon, WhatsAppIcon } from '../components/Icons'
import chickenWrap from '../assets/images/chicken-wrap.webp'

export default function Home() {
  usePageMeta(null)
  const { t } = useLang()
  const offers = menuItems.filter((i) => i.category === 'offers')
  const wraps = menuItems.filter((i) => i.category === 'wraps')

  return (
    <>
      <Hero />

      <section className="section offers" aria-labelledby="offers-title">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">{t('home.offersKicker')}</p>
            <h2 id="offers-title" className="section-title">
              {t('home.offers')}
            </h2>
          </Reveal>
          <div className="offer-grid">
            {offers.map((item, i) => (
              <Reveal key={item.id} delay={i * 80}>
                <MenuCard item={item} size="lg" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--paper2" aria-labelledby="wraps-title">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">{t('nav.menu')}</p>
            <h2 id="wraps-title" className="section-title">
              {t('home.favourites')}
            </h2>
            <Link to="/menu" className="link-arrow">
              {t('home.fullMenu')} <ArrowIcon size={18} />
            </Link>
          </Reveal>
          <div className="card-grid">
            {wraps.map((item, i) => (
              <Reveal key={item.id} delay={(i % 4) * 60}>
                <MenuCard item={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CategoryIndex />
      <VisitStrip />

      <section className="section insta" aria-labelledby="insta-title">
        <Reveal className="container insta__inner">
          <InstagramIcon size={30} />
          <div>
            <h2 id="insta-title" className="insta__title">
              {t('home.insta')}
            </h2>
            <a href={restaurant.social.instagram.url} target="_blank" rel="noopener noreferrer" className="insta__handle" dir="ltr">
              @{restaurant.social.instagram.handle}
            </a>
          </div>
          <a href={restaurant.social.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn--outline">
            {t('home.follow')}
          </a>
        </Reveal>
      </section>
    </>
  )
}

function Hero() {
  const { t, pick } = useLang()
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="hero__kicker">
            <OpenStatus />
            <span aria-hidden="true">·</span>
            <span>{t('home.kicker')}</span>
          </p>
          <h1 id="hero-title" className="hero__title">
            <span className="hero__name">{pick(restaurant.name)}</span>
            <span className="hero__line">{pick(restaurant.tagline)}</span>
          </h1>
          <p className="hero__lead">{t('home.lead')}</p>
          <div className="hero__actions">
            <Link to="/menu" className="btn btn--primary btn--large">
              {t('home.order')}
            </Link>
            <a href={whatsappLink(t('home.waGreeting'))} className="btn btn--outline btn--large" target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon size={20} />
              {t('home.whatsapp')}
            </a>
          </div>
          <ul className="hero__facts">
            <li>
              <ClockIcon size={18} />
              {pick(restaurant.hoursLabel)}
            </li>
            <li>
              <StoreIcon size={18} />
              {t('home.pickupDelivery')}
            </li>
          </ul>
        </div>

        <div className="hero__visual">
          <div className="hero__photo">
            <img src={chickenWrap} alt={t('home.photoAlt')} width="591" height="600" fetchPriority="high" decoding="async" />
          </div>
          <HeroTag />
        </div>
      </div>
    </section>
  )
}

function HeroTag() {
  const { t, pick, lang } = useLang()
  const item = getItem('wrap-chicken-large')
  const ref = useRef(null)
  const quickAdd = useQuickAdd(item, ref)
  return (
    <div className="hero__tag" ref={ref}>
      <span className="hero__tag-text">
        <span className="hero__tag-name">{pick(item.name)}</span>
        <span className="hero__tag-price">{formatPrice(item.price, lang)}</span>
      </span>
      <button type="button" className="add-btn add-btn--light" onClick={quickAdd} aria-label={t('item.addNamed', { name: pick(item.name) })}>
        <PlusIcon size={18} />
      </button>
    </div>
  )
}

function CategoryIndex() {
  const { t, pick } = useLang()
  const groups = categories.map((c) => ({ ...c, count: menuItems.filter((i) => i.category === c.id).length })).filter((c) => c.count)
  return (
    <section className="section cat-index" aria-labelledby="cats-title">
      <div className="container cat-index__inner">
        <Reveal className="cat-index__head">
          <h2 id="cats-title" className="section-title section-title--light">
            {t('home.categories')}
          </h2>
          <p className="cat-index__lead">{t('home.categoriesLead')}</p>
          <p className="cat-index__lead">{t('menu.prices')}</p>
        </Reveal>
        <Reveal as="ul" className="cat-index__list" delay={80}>
          {groups.map((g) => (
            <li key={g.id}>
              <Link to={`/menu#cat-${g.id}`} className="cat-index__link">
                <span className="cat-index__name">{pick(g.name)}</span>
                <span className="cat-index__count">{t('home.itemsCount', { count: g.count })}</span>
                <ArrowIcon size={18} />
              </Link>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

function VisitStrip() {
  const { t, pick } = useLang()
  return (
    <section className="section service" aria-label={t('home.find')}>
      <div className="container">
        <div className="service__grid">
          <Reveal className="service__item">
            <PinIcon size={26} />
            <h3>{t('home.find')}</h3>
            <p>{pick(restaurant.address)}</p>
            <p>
              <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">
                {t('home.openMap')}
              </a>
            </p>
          </Reveal>
          <Reveal className="service__item" delay={60}>
            <ClockIcon size={26} />
            <h3>{t('home.hours')}</h3>
            <p>{pick(restaurant.hoursLabel)}</p>
            <OpenStatus />
          </Reveal>
          <Reveal className="service__item" delay={120}>
            <PhoneIcon size={26} />
            <h3>{t('home.call')}</h3>
            <p>
              <a href={phoneLink} dir="ltr">
                {restaurant.phone.display}
              </a>
            </p>
            <p>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
