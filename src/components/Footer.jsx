import { Link } from 'react-router-dom'
import { restaurant } from '../config/restaurant.js'
import { emailLink, phoneLink, whatsappLink } from '../lib/format.js'
import { navLinks } from './Header.jsx'
import { Logo } from './Logo.jsx'
import { SocialLinks } from './SocialLinks.jsx'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <Logo size={48} tone="light" />
          <p className="footer__lede">
            {restaurant.bio}. Burgers, subs, chicken and salads in {restaurant.address.locality}. Dine in, pick up or get it delivered.
          </p>
          <SocialLinks className="footer__social" />
        </div>

        <nav className="footer__col" aria-label="Footer">
          <h2 className="footer__title">Visit</h2>
          <ul>
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="footer__title">Contact</h2>
          <ul>
            <li>
              <a href={phoneLink}>{restaurant.phone.display}</a>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={emailLink}>{restaurant.email}</a>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h2 className="footer__title">Hours & location</h2>
          <ul>
            <li>{restaurant.hours.label}</li>
            <li>
              <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">
                {restaurant.address.display}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer__base container">
        <span>
          © {year} {restaurant.name}. All rights reserved.
        </span>
        <span>{restaurant.tagline}.</span>
      </div>
    </footer>
  )
}
