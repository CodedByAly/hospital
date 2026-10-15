import { restaurant } from '../config/restaurant';
import { useI18n } from '../i18n/LanguageContext';
import { whatsappLink } from '../lib/whatsapp';
import Icon from './Icon';
import './SocialLinks.css';

/** Only platforms with a real URL in the config are rendered. */
export function socialItems() {
  const { social } = restaurant;
  return [
    social.instagram.url && { id: 'instagram', url: social.instagram.url, handle: social.instagram.handle },
    social.facebook.url && { id: 'facebook', url: social.facebook.url, handle: social.facebook.handle },
    social.tiktok.url && { id: 'tiktok', url: social.tiktok.url, handle: social.tiktok.handle },
    restaurant.whatsapp && { id: 'whatsapp', url: whatsappLink(), handle: restaurant.phone.display },
  ].filter(Boolean);
}

export default function SocialLinks({ variant = 'icons', className = '', include }) {
  const { t } = useI18n();
  const items = socialItems().filter((item) => !include || include.includes(item.id));

  return (
    <ul className={`social social--${variant} ${className}`}>
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social__link"
            aria-label={variant === 'icons' ? `${t(`common.${item.id}`)} ${item.handle}` : undefined}
          >
            <Icon name={item.id} size={variant === 'icons' ? 19 : 20} />
            {variant === 'list' && (
              <span className="social__text">
                <span className="social__name">{t(`common.${item.id}`)}</span>
                <span className="social__handle ltr">{item.handle}</span>
              </span>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}
