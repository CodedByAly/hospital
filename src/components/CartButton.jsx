import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { useLanguage } from '../i18n/LanguageContext';
import Icon from './Icon';

export default function CartButton({ className = '' }) {
  const { count } = useCart();
  const { openCart } = useUI();
  const { t } = useLanguage();
  return (
    <button type="button" className={`cart-button ${className}`} onClick={openCart} aria-label={t.nav.cartLabel(count)}>
      <span className="cart-button__icon" data-cart-target>
        <Icon name="bag" size={20} />
        {count > 0 ? (
          <span className="cart-badge" key={count} aria-hidden="true">
            {count > 99 ? '99+' : count}
          </span>
        ) : null}
      </span>
      <span className="cart-button__label" aria-hidden="true">{t.nav.cart}</span>
    </button>
  );
}
