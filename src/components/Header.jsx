import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { site } from '../config/site.js';
import { useShop } from '../context/ShopContext.jsx';
import { formatCents, whatsappHref } from '../lib/format.js';
import Icon, { InstagramIcon, WhatsAppIcon } from './Icon.jsx';
import Logo from './Logo.jsx';
import './Header.css';

export const navLinks = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/menu', label: 'Menu', icon: 'menu' },
  { to: '/about', label: 'About', icon: 'info' },
  { to: '/contact', label: 'Contact', icon: 'chat' },
];

export default function Header() {
  const { count, subtotalCents, openCart } = useShop();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container site-header__inner">
        <Link to="/" className="site-header__logo" aria-label="Zaher's, home">
          <Logo title="" />
        </Link>

        <nav className="site-nav" aria-label="Main">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className="site-nav__link">
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <a className="icon-btn icon-btn--ghost" href={site.social.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Zaher's on Instagram">
            <InstagramIcon />
          </a>
          <a className="icon-btn icon-btn--ghost" href={whatsappHref(site.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label="Message Zaher's on WhatsApp">
            <WhatsAppIcon />
          </a>
          <button type="button" className="cart-btn" onClick={openCart} aria-label={`Your order, ${count} ${count === 1 ? 'item' : 'items'}`}>
            <span className="cart-btn__icon" data-cart-target>
              <Icon name="bag" size={20} />
              {count > 0 && <span className="cart-btn__badge" key={count}>{count}</span>}
            </span>
            <span className="cart-btn__label hide-sm">{count > 0 ? formatCents(subtotalCents) : 'Your order'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
