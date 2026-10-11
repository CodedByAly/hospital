import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import restaurant from '../config/restaurant';
import { whatsappLink } from '../lib/links';
import CartButton from './CartButton';
import SocialLinks from './SocialLinks';
import Logo from './Logo';
import Icon from './Icon';

export const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/menu', label: 'Menu' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
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

  // Underline that slides to the active page.
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
  }, [location.pathname]);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="site-header__inner container">
        <Link to="/" className="site-header__brand" aria-label="Khalifa Bites — home">
          <Logo eager label="" className="site-header__logo" />
        </Link>

        <nav className="site-nav" aria-label="Main" ref={navRef}>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}>
              {n.label}
            </NavLink>
          ))}
          {pill && <span className="site-nav__bar" style={{ '--x': `${pill.left}px`, '--w': `${pill.width}px` }} aria-hidden="true" />}
        </nav>

        <div className="site-header__actions">
          <SocialLinks className="site-header__social" withWhatsApp={false} />
          <a href={whatsappLink()} className="site-header__phone" target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${restaurant.phone.display}`}>
            <Icon name="whatsapp" size={20} />
            <span>{restaurant.phone.display}</span>
          </a>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
