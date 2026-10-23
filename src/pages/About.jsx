import { Link } from 'react-router-dom'
import { restaurant } from '../config/restaurant'
import { t } from '../content/text'
import HoursList from '../components/HoursList'
import OpenStatus from '../components/OpenStatus'
import Reveal from '../components/Reveal'
import Icon from '../components/Icon'
import './InfoPages.css'

export default function About() {
  const address = restaurant.address

  return (
    <div className="info-page">
      <header className="info-hero">
        <div className="container">
          <p className="kicker">{restaurant.tagline}</p>
          <h1>{t('about.title')}</h1>
          <p className="info-hero__lead">{t('about.lead')}</p>
        </div>
      </header>

      <section className="container about-story">
        <Reveal className="about-story__text">
          {t('about.body').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          <Link to="/menu" className="btn btn--dark">
            {t('home.menuCta')} <Icon name="arrow" size={18} className="icon--flip" />
          </Link>
        </Reveal>
        <Reveal delay={0.1} className="about-story__photos">
          <img src="/images/fried-chick-tray.webp" alt="A crispy chicken burger on a tray" width="500" height="395" loading="lazy" decoding="async" />
          <img src="/images/wings.webp" alt="Wings from Moods Burger" width="591" height="385" loading="lazy" decoding="async" />
        </Reveal>
      </section>

      <section className="about-services">
        <div className="container">
          <h2 className="info-title">{t('about.services')}</h2>
          <div className="about-services__grid">
            {[
              ['pin', 'dineIn'],
              ['scooter', 'delivery'],
              ['gamepad', 'lounge'],
            ].map(([icon, key], i) => (
              <Reveal key={key} delay={i * 0.08} className="about-service">
                <Icon name={icon} size={26} />
                <h3>{t(`about.${key}`)}</h3>
                <p>{t(`about.${key}Text`)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container about-visit">
        <Reveal className="about-visit__card">
          <h2 className="info-title">{t('about.hours')}</h2>
          <OpenStatus />
          <HoursList />
        </Reveal>
        <Reveal delay={0.1} className="about-visit__card">
          <h2 className="info-title">{t('contact.address')}</h2>
          <address>
            <strong>{address.area}</strong>
            <br />
            {address.street}
            <br />
            {address.landmark}
          </address>
          <a href={restaurant.mapsUrl} className="btn btn--ghost" target="_blank" rel="noopener noreferrer">
            <Icon name="pin" size={18} /> {t('home.directions')}
          </a>
        </Reveal>
      </section>
    </div>
  )
}
