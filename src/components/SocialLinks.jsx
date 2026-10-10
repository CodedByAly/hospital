import { restaurant } from '../config/restaurant'
import Icon from './Icon'

/** Renders only the accounts listed in config/restaurant.js. */
export default function SocialLinks({ className = '', showHandle = false, size = 20 }) {
  return (
    <ul className={`social-links ${className}`}>
      {restaurant.socials.map((s) => (
        <li key={s.id}>
          <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`${restaurant.name} on ${s.label}`}>
            <Icon name={s.id} size={size} />
            {showHandle && <span dir="ltr">{s.handle}</span>}
          </a>
        </li>
      ))}
    </ul>
  )
}
