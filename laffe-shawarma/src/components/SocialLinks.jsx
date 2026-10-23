import { restaurant, whatsappLink } from '../config/restaurant'
import { useLang } from '../i18n/LanguageContext'
import { InstagramIcon, WhatsAppIcon } from './Icons'

const ICONS = { instagram: InstagramIcon }
const LABELS = {
  instagram: { en: 'Instagram', ar: 'إنستغرام' },
  facebook: { en: 'Facebook', ar: 'فيسبوك' },
  tiktok: { en: 'TikTok', ar: 'تيك توك' },
  whatsapp: { en: 'WhatsApp', ar: 'واتساب' },
}

/** Renders only the platforms configured in restaurant.social, plus WhatsApp. */
export default function SocialLinks({ className = '', withLabels = false, size = 20, whatsapp = true }) {
  const { pick } = useLang()
  const links = Object.entries(restaurant.social).filter(([, v]) => v?.url)
  return (
    <ul className={`social ${withLabels ? 'social--labels' : ''} ${className}`}>
      {links.map(([key, { url, handle }]) => {
        const Icon = ICONS[key]
        return (
          <li key={key}>
            <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`${pick(LABELS[key]) ?? key} @${handle}`}>
              {Icon && <Icon size={size} />}
              {withLabels && <span dir="ltr">@{handle}</span>}
            </a>
          </li>
        )
      })}
      {whatsapp && (
        <li>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label={`${pick(LABELS.whatsapp)} ${restaurant.phone.display}`}>
            <WhatsAppIcon size={size} />
            {withLabels && <span dir="ltr">{restaurant.phone.display}</span>}
          </a>
        </li>
      )}
    </ul>
  )
}
