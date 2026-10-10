import { restaurant, formatPhone } from '../data/restaurant.js'
import { whatsappUrl } from '../lib/whatsapp.js'
import Icon from './Icon.jsx'

/** Only renders networks that exist in restaurant.social, plus WhatsApp. */
export default function SocialLinks({ className = '', showWhatsapp = true }) {
  const entries = Object.entries(restaurant.social)
  return (
    <ul className={`social ${className}`}>
      {entries.map(([network, { handle, url }]) => (
        <li key={network}>
          <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`${network} @${handle}`} className="social__link">
            <Icon name={network} size={19} />
          </a>
        </li>
      ))}
      {showWhatsapp && (
        <li>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${formatPhone()}`} className="social__link">
            <Icon name="whatsapp" size={19} />
          </a>
        </li>
      )}
    </ul>
  )
}
