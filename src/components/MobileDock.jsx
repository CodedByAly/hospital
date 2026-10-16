import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { formatPrice } from '../lib/format';
import Icon from './Icon';
import { CartCount } from './Header';
import './MobileDock.css';

const tabs = [
  { id: 'top', label: 'Home', icon: 'home' },
  { id: 'menu', label: 'Menu', icon: 'book' },
  { id: 'visit', label: 'Visit', icon: 'pin' },
];

// Thumb-reach navigation for phones. The order button doubles as a running total.
export default function MobileDock() {
  const { count, total } = useCart();
  const { openOrder, focusSearch } = useUI();
  const [active, setActive] = useState('top');

  useEffect(() => {
    const ids = ['top', 'menu', 'about', 'visit'];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!('IntersectionObserver' in window) || sections.length === 0) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id === 'about' ? 'visit' : e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <nav className="dock" aria-label="Quick navigation">
      <div className="dock__tabs">
        {tabs.map((t) => (
          <a key={t.id} href={`#${t.id}`} className={`dock__tab ${active === t.id ? 'is-active' : ''}`} aria-current={active === t.id ? 'true' : undefined}>
            <Icon name={t.icon} size={22} />
            <span>{t.label}</span>
          </a>
        ))}
        <button type="button" className="dock__tab" onClick={focusSearch}>
          <Icon name="search" size={22} />
          <span>Search</span>
        </button>
      </div>
      <button
        type="button"
        className={`dock__order ${count > 0 ? 'has-items' : ''}`}
        onClick={openOrder}
        data-cart-target
        aria-label={`Your order, ${count} ${count === 1 ? 'item' : 'items'}`}
      >
        <span className="dock__order-icon">
          <Icon name="tray" size={22} />
          <CartCount count={count} />
        </span>
        <span className="dock__order-text">{count > 0 ? formatPrice(total) : 'Order'}</span>
      </button>
    </nav>
  );
}
