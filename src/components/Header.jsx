import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';
import Logo from './Logo';
import Icon from './Icon';
import SocialLinks from './SocialLinks';
import MobileNav from './MobileNav';
import './Header.css';

export const NAV_LINKS = [
  { to: '/', key: 'home', end: true },
  { to: '/menu', key: 'menu' },
  { to: '/about', key: 'about' },
  { to: '/contact', key: 'contact' },
];

export function LanguageToggle({ className = '' }) {
  const { t, toggle, lang } = useI18n();
  return (
    <button
      type="button"
      className={`lang-toggle ${className}`}
      onClick={toggle}
      aria-label={t('nav.switchLanguageLabel')}
      lang={lang === 'ar' ? 'en' : 'ar'}
    >
      {t('nav.switchLanguage')}
    </button>
  );
}

export function CartButton() {
  const { t } = useI18n();
  const { count, open } = useCart();
  return (
    <button
      type="button"
      className="cart-btn"
      onClick={open}
      data-cart-target
      aria-label={count ? t('nav.cartCount', { count }) : t('nav.cart')}
    >
      <Icon name="bag" size={22} />
      {count > 0 && (
        <span key={count} className="cart-btn__count" aria-hidden="true">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}

export default function Header() {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setNavOpen(false), [pathname]);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="site-header__inner container">
        <Link to="/" className="site-header__logo" aria-label="Life Kitchen, home">
          <Logo />
        </Link>

        <nav className="site-nav" aria-label={t('nav.primary')}>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} className="site-nav__link">
                  {t(`nav.${link.key}`)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <SocialLinks className="site-header__social" />
          <span className="site-header__divider" aria-hidden="true" />
          <LanguageToggle />
          <CartButton />
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setNavOpen(true)}
            aria-label={t('nav.openMenu')}
            aria-expanded={navOpen}
          >
            <Icon name="menu" size={24} />
          </button>
        </div>
      </div>
      <MobileNav open={navOpen} onClose={() => setNavOpen(false)} />
    </header>
  );
}
