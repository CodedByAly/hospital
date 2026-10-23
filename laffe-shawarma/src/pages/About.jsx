import { Link } from 'react-router-dom'
import { phoneLink, restaurant, whatsappLink } from '../config/restaurant'
import { usePageMeta } from '../hooks/usePageMeta'
import { useLang } from '../i18n/LanguageContext'
import OpenStatus from '../components/OpenStatus'
import Reveal from '../components/Reveal'
import SocialLinks from '../components/SocialLinks'
import logoMark from '../assets/images/logo-mark.webp'

export default function About() {
  const { t, pick } = useLang()
  usePageMeta(t('about.title'), pick(restaurant.description))
  const { pickup, delivery } = restaurant.ordering

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <p className="eyebrow eyebrow--gold">{t('about.title')}</p>
          <h1 className="page-title">{pick(restaurant.name)}</h1>
          <p className="page-lead">{pick(restaurant.tagline)}</p>
        </div>
      </header>

      <section className="section">
        <div className="container about">
          <Reveal className="about__copy">
            <h2 className="section-title">{t('about.heading')}</h2>
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
            <div className="about__actions">
              <Link to="/menu" className="btn btn--primary">
                {t('about.seeMenu')}
              </Link>
              <a href={whatsappLink()} className="btn btn--outline" target="_blank" rel="noopener noreferrer">
                {t('about.message')}
              </a>
            </div>
          </Reveal>
          <Reveal className="about__mark" delay={80}>
            <img src={logoMark} alt={t('about.logoAlt')} width="288" height="148" loading="lazy" />
          </Reveal>
        </div>
      </section>

      <section className="section section--paper2" aria-labelledby="info-title">
        <div className="container">
          <h2 id="info-title" className="section-title">
            {t('about.info')}
          </h2>
          <dl className="info-grid">
            <Reveal className="info-grid__item">
              <dt>{t('about.hours')}</dt>
              <dd>
                {pick(restaurant.hoursLabel)}
                <OpenStatus className="info-grid__status" />
              </dd>
            </Reveal>
            <Reveal className="info-grid__item" delay={60}>
              <dt>{t('about.orders')}</dt>
              <dd>
                {[pickup && t('about.pickup'), delivery && t('about.delivery')].filter(Boolean).join(' · ')}
                <br />
                <a href={phoneLink} dir="ltr">
                  {restaurant.phone.display}
                </a>
              </dd>
            </Reveal>
            <Reveal className="info-grid__item" delay={120}>
              <dt>{t('about.location')}</dt>
              <dd>
                {pick(restaurant.address)}
                <br />
                <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">
                  {t('home.openMap')}
                </a>
              </dd>
            </Reveal>
            <Reveal className="info-grid__item" delay={180}>
              <dt>{t('about.follow')}</dt>
              <dd>
                <SocialLinks withLabels />
              </dd>
            </Reveal>
          </dl>
        </div>
      </section>
    </>
  )
}
