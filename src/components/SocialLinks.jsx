import { restaurant, whatsappLink } from '../config/restaurant'
import { useI18n } from '../i18n/I18nProvider'
import Icon from './Icon'

/** Only platforms with a real link in the config are rendered. */
export default function SocialLinks({ className = '', size = 20, includeWhatsApp = true }) {
  const { t } = useI18n()
  const links = [
    restaurant.social.instagram && { key: 'instagram', href: restaurant.social.instagram },
    restaurant.social.facebook && { key: 'facebook', href: restaurant.social.facebook },
    restaurant.social.tiktok && { key: 'tiktok', href: restaurant.social.tiktok },
    includeWhatsApp && restaurant.phone && { key: 'whatsapp', href: whatsappLink() },
  ].filter(Boolean)

  return (
    <ul className={`social ${className}`}>
      {links.map(({ key, href }) => (
        <li key={key}>
          <a href={href} target="_blank" rel="noopener noreferrer" className="social__link">
            <Icon name={key} size={size} />
            <span className="visually-hidden">
              {t(`common.${key}`)} {t('common.opensNewTab')}
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
