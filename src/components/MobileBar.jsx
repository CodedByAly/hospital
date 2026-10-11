import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { useLanguage } from '../i18n/LanguageContext';
import { numberFormat } from '../lib/format';
import Icon from './Icon';

/** Thumb-reachable navigation for phones, with the cart in the centre. */
export default function MobileBar() {
  const { t } = useLanguage();
  const { count, subtotal } = useCart();
  const { openCart } = useUI();

  const item = (to, icon, label, end) => (
    <NavLink to={to} end={end} className="mobile-bar__link">
      <Icon name={icon} size={22} />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <nav className="mobile-bar" aria-label={t.nav.primary}>
      {item('/', 'home', t.nav.home, true)}
      {item('/menu', 'menu', t.nav.menu)}
      <button type="button" className="mobile-bar__cart" onClick={openCart} aria-label={t.nav.cartLabel(count)}>
        <span className="mobile-bar__cart-icon" data-cart-target>
          <Icon name="bag" size={22} />
          {count > 0 ? (
            <span className="cart-badge" key={count} aria-hidden="true">
              {count > 99 ? '99+' : count}
            </span>
          ) : null}
        </span>
        <span className="mobile-bar__cart-total" aria-hidden="true" dir={count > 0 ? 'ltr' : undefined}>
          {count > 0 ? numberFormat.format(subtotal) : t.nav.cart}
        </span>
      </button>
      {item('/about', 'info', t.nav.about)}
      {item('/contact', 'chat', t.nav.contact)}
    </nav>
  );
}
