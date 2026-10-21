import { restaurant } from '../config/restaurant.js'
import { socialIcons } from './Icons.jsx'

export function SocialLinks({ className = '', showHandle = false, size = 20 }) {
  return (
    <ul className={`social ${className}`}>
      {restaurant.social.map((s) => {
        const Icon = socialIcons[s.id]
        return (
          <li key={s.id}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} ${s.handle}`}>
              {Icon && <Icon size={size} />}
              {showHandle && (
                <span className="social__text">
                  <span className="social__label">{s.label}</span>
                  <span className="social__handle">{s.handle}</span>
                </span>
              )}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
