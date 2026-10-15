import { NavLink } from 'react-router-dom';
import { useI18n } from '../i18n/LanguageContext';
import { restaurant } from '../config/restaurant';
import { whatsappLink } from '../lib/whatsapp';
import Dialog from './Dialog';
import Icon from './Icon';
import Logo from './Logo';
import OpenStatus from './OpenStatus';
import SocialLinks from './SocialLinks';
import { NAV_LINKS, LanguageToggle } from './Header';
import './MobileNav.css';

export default function MobileNav({ open, onClose }) {
  const { t, pick } = useI18n();

  return (
    <Dialog open={open} onClose={onClose} variant="nav" labelledBy="mobile-nav-title" className="mobile-nav">
      <div className="mobile-nav__top">
        <span id="mobile-nav-title" className="sr-only">{t('nav.primary')}</span>
        <Logo />
        <button type="button" className="mobile-nav__close" onClick={onClose} aria-label={t('nav.closeMenu')}>
          <Icon name="close" size={24} />
        </button>
      </div>

      <nav className="mobile-nav__links" aria-label={t('nav.primary')}>
        <ul>
          {NAV_LINKS.map((link, index) => (
            <li key={link.to} style={{ '--i': index }}>
              <NavLink to={link.to} end={link.end} onClick={onClose}>
                <span>{t(`nav.${link.key}`)}</span>
                <Icon name="arrow" size={22} className="flip-rtl" />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mobile-nav__footer">
        <OpenStatus />
        <p className="mobile-nav__area">
          <Icon name="pin" size={18} /> {pick(restaurant.location.area)}
        </p>
        <div className="mobile-nav__actions">
          <a className="btn btn--whatsapp" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" /> {t('common.whatsapp')}
          </a>
          <a className="btn btn--ghost" href={`tel:${restaurant.phone.tel}`}>
            <Icon name="phone" /> <span className="ltr">{restaurant.phone.display}</span>
          </a>
        </div>
        <div className="mobile-nav__bottom">
          <SocialLinks include={['instagram', 'facebook', 'tiktok']} />
          <LanguageToggle />
        </div>
      </div>
    </Dialog>
  );
}
