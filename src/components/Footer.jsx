import { Link } from 'react-router-dom';
import { restaurant, socialLinks, telLink, whatsappLink } from '../data/restaurant';
import Hours from './Hours';
import { SocialIcon, WhatsAppIcon } from './Icons';
import { Logo } from './Logo';
import { NAV } from './Header';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer on-dark">
      <div className="checker" style={{ '--c1': 'var(--ink)', '--c2': 'var(--ink-3)', '--size': '14px' }} aria-hidden="true" />
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Logo />
          <p className="site-footer__blurb">
            {restaurant.tagline}. Smashed and flame-grilled burgers, loaded fries and subs on Kamil Shamoun Blvd, for pickup or delivery.
          </p>
          <div className="site-footer__social">
            {socialLinks.map((s) => (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label={`${s.label} ${s.handle}`}>
                <SocialIcon id={s.id} />
              </a>
            ))}
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="WhatsApp">
              <WhatsAppIcon />
            </a>
          </div>
        </div>

        <nav className="site-footer__col" aria-label="Footer">
          <h2 className="site-footer__h">Explore</h2>
          <ul>
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to}>{n.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/checkout">Checkout</Link>
            </li>
          </ul>
        </nav>

        <div className="site-footer__col">
          <h2 className="site-footer__h">Find us</h2>
          <address>
            {restaurant.address.lines.map((l) => (
              <span key={l}>{l}</span>
            ))}
            <span>{restaurant.city}, {restaurant.country}</span>
          </address>
          <a href={restaurant.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-link">
            Open in Google Maps
          </a>
        </div>

        <div className="site-footer__col">
          <h2 className="site-footer__h">Talk to us</h2>
          <ul>
            <li>
              <a href={telLink}>{restaurant.phone.display}</a>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
            {socialLinks.map((s) => (
              <li key={s.id}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.handle}
                </a>
              </li>
            ))}
          </ul>
          <h2 className="site-footer__h site-footer__h--spaced">Hours</h2>
          <Hours compact />
        </div>
      </div>
      <div className="container site-footer__legal">
        <p>© {year} {restaurant.name}. All rights reserved.</p>
        <p>
          In collaboration with{' '}
          <a href={restaurant.partner.url} target="_blank" rel="noopener noreferrer">
            {restaurant.partner.name}
          </a>
        </p>
      </div>
    </footer>
  );
}
