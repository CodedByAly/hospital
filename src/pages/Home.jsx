import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { fullMenuOffer, getItem } from '../data/menu'
import { restaurant } from '../config/restaurant'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import { useI18n } from '../i18n/I18nProvider'
import { formatPrice, toCents } from '../lib/price'
import { flyToCart } from '../lib/flyToCart'
import { formatTime } from '../lib/hours'
import OpenStatus from '../components/OpenStatus'
import HoursList from '../components/HoursList'
import FoodImage from '../components/FoodImage'
import SocialLinks from '../components/SocialLinks'
import Reveal from '../components/Reveal'
import Icon from '../components/Icon'
import './Home.css'

const signature = ['the-smasher', 'swiss-shroom', 'fried-chick'].map(getItem)
const sides = ['mozzarella-sticks', 'wings'].map(getItem)

export default function Home() {
  const { t, pick, lang } = useI18n()
  const { openItem, setMode } = useUI()
  const cart = useCart()
  const offerBtn = useRef(null)
  const address = pick(restaurant.address)
  const lines = (text) => text.split('\n').map((line, i) => <span key={i}>{line}</span>)

  const addOffer = () => {
    setMode('delivery')
    cart.add(fullMenuOffer.id, {}, 1)
    flyToCart(offerBtn.current, null)
  }

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="kicker">{t('home.eyebrow')}</p>
            <h1 className="hero__title">{lines(t('home.title'))}</h1>
            <p className="hero__lead">{t('home.lead')}</p>
            <div className="hero__actions">
              <Link to="/menu" className="btn btn--primary btn--lg" onClick={() => setMode('delivery')}>
                <Icon name="scooter" size={20} /> {t('home.orderCta')}
              </Link>
              <Link to="/menu" className="btn btn--ghost-light btn--lg">
                {t('home.menuCta')} <Icon name="arrow" size={18} className="icon--flip" />
              </Link>
            </div>
            <OpenStatus className="hero__status" />
          </div>

          <div className="hero__visual">
            <div className="hero__arch">
              <img
                src="/images/hero-burger.webp"
                alt={t('home.heroAlt')}
                width="591"
                height="485"
                fetchpriority="high"
                decoding="async"
              />
            </div>
            <div className="hero__ring" aria-hidden="true" />
            <p className="hero__badge">
              <Icon name="moon" size={16} /> {t('home.lateTitle')}
              <bdi className="time">
                {formatTime(restaurant.lateNight.open, lang)} – {formatTime(restaurant.lateNight.close, lang)}
              </bdi>
            </p>
          </div>
        </div>
      </section>

      <section className="fix" aria-labelledby="fix-title">
        <div className="container">
          <Reveal className="section-head">
            <div>
              <h2 id="fix-title">{t('home.fixTitle')}</h2>
              <p>{t('home.fixLead')}</p>
            </div>
            <Link to="/menu" className="text-link">
              {t('home.viewAll')} <Icon name="arrow" size={16} className="icon--flip" />
            </Link>
          </Reveal>

          <div className="fix__grid">
            {signature.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.08} className="sig">
                <button type="button" className="sig__btn" onClick={() => openItem(item.id)}>
                  <FoodImage item={item} sizes="(max-width: 700px) 90vw, 400px" />
                  <span className="sig__meta">
                    <span className="sig__name">{pick(item.name)}</span>
                    <span className="sig__price num">{formatPrice(toCents(item.price))}</span>
                  </span>
                  <span className="sig__desc">{pick(item.description)}</span>
                </button>
              </Reveal>
            ))}
          </div>

          <div className="sides">
            {sides.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.1} className="side">
                <button type="button" className="side__btn" onClick={() => openItem(item.id)}>
                  <FoodImage item={item} sizes="(max-width: 700px) 100vw, 600px" />
                  <span className="side__caption">
                    <span>{pick(item.name)}</span>
                    <span className="num">{formatPrice(toCents(item.price))}</span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="offer" aria-labelledby="offer-home">
        <Reveal className="container offer__inner">
          <p className="offer__kicker">{t('home.offerKicker')}</p>
          <h2 id="offer-home">
            {t('home.offerTitle')}{' '}
            <span className="offer__price num">{formatPrice(toCents(fullMenuOffer.price))}</span>
          </h2>
          <p className="offer__note">{t('home.offerNote')}</p>
          <button type="button" className="btn btn--dark btn--lg" onClick={addOffer} ref={offerBtn}>
            <Icon name="plus" size={18} /> {t('home.offerCta')}
          </button>
        </Reveal>
      </section>

      <section className="facts" aria-label={t('nav.about')}>
        <div className="container facts__grid">
          {[
            ['moon', 'late'],
            ['gamepad', 'lounge'],
            ['scooter', 'delivery'],
          ].map(([icon, key], i) => (
            <Reveal key={key} delay={i * 0.08} className="fact">
              <Icon name={icon} size={28} />
              <h3>{t(`home.${key}Title`)}</h3>
              <p>{t(`home.${key}Text`)}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="find" aria-labelledby="find-title">
        <div className="container find__grid">
          <Reveal className="find__copy">
            <h2 id="find-title">{lines(t('home.findTitle'))}</h2>
            <p className="find__lead">{t('home.findLead')}</p>
            <address className="find__address">
              <Icon name="pin" size={26} />
              <span>
                <strong>{address.area}</strong>
                <span>{address.street}</span>
                <span>{address.landmark}</span>
              </span>
            </address>
            <div className="find__actions">
              <a href={restaurant.mapsUrl} className="btn btn--dark" target="_blank" rel="noopener noreferrer">
                {t('home.directions')} <Icon name="arrow" size={18} className="icon--flip" />
              </a>
              <SocialLinks />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="find__hours">
            <h3>{t('about.hours')}</h3>
            <OpenStatus />
            <HoursList />
          </Reveal>
        </div>
      </section>
    </>
  )
}
