import { restaurant, addressLine, telLink } from '../data/restaurant';
import { navLinks } from './Header';
import Logo from './Logo';
import Icon from './Icon';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo className="footer__logo" title={restaurant.fullName} />
            <p>
              {restaurant.tagline} Breakfast, manakish, a full coffee bar and argili on Bikkerman Street, Saida.
            </p>
            <div className="footer__socials">
              {restaurant.socials.map((s) => (
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`Talia on ${s.label}`} className="footer__social">
                  <Icon name={s.id} size={20} />
                </a>
              ))}
            </div>
          </div>

          <nav className="footer__col" aria-label="Footer">
            <h2>Explore</h2>
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
            <h2>Contact</h2>
            <ul>
              <li>
                <a href={telLink}>{restaurant.phoneDisplay}</a>
              </li>
              <li>
                <a href={`https://wa.me/${restaurant.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
              {restaurant.socials
                .filter((s) => s.id === 'instagram')
                .map((s) => (
                  <li key={s.id}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.handle}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          <div className="footer__col">
            <h2>Hours &amp; location</h2>
            <ul>
              <li>{restaurant.hours.summary}</li>
              <li>
                <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">
                  {addressLine}
                </a>
              </li>
              <li>{restaurant.address.landmark}</li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            &copy; {year} {restaurant.fullName}. All rights reserved.
          </p>
          <p>Prices in US dollars.</p>
        </div>
      </div>
    </footer>
  );
}
