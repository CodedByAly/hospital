import { restaurant } from '../config/restaurant';
import { useLanguage } from '../i18n/LanguageContext';
import { hasWhatsApp, whatsappUrl } from '../lib/whatsapp';
import Icon from './Icon';

/**
 * Social profile links. `withHandles` shows "@handle" next to each icon;
 * `includeWhatsApp` appends the WhatsApp chat link.
 */
export default function SocialLinks({ withHandles = false, includeWhatsApp = false, className = '' }) {
  const { t } = useLanguage();
  const links = [...restaurant.socials];
  if (includeWhatsApp && hasWhatsApp) {
    links.push({ id: 'whatsapp', label: 'WhatsApp', handle: restaurant.phone.display, url: whatsappUrl() });
  }
  if (!links.length) return null;

  return (
    <ul className={`social-links ${withHandles ? 'social-links--handles' : ''} ${className}`} aria-label={t.nav.social}>
      {links.map((s) => (
        <li key={s.id}>
          <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={withHandles ? undefined : s.label}>
            <Icon name={s.id} size={withHandles ? 20 : 19} />
            {withHandles ? (
              <span>
                <span className="social-links__label">{s.label}</span>
                <span className="social-links__handle" dir="ltr">{s.handle}</span>
              </span>
            ) : null}
          </a>
        </li>
      ))}
    </ul>
  );
}
