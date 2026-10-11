import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import Logo from './Logo';
import LangSwitch from './LangSwitch';
import SocialLinks from './SocialLinks';
import CartButton from './CartButton';

export default function Header() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { to: '/', label: t.nav.home, end: true },
    { to: '/menu', label: t.nav.menu },
    { to: '/about', label: t.nav.about },
    { to: '/contact', label: t.nav.contact },
  ];

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container site-header__inner">
        <Link to="/" className="site-header__brand" aria-label={`O'snack — ${t.nav.home}`}>
          <Logo />
        </Link>

        <nav className="site-nav" aria-label={t.nav.primary}>
          <ul>
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end} className="site-nav__link">
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <SocialLinks className="site-header__social" />
          <LangSwitch />
          <CartButton className="site-header__cart" />
        </div>
      </div>
    </header>
  );
}
