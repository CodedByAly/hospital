import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import restaurant from '../config/restaurant';
import { mailLink, telLink, whatsappLink } from '../lib/links';
import { tr } from '../lib/format';
import SocialLinks from './SocialLinks';
import Hours from './Hours';
import Logo from './Logo';
import Icon from './Icon';

export default function Footer() {
  const { t, lang } = useLanguage();
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Logo className="site-footer__logo" label={restaurant.name} />
          <p>{t.footer.blurb}</p>
          <SocialLinks />
        </div>

        <nav className="site-footer__col" aria-label={t.footer.explore}>
          <h2 className="site-footer__title">{t.footer.explore}</h2>
          <ul>
            <li><Link to="/">{t.nav.home}</Link></li>
            <li><Link to="/menu">{t.nav.menu}</Link></li>
            <li><Link to="/about">{t.nav.about}</Link></li>
            <li><Link to="/contact">{t.nav.contact}</Link></li>
          </ul>
        </nav>

        <div className="site-footer__col">
          <h2 className="site-footer__title">{t.footer.visit}</h2>
          <address>
            <ul>
              <li>
                <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">
                  <Icon name="pin" size={18} /> {tr(restaurant.address, lang)}
                </a>
              </li>
              <li>
                <a href={telLink} dir="ltr">
                  <Icon name="phone" size={18} /> {restaurant.phone.display}
                </a>
              </li>
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  <Icon name="whatsapp" size={18} /> {t.common.whatsapp}
                </a>
              </li>
              <li>
                <a href={mailLink}>
                  <Icon name="mail" size={18} /> {restaurant.email}
                </a>
              </li>
            </ul>
          </address>
        </div>

        <div className="site-footer__col">
          <h2 className="site-footer__title">{t.footer.hours}</h2>
          <Hours />
        </div>
      </div>
      <div className="container site-footer__base">
        <p>{t.footer.rights(year)}</p>
        <a href={restaurant.social.linktree} target="_blank" rel="noopener noreferrer" dir="ltr">
          linktr.ee/qambriseafood
        </a>
      </div>
    </footer>
  );
}
