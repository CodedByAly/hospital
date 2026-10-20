import Icon from './Icon'
import { restaurant, whatsappLink } from '../config/restaurant'

const labels = { instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok' }

// Renders only the accounts present in the config, plus WhatsApp.
export default function SocialLinks({ className = '', withWhatsApp = true, size = 18 }) {
  const accounts = Object.entries(restaurant.social).filter(([, v]) => v?.url)
  return (
    <ul className={`social ${className}`}>
      {accounts.map(([key, { url, handle }]) => (
        <li key={key}>
          <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`${labels[key]}: @${handle}`}>
            <Icon name={key} size={size} />
          </a>
        </li>
      ))}
      {withWhatsApp && (
        <li>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp: ${restaurant.phone.display}`}>
            <Icon name="whatsapp" size={size} />
          </a>
        </li>
      )}
    </ul>
  )
}
