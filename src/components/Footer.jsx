import { Link } from 'react-router-dom';
import { restaurant } from '../config/restaurant';
import { useLanguage } from '../i18n/LanguageContext';
import { localized } from '../lib/format';
import Logo from './Logo';
import SocialLinks from './SocialLinks';
import OpeningHours from './OpeningHours';
import Icon from './Icon';

export default function Footer() {
  const { t, lang } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Logo className="site-footer__logo" />
          <p className="site-footer__tagline">
            <bdi>“{restaurant.tagline}”</bdi>
          </p>
          <p className="site-footer__blurb">{t.footer.blurb}</p>
        </div>

        <nav className="site-footer__col" aria-label={t.footer.explore}>
          <h2 className="site-footer__title">{t.footer.explore}</h2>
          <ul className="site-footer__links">
            <li><Link to="/">{t.nav.home}</Link></li>
            <li><Link to="/menu">{t.nav.menu}</Link></li>
            <li><Link to="/about">{t.nav.about}</Link></li>
            <li><Link to="/contact">{t.nav.contact}</Link></li>
          </ul>
        </nav>

        <div className="site-footer__col">
          <h2 className="site-footer__title">{t.footer.visit}</h2>
          <address>
            <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer" className="site-footer__line">
              <Icon name="pin" size={18} />
              <span>{localized(restaurant.address, lang)}</span>
            </a>
            <a href={`tel:${restaurant.phone.tel}`} className="site-footer__line">
              <Icon name="phone" size={18} />
              <span dir="ltr">{restaurant.phone.display}</span>
            </a>
          </address>
          <OpeningHours className="site-footer__hours" />
        </div>

        <div className="site-footer__col">
          <h2 className="site-footer__title">{t.footer.follow}</h2>
          <SocialLinks withHandles includeWhatsApp />
        </div>
      </div>

      <div className="container site-footer__bottom">
        <p>
          © {year} {restaurant.name}. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
