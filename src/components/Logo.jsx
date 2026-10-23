import badge from '../assets/images/logo-badge.webp'
import { restaurant } from '../config/restaurant'

export default function Logo({ size = 48, className = '' }) {
  return <img src={badge} width={size} height={size} alt={restaurant.name} className={`logo ${className}`} decoding="async" />
}
