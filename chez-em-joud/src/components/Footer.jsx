import Logo from './Logo'
import { navLinks } from './Header'
import { site, telLink, whatsappLink } from '../data/site'
import './Footer.css'

export default function Footer() {
  const where = [site.address, site.town, site.country].filter(Boolean).join(', ')
  return (
    <footer className="footer">
      <div className="footer__grid wrap">
        <div className="footer__brand">
          <a href="#top" aria-label={`${site.name}, back to top`}>
            <Logo className="footer__logo" mono />
          </a>
          <p className="footer__tagline">{site.tagline}</p>
          <p>
            {site.bio} {site.specialties.join(', ')}, for delivery or pickup.
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
            <li>
              <a href="#feedback">Feedback</a>
            </li>
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="footer__heading">Order &amp; contact</h2>
          <ul>
            {site.whatsapp && (
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  WhatsApp {site.phone.display}
                </a>
              </li>
            )}
            <li>
              <a href={telLink}>Call {site.phone.display}</a>
            </li>
            {site.social.map((s) => (
              <li key={s.id}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label} {s.handle}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h2 className="footer__heading">Find us</h2>
          <ul>
            <li>{site.maps ? <a href={site.maps} target="_blank" rel="noopener noreferrer">{where}</a> : where}</li>
            {site.hours && <li>{site.hours}</li>}
            <li>Delivery &amp; pickup</li>
            <li>Cash payment</li>
          </ul>
        </div>
      </div>
      <div className="footer__base wrap">
        <p suppressHydrationWarning>
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <p>Prices in US dollars.</p>
      </div>
    </footer>
  )
}
