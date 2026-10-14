import { Link } from 'react-router-dom'
import { restaurant, whatsappLink, phoneLink, mapsLink } from '../config/restaurant'
import { copy as t } from '../content/copy'
import { clock } from '../utils/format'
import { SocialLinks } from './SocialLinks'
import { Icon } from './Icon'
import './Footer.css'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <img src="/images/logo-on-dark.webp" alt={restaurant.name} width="220" height="114" loading="lazy" />
          <p>{t.footer.blurb}</p>
          <SocialLinks className="site-footer__socials" withWhatsapp />
        </div>

        <nav aria-label={t.footer.explore}>
          <h2>{t.footer.explore}</h2>
          <ul>
            <li><Link to="/">{t.nav.home}</Link></li>
            <li><Link to="/menu">{t.nav.menu}</Link></li>
            <li><Link to="/about">{t.nav.about}</Link></li>
            <li><Link to="/contact">{t.nav.contact}</Link></li>
            <li><Link to="/checkout">{t.cart.checkout}</Link></li>
          </ul>
        </nav>

        <div>
          <h2>{t.footer.reach}</h2>
          <ul className="site-footer__contact">
            <li><Icon name="phone" /><a href={phoneLink}>{restaurant.phoneDisplay}</a></li>
            <li><Icon name="whatsapp" /><a href={whatsappLink()} target="_blank" rel="noreferrer">{t.social.whatsapp}</a></li>
            <li><Icon name="mail" /><a href={`mailto:${restaurant.email}`}>{restaurant.email}</a></li>
            <li><Icon name="pin" /><a href={mapsLink} target="_blank" rel="noreferrer">{restaurant.address}</a></li>
          </ul>
        </div>

        <div>
          <h2>{t.contact.hours}</h2>
          <p className="site-footer__hours">
            {t.contact.everyday}
            <br />
            <strong>{clock(restaurant.hours.open)} – {clock(restaurant.hours.close)}</strong>
          </p>
        </div>
      </div>

      <div className="container site-footer__base">
        <p>© {year} {restaurant.name}. {t.footer.rights}</p>
        <button type="button" onClick={() => window.scrollTo({ top: 0 })} className="site-footer__top">
          {t.footer.top} <Icon name="arrow" style={{ transform: 'rotate(-90deg)' }} />
        </button>
      </div>
    </footer>
  )
}
