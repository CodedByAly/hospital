import { useI18n } from '../i18n/LanguageContext';
import { restaurant } from '../config/restaurant';
import { whatsappLink } from '../lib/whatsapp';
import usePageMeta from '../lib/usePageMeta';
import FeedbackForm from '../components/FeedbackForm';
import HoursList from '../components/HoursList';
import Icon from '../components/Icon';
import OpenStatus from '../components/OpenStatus';
import Reveal from '../components/Reveal';
import SocialLinks from '../components/SocialLinks';
import './Contact.css';

export default function Contact() {
  const { t, pick } = useI18n();
  usePageMeta(t('meta.contactTitle'), t('meta.contactDescription'));
  const street = pick(restaurant.location.street);

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">{t('contact.eyebrow')}</span>
          <h1>{t('contact.title')}</h1>
          <p className="lead">{t('contact.lead')}</p>
        </div>
      </header>

      <section className="container contact-cards" aria-label={t('contact.eyebrow')}>
        <Reveal as="a" className="contact-card contact-card--primary" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
          <Icon name="whatsapp" size={28} />
          <span className="contact-card__label">{t('contact.whatsapp')}</span>
          <span className="contact-card__value ltr">{restaurant.phone.display}</span>
          <span className="contact-card__cta">{t('contact.whatsappText')} <Icon name="arrow" size={18} className="flip-rtl" /></span>
        </Reveal>
        <Reveal as="a" className="contact-card" href={`tel:${restaurant.phone.tel}`} delay={60}>
          <Icon name="phone" size={26} />
          <span className="contact-card__label">{t('contact.phone')}</span>
          <span className="contact-card__value ltr">{restaurant.phone.display}</span>
          <span className="contact-card__cta">{t('common.call')} <Icon name="arrow" size={18} className="flip-rtl" /></span>
        </Reveal>
        <Reveal as="a" className="contact-card" href={restaurant.location.mapsUrl} target="_blank" rel="noopener noreferrer" delay={120}>
          <Icon name="pin" size={26} />
          <span className="contact-card__label">{t('contact.address')}</span>
          <span className="contact-card__value">{street ? `${street}, ` : ''}{pick(restaurant.location.area)}</span>
          <span className="contact-card__cta">{t('contact.mapCta')} <Icon name="arrow" size={18} className="flip-rtl" /></span>
        </Reveal>
      </section>

      <section className="section contact-main">
        <div className="container contact-main__grid">
          <div className="contact-main__info">
            <div className="contact-block">
              <h2>{t('contact.hours')}</h2>
              <OpenStatus />
              <HoursList />
            </div>
            <div className="contact-block">
              <h2>{t('contact.social')}</h2>
              <SocialLinks variant="list" />
            </div>
          </div>

          <div className="contact-main__form" id="feedback">
            <h2 className="section-title">{t('contact.feedbackTitle')}</h2>
            <p className="lead">{t('contact.feedbackLead')}</p>
            <FeedbackForm />
          </div>
        </div>
      </section>
    </>
  );
}
