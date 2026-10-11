import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { telLink } from '../lib/links';
import restaurant from '../config/restaurant';
import CartButton from './CartButton';
import LanguageSwitch from './LanguageSwitch';
import SocialLinks from './SocialLinks';
import Logo from './Logo';
import Icon from './Icon';

const NAV = ['home', 'menu', 'about', 'contact'];
export const pathFor = (key) => (key === 'home' ? '/' : `/${key}`);

export default function Header() {
  const { t, lang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const [pill, setPill] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sliding underline that follows the active page.
  useLayoutEffect(() => {
    const measure = () => {
      const nav = navRef.current;
      const active = nav?.querySelector('a.active');
      if (!nav || !active) return setPill(null);
      const n = nav.getBoundingClientRect();
      const a = active.getBoundingClientRect();
      setPill({ left: a.left - n.left, width: a.width });
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [location.pathname, lang]);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="site-header__inner container">
        <Link to="/" className="site-header__brand" aria-label={`${restaurant.name} — ${t.nav.home}`}>
          <Logo className="site-header__logo" eager label="" />
        </Link>

        <nav className="site-nav" aria-label={t.nav.main} ref={navRef}>
          {NAV.map((key) => (
            <NavLink key={key} to={pathFor(key)} end={key === 'home'}>
              {t.nav[key]}
            </NavLink>
          ))}
          {pill && <span className="site-nav__pill" style={{ '--x': `${pill.left}px`, '--w': `${pill.width}px` }} aria-hidden="true" />}
        </nav>

        <div className="site-header__actions">
          <SocialLinks className="site-header__social" withWhatsApp={false} />
          <a href={telLink} className="site-header__phone" dir="ltr">
            <Icon name="phone" size={18} />
            {restaurant.phone.display}
          </a>
          <LanguageSwitch />
          <CartButton />
        </div>
      </div>
    </header>
  );
}
