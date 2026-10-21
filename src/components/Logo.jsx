import { restaurant } from '../config/restaurant.js'

export function LogoMark({ size = 40, className = '' }) {
  return <img className={className} src="/logo-mark.svg" width={size} height={size} alt="" decoding="async" />
}

export function Logo({ size = 40, tone = 'default' }) {
  return (
    <span className={`logo logo--${tone}`}>
      <LogoMark size={size} />
      <span className="logo__word">{restaurant.name.toLowerCase()}</span>
    </span>
  )
}
