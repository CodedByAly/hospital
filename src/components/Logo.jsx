import { Link } from 'react-router-dom'

export default function Logo({ size = 44, link = true, className = '' }) {
  const img = (
    <img
      src="/images/logo.webp"
      alt="Moods Burger"
      width={size}
      height={size}
      className={`logo ${className}`}
      decoding="async"
    />
  )
  return link ? (
    <Link to="/" className="logo-link" aria-label="Moods Burger">
      {img}
    </Link>
  ) : (
    img
  )
}
