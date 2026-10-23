import badge from '../assets/images/logo-badge.webp'
import { restaurant } from '../config/restaurant'
import { useLang } from '../i18n/LanguageContext'

export default function Logo({ size = 48, className = '' }) {
  const { pick } = useLang()
  return <img src={badge} width={size} height={size} alt={pick(restaurant.name)} className={`logo ${className}`} decoding="async" />
}
