import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/LanguageContext';
import { restaurant } from '../config/restaurant';
import { whatsappLink } from '../lib/whatsapp';
import HoursList from './HoursList';
import Icon from './Icon';
import Logo from './Logo';
import SocialLinks from './SocialLinks';
import { NAV_LINKS } from './Header';
import './Footer.css';

export default function Footer() {
  const { t, pick } = useI18n();
  const street = pick(restaurant.location.street);

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Logo layout="stacked" tone="light" tagline={pick(restaurant.tagline)} />
          <p>{t('footer.about')}</p>
          <SocialLinks className="site-footer__social" include={['instagram', 'facebook', 'tiktok', 'whatsapp']} />
        </div>

        <nav className="site-footer__col" aria-label={t('footer.explore')}>
          <h2 className="site-footer__heading">{t('footer.explore')}</h2>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.to}><Link to={link.to}>{t(`nav.${link.key}`)}</Link></li>
            ))}
          </ul>
        </nav>

        <div className="site-footer__col">
          <h2 className="site-footer__heading">{t('footer.contact')}</h2>
          <ul>
            <li>
              <a href={`tel:${restaurant.phone.tel}`}><Icon name="phone" size={17} /> <span className="ltr">{restaurant.phone.display}</span></a>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={17} /> {t('common.whatsapp')}</a>
            </li>
            <li>
              <a href={restaurant.location.mapsUrl} target="_blank" rel="noopener noreferrer">
                <Icon name="pin" size={17} /> {street ? `${street}, ` : ''}{pick(restaurant.location.area)}
              </a>
            </li>
            {restaurant.social.instagram.url && (
              <li>
                <a href={restaurant.social.instagram.url} target="_blank" rel="noopener noreferrer"><Icon name="instagram" size={17} /> <span className="ltr">{restaurant.social.instagram.handle}</span></a>
              </li>
            )}
          </ul>
        </div>

        <div className="site-footer__col">
          <h2 className="site-footer__heading">{t('footer.hours')}</h2>
          <HoursList />
        </div>
      </div>

      <div className="container site-footer__legal">
        <p>© {new Date().getFullYear()} Life Kitchen. {t('footer.rights')}</p>
        <p className="site-footer__tagline">{pick(restaurant.tagline)}</p>
      </div>
    </footer>
  );
}
