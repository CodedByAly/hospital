import { restaurant, formatPhone } from '../data/restaurant.js'
import { hoursLabel } from '../lib/hours.js'
import { goToSection } from '../lib/router.js'
import { whatsappUrl } from '../lib/whatsapp.js'
import { NAV } from './Header.jsx'
import SocialLinks from './SocialLinks.jsx'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <img src="/images/logo-240.webp" alt="" width="72" height="72" loading="lazy" />
          <p className="footer__name">{restaurant.name}</p>
          <p className="footer__desc">{restaurant.description}</p>
          <SocialLinks className="footer__social" />
        </div>

        <nav className="footer__col" aria-label="Footer">
          <h2 className="footer__heading">Explore</h2>
          <ul>
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={n.id === 'top' ? '/' : `/#${n.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    goToSection(n.id)
                  }}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="footer__heading">Branches</h2>
          <ul>
            {restaurant.branches.map((b) => (
              <li key={b.id}>
                <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer">{b.name}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h2 className="footer__heading">Hours & orders</h2>
          <ul>
            <li>{restaurant.hours[0].days}</li>
            <li>{hoursLabel}</li>
            <li>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">WhatsApp {formatPhone()}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer__base">
        <p>© {new Date().getFullYear()} {restaurant.legalName}. All rights reserved.</p>
        <p>Halal</p>
      </div>
    </footer>
  )
}
