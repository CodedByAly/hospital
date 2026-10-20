import { Link } from 'react-router-dom'
import Logo from './Logo'
import Icon from './Icon'
import SocialLinks from './SocialLinks'
import { navLinks } from './Header'
import { restaurant, telLink, fullAddress } from '../config/restaurant'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer__wave" aria-hidden="true" />
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo className="footer__logo" light />
          <p>Shrimp, fish and crispy chicken in Hleliyeh, Saida. Order for pickup or delivery.</p>
          <SocialLinks className="footer__social" size={19} />
        </div>

        <nav className="footer__col" aria-label="Footer">
          <h2 className="footer__title">Explore</h2>
          <ul>
            {navLinks.map((l) => (
              <li key={l.id}>
                <Link to={l.href}>{l.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/checkout">Checkout</Link>
            </li>
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="footer__title">Contact</h2>
          <ul className="footer__contact">
            <li>
              <Icon name="phone" size={16} />
              <a href={telLink}>{restaurant.phone.display}</a>
            </li>
            <li>
              <Icon name="mail" size={16} />
              <a href={`mailto:${restaurant.email}`}>{restaurant.email}</a>
            </li>
            <li>
              <Icon name="pin" size={16} />
              <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">
                {fullAddress}
              </a>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h2 className="footer__title">Hours</h2>
          {restaurant.hours ? (
            <ul className="footer__hours">
              {restaurant.hours.map((h) => (
                <li key={h.days}>
                  <span>{h.days}</span>
                  <span>{h.hours}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="footer__note">Call or message us on WhatsApp for today&rsquo;s hours.</p>
          )}
        </div>
      </div>

      <div className="container footer__bottom">
        <p>© {year} {restaurant.legalName}. All rights reserved.</p>
        <p>{restaurant.tagline}.</p>
      </div>
    </footer>
  )
}
