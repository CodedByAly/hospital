import { restaurant, phoneLink, whatsappLink } from '../config/restaurant'
import { t } from '../content/text'
import HoursList from '../components/HoursList'
import OpenStatus from '../components/OpenStatus'
import SocialLinks from '../components/SocialLinks'
import FeedbackForm from '../components/FeedbackForm'
import Reveal from '../components/Reveal'
import Icon from '../components/Icon'
import './InfoPages.css'

export default function Contact() {
  const address = restaurant.address

  const methods = [
    { icon: 'whatsapp', label: t('contact.whatsapp'), value: restaurant.phoneDisplay, href: whatsappLink(), external: true, ltr: true },
    { icon: 'phone', label: t('contact.phone'), value: restaurant.phoneDisplay, href: phoneLink, ltr: true },
    { icon: 'mail', label: t('contact.email'), value: restaurant.email, href: `mailto:${restaurant.email}`, ltr: true },
    { icon: 'pin', label: t('contact.address'), value: `${address.area}, ${address.street}`, sub: address.landmark, href: restaurant.mapsUrl, external: true },
  ]

  return (
    <div className="info-page">
      <header className="info-hero">
        <div className="container">
          <p className="kicker">Moods Burger</p>
          <h1>{t('contact.title')}</h1>
          <p className="info-hero__lead">{t('contact.lead')}</p>
          <div className="info-hero__actions">
            <a href={whatsappLink()} className="btn btn--primary btn--lg" target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={20} /> {t('contact.chat')}
            </a>
            <a href={phoneLink} className="btn btn--ghost-light btn--lg">
              <Icon name="phone" size={18} /> {t('contact.callUs')}
            </a>
          </div>
        </div>
      </header>

      <section className="container contact-grid">
        <div>
          <ul className="contact-methods">
            {methods.map((m, i) => (
              <Reveal as="li" key={m.icon} delay={i * 0.05}>
                <a href={m.href} {...(m.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  <span className="contact-methods__icon">
                    <Icon name={m.icon} size={20} />
                  </span>
                  <span className="contact-methods__text">
                    <span className="contact-methods__label">{m.label}</span>
                    <span className={m.ltr ? 'num contact-methods__value' : 'contact-methods__value'}>{m.value}</span>
                    {m.sub && <span className="contact-methods__sub">{m.sub}</span>}
                  </span>
                  <Icon name="chevron" size={18} className="icon--flip contact-methods__chev" />
                </a>
              </Reveal>
            ))}
          </ul>

          <div className="contact-side">
            <div>
              <h2 className="info-title">{t('contact.hours')}</h2>
              <OpenStatus />
              <HoursList />
            </div>
            <div>
              <h2 className="info-title">{t('contact.follow')}</h2>
              <SocialLinks className="contact-social" size={22} includeWhatsApp={false} />
              <p className="contact-handle">
                <a href={restaurant.social.instagram} target="_blank" rel="noopener noreferrer" className="num">
                  @moods.burger
                </a>
              </p>
            </div>
          </div>
        </div>

        <Reveal className="feedback-card" delay={0.1}>
          <FeedbackForm />
        </Reveal>
      </section>
    </div>
  )
}
