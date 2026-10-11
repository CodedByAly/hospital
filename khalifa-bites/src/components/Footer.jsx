import { Link } from 'react-router-dom';
import restaurant from '../config/restaurant';
import { telLink, whatsappLink } from '../lib/links';
import SocialLinks from './SocialLinks';
import Hours from './Hours';
import Logo from './Logo';
import Icon from './Icon';
import { NAV } from './Header';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Logo variant="white" label={restaurant.name} className="site-footer__logo" />
          <p>Burgers off the charcoal grill, crispy chicken, subs and shawarma in Saida. Pickup or delivery.</p>
          <SocialLinks />
        </div>

        <nav className="site-footer__col" aria-label="Footer">
          <h2 className="site-footer__title">Explore</h2>
          <ul>
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to}>{n.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/contact#feedback">Feedback</Link>
            </li>
          </ul>
        </nav>

        <div className="site-footer__col">
          <h2 className="site-footer__title">Visit & order</h2>
          <address>
            <ul>
              <li>
                <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">
                  <Icon name="pin" size={18} /> {restaurant.address.full}
                </a>
              </li>
              <li>
                <a href={telLink}>
                  <Icon name="phone" size={18} /> {restaurant.phone.display}
                </a>
              </li>
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  <Icon name="whatsapp" size={18} /> WhatsApp order
                </a>
              </li>
            </ul>
          </address>
        </div>

        <div className="site-footer__col">
          <h2 className="site-footer__title">Hours</h2>
          <Hours />
        </div>
      </div>
      <div className="container site-footer__base">
        <p>© {new Date().getFullYear()} Khalifa Bites. All rights reserved.</p>
        <p className="site-footer__tag">{restaurant.tagline}</p>
      </div>
    </footer>
  );
}
