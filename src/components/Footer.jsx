import { Lockup } from './Logo'
import { navLinks } from './Header'
import { site, telLink, whatsappLink } from '../data/site'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid wrap">
        <div className="footer__brand">
          <a href="#top" aria-label={`${site.name}, back to top`}>
            <Lockup className="footer__logo" />
          </a>
          <p className="footer__tagline">{site.tagline}</p>
          <p className="footer__blurb">
            Coffee house in {site.town}. {site.bio}.
          </p>
        </div>

        <nav className="footer__col" aria-label="Footer">
          <h2 className="footer__heading">Explore</h2>
          <ul>
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="footer__heading">Visit</h2>
          <ul>
            <li>
              {site.town}, {site.country}
            </li>
            <li>Open {site.hours.display}</li>
            <li>
              <a href={site.maps} target="_blank" rel="noopener noreferrer">
                Google Maps
              </a>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h2 className="footer__heading">Contact</h2>
          <ul>
            <li>
              <a href={telLink}>{site.phone.display}</a>
            </li>
            {site.whatsapp && (
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
            )}
            {site.social.map((s) => (
              <li key={s.id}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label} {s.handle}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer__base wrap">
        <p suppressHydrationWarning>
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <p>Prices in US dollars. Dine-in menu.</p>
      </div>
    </footer>
  )
}
