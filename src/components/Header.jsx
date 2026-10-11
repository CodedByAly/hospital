import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { site } from '../config/site.js';
import { useShop } from '../context/ShopContext.jsx';
import { whatsappHref } from '../lib/format.js';
import Icon, { InstagramIcon, WhatsAppIcon } from './Icon.jsx';
import Logo from './Logo.jsx';
import AnimatedPrice from './AnimatedPrice.jsx';
import './Header.css';

export const navLinks = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/menu', label: 'Menu', icon: 'menu' },
  { to: '/about', label: 'About', icon: 'info' },
  { to: '/contact', label: 'Contact', icon: 'chat' },
];

export default function Header() {
  const { count, subtotalCents, openCart, branch, openBranchPicker } = useShop();
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
          <button type="button" className="branch-chip" onClick={openBranchPicker} aria-label={branch ? `Ordering from ${branch.name}. Change branch` : 'Choose your branch'}>
            <Icon name="pin" size={16} />
            <span className="branch-chip__label">
              {branch ? branch.name : (
                <>
                  <span className="branch-chip__long">Choose </span>branch
                </>
              )}
            </span>
            <svg className="branch-chip__caret" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
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
            <span className="cart-btn__label hide-sm">{count > 0 ? <AnimatedPrice cents={subtotalCents} /> : 'Your order'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
