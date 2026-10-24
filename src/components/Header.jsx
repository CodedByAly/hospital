import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { socialLinks, telLink, whatsappLink } from '../data/restaurant';
import { money } from '../lib/format';
import { BagIcon, PhoneIcon, SocialIcon, WhatsAppIcon } from './Icons';
import { Logo } from './Logo';
import './Header.css';

export const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/menu', label: 'Menu' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const { count, subtotal, openCart } = useCart();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // On the home page the header sits on the dark hero until you scroll.
  const overHero = pathname === '/' && !scrolled;

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${overHero ? 'is-over-hero' : ''}`}>
      <div className="container site-header__bar">
        <Link to="/" className="site-header__logo" aria-label="Chicago Burgers, home">
          <Logo />
        </Link>

        <nav className="site-nav" aria-label="Main">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className="site-nav__link">
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          {socialLinks.map((s) => (
            <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="icon-btn hide-mobile" aria-label={`${s.label} ${s.handle}`}>
              <SocialIcon id={s.id} />
            </a>
          ))}
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="Chat on WhatsApp">
            <WhatsAppIcon />
          </a>
          <a href={telLink} className="icon-btn show-mobile" aria-label="Call us">
            <PhoneIcon />
          </a>
          <button type="button" className="header-cart hide-mobile" onClick={openCart} data-cart-target aria-label={`Open cart, ${count} items`}>
            <span className="header-cart__icon">
              <BagIcon size={20} />
              {count > 0 && (
                <span className="cart-badge" key={count}>
                  {count}
                </span>
              )}
            </span>
            <span className="header-cart__total">{count > 0 ? money(subtotal) : 'Cart'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
