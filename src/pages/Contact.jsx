import { restaurant } from '../config/restaurant';
import { useLanguage } from '../i18n/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { hasWhatsApp, whatsappUrl } from '../lib/whatsapp';
import ContactList from '../components/ContactList';
import OpeningHours from '../components/OpeningHours';
import SocialLinks from '../components/SocialLinks';
import FeedbackForm from '../components/FeedbackForm';
import Icon from '../components/Icon';

export default function Contact() {
  const { t } = useLanguage();
  usePageMeta(t.contact.title);

  return (
    <>
      <header className="page-head page-head--dark">
        <div className="container">
          <h1 className="page-title">{t.contact.title}</h1>
          <p className="page-lead">{t.contact.lead}</p>
          <div className="page-head__actions">
            {hasWhatsApp ? (
              <a href={whatsappUrl()} className="btn btn--whatsapp btn--lg" target="_blank" rel="noopener noreferrer">
                <Icon name="whatsapp" size={20} />
                {t.contact.whatsappCta}
              </a>
            ) : null}
            <a href={`tel:${restaurant.phone.tel}`} className="btn btn--ghost-light btn--lg">
              <Icon name="phone" size={18} />
              <span dir="ltr">{restaurant.phone.display}</span>
            </a>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container contact">
          <div className="contact__info">
            <ContactList className="contact-list--large" />
            {restaurant.openingHours.length ? (
              <div className="contact__block">
                <h2 className="block-heading">{t.contact.hours}</h2>
                <OpeningHours />
              </div>
            ) : null}
            <div className="contact__block">
              <h2 className="block-heading">{t.contact.social}</h2>
              <SocialLinks withHandles />
            </div>
            <a href={restaurant.mapsUrl} className="btn btn--outline" target="_blank" rel="noopener noreferrer">
              <Icon name="pin" size={18} />
              {t.contact.map}
            </a>
          </div>

          <div className="contact__form" id="feedback">
            <h2 className="section-title">{t.feedback.title}</h2>
            <p className="section-text">{t.feedback.lead}</p>
            <FeedbackForm />
          </div>
        </div>
      </section>
    </>
  );
}
