import Logo from './Logo.jsx';
import { NAV } from './Header.jsx';
import { InstagramIcon, PhoneIcon, PinIcon, WhatsAppIcon } from './Icons.jsx';
import { restaurant, whatsappLink, fullAddress } from '../data/restaurant.js';

export default function Footer() {
  const { phones, hours, social, mapsUrl } = restaurant;
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="#top" aria-label="Back to top">
              <Logo />
            </a>
            <p>
              {restaurant.tagline}. Specialty coffee, breakfast, games and chill vibes.
            </p>
          </div>

          <nav className="footer__col" aria-label="Footer">
            <h2>Explore</h2>
            <ul>
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__col">
            <h2>Contact</h2>
            <ul>
              {phones.map((p) => (
                <li key={p.tel}>
                  <a href={`tel:${p.tel}`}>
                    <PhoneIcon width={16} height={16} /> {p.display}
                  </a>
                </li>
              ))}
              <li>
                <a href={whatsappLink()} target="_blank" rel="noreferrer">
                  <WhatsAppIcon width={16} height={16} /> WhatsApp
                </a>
              </li>
              <li>
                <a href={social.instagram.url} target="_blank" rel="noreferrer">
                  <InstagramIcon width={16} height={16} /> {social.instagram.handle}
                </a>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <h2>Location</h2>
            <a className="footer__address" href={mapsUrl} target="_blank" rel="noreferrer">
              <PinIcon width={16} height={16} />
              <span>{fullAddress()}</span>
            </a>
            {hours.length > 0 && (
              <ul className="footer__hours">
                {hours.map((h) => (
                  <li key={h.days}>
                    {h.days}: {h.time}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {year} {restaurant.fullName}. All rights reserved.</p>
          <a href="#top">Back to top</a>
        </div>
      </div>
    </footer>
  );
}
