import { restaurant } from '../config/restaurant';
import { useLanguage } from '../i18n/LanguageContext';
import { localized } from '../lib/format';
import { hasWhatsApp, whatsappUrl } from '../lib/whatsapp';
import Icon from './Icon';

/** Phone / WhatsApp / address rows used on several pages. */
export default function ContactList({ className = '' }) {
  const { t, lang } = useLanguage();
  return (
    <ul className={`contact-list ${className}`}>
      <li>
        <a href={`tel:${restaurant.phone.tel}`}>
          <span className="contact-list__icon"><Icon name="phone" /></span>
          <span>
            <span className="contact-list__label">{t.contact.phone}</span>
            <span className="contact-list__value" dir="ltr">{restaurant.phone.display}</span>
          </span>
        </a>
      </li>
      {hasWhatsApp ? (
        <li>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            <span className="contact-list__icon"><Icon name="whatsapp" /></span>
            <span>
              <span className="contact-list__label">{t.contact.whatsapp}</span>
              <span className="contact-list__value">{t.contact.whatsappCta}</span>
            </span>
          </a>
        </li>
      ) : null}
      <li>
        <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">
          <span className="contact-list__icon"><Icon name="pin" /></span>
          <span>
            <span className="contact-list__label">{t.contact.address}</span>
            <span className="contact-list__value">{localized(restaurant.address, lang)}</span>
          </span>
        </a>
      </li>
    </ul>
  );
}
