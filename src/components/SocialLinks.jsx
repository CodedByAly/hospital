import { useLanguage } from '../i18n/LanguageContext';
import { socialProfiles } from '../lib/links';
import Icon from './Icon';

/** Icon links to the restaurant's real profiles only (see config/restaurant.js). */
export default function SocialLinks({ className = '', withWhatsApp = true, labels = false }) {
  const { t } = useLanguage();
  const profiles = socialProfiles().filter((p) => withWhatsApp || p.id !== 'whatsapp');
  return (
    <ul className={`social ${labels ? 'social--labels' : ''} ${className}`}>
      {profiles.map((p) => (
        <li key={p.id}>
          <a href={p.href} target="_blank" rel="noopener noreferrer" aria-label={labels ? undefined : t.common[p.id]}>
            <Icon name={p.id} size={20} />
            {labels && (
              <span>
                <span className="social__name">{t.common[p.id]}</span>
                {p.handle && <span className="social__handle" dir="ltr">{p.handle}</span>}
              </span>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}
