import { restaurant, whatsappLink } from '../config/restaurant'
import { useLanguage } from '../context/LanguageContext'
import { useMeta } from '../hooks/useMeta'
import FeedbackForm from '../components/FeedbackForm'
import Hours from '../components/Hours'
import Icon from '../components/Icon'
import SocialLinks from '../components/SocialLinks'
import './Contact.css'

export default function Contact() {
  const { t, pick } = useLanguage()
  useMeta({ title: t('meta.contactTitle'), description: `${pick(restaurant.address)} · ${restaurant.phoneDisplay}`, path: '/contact' })

  return (
    <div className="container contact">
      <header className="contact__head">
        <p className="eyebrow">{t('contact.eyebrow')}</p>
        <h1 className="page-title">{t('contact.title')}</h1>
        <p className="contact__lead">{t('contact.lead')}</p>
      </header>

      <div className="contact__grid">
        <div className="contact__cards">
          <a className="contact-card contact-card--wa" href={whatsappLink(t('whatsapp.hello'))} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" size={28} />
            <span className="contact-card__label">{t('common.whatsapp')}</span>
            <span className="contact-card__value" dir="ltr">{restaurant.phoneDisplay}</span>
            <Icon name="arrow" size={18} className="contact-card__arrow flip-rtl" />
          </a>
          <a className="contact-card" href={`tel:${restaurant.phone}`}>
            <Icon name="phone" size={26} />
            <span className="contact-card__label">{t('common.call')}</span>
            <span className="contact-card__value" dir="ltr">{restaurant.phoneDisplay}</span>
            <Icon name="arrow" size={18} className="contact-card__arrow flip-rtl" />
          </a>
          <a className="contact-card" href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">
            <Icon name="pin" size={26} />
            <span className="contact-card__label">{t('info.address')}</span>
            <span className="contact-card__value">{pick(restaurant.address)}</span>
            <Icon name="arrow" size={18} className="contact-card__arrow flip-rtl" />
          </a>
          <div className="contact-card contact-card--static">
            <Icon name="clock" size={26} />
            <span className="contact-card__label">{t('info.hours')}</span>
            <Hours className="contact-card__value" />
          </div>
          <div className="contact__social">
            <p className="field-label">{t('info.follow')}</p>
            <SocialLinks showHandle />
          </div>
        </div>

        <section className="contact__feedback" aria-labelledby="feedback-title">
          <h2 id="feedback-title" className="section__title">{t('contact.feedback')}</h2>
          <p className="muted">{t('contact.feedbackLead')}</p>
          <FeedbackForm />
        </section>
      </div>
    </div>
  )
}
