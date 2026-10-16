import { useEffect, useState } from 'react';
import { restaurant } from '../data/restaurant';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import Logo from './Logo';
import Icon from './Icon';
import './Header.css';

export const navLinks = [
  { href: '#top', label: 'Home' },
  { href: '#menu', label: 'Menu' },
  { href: '#about', label: 'About' },
  { href: '#visit', label: 'Contact' },
];

export function CartCount({ count }) {
  return count > 0 ? (
    <span className="cart-count" key={count}>
      {count > 99 ? '99+' : count}
    </span>
  ) : null;
}

export default function Header() {
  const { count } = useCart();
  const { openOrder } = useUI();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container site-header__inner">
        <a href="#top" className="site-header__brand" aria-label={`${restaurant.fullName}, back to top`}>
          <Logo decorative className="site-header__logo" />
        </a>

        <nav className="site-header__nav" aria-label="Main">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          {restaurant.socials.map((s) => (
            <a
              key={s.id}
              className="icon-btn site-header__social"
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Talia on ${s.label}`}
            >
              <Icon name={s.id} size={20} />
            </a>
          ))}
          <button
            type="button"
            className="site-header__cart"
            onClick={openOrder}
            data-cart-target
            aria-label={`Your order, ${count} ${count === 1 ? 'item' : 'items'}`}
          >
            <Icon name="tray" size={20} />
            <span className="site-header__cart-label">Your order</span>
            <CartCount count={count} />
          </button>
        </div>
      </div>
    </header>
  );
}
