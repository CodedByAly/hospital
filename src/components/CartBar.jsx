import { useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';
import Price from './Price';
import './CartBar.css';

/** Phone-only order bar, always within thumb reach once something is in the cart. */
export default function CartBar() {
  const { t } = useI18n();
  const { count, subtotal, open } = useCart();
  const { pathname } = useLocation();
  const hidden = count === 0 || pathname.startsWith('/checkout') || pathname.startsWith('/order');

  return (
    <div className={`cart-bar ${hidden ? 'is-hidden' : ''}`} aria-hidden={hidden}>
      <button type="button" className="cart-bar__btn" onClick={open} tabIndex={hidden ? -1 : 0} data-cart-target>
        <span className="cart-bar__count">{count}</span>
        <span className="cart-bar__label">{t('cart.view')}</span>
        <Price value={subtotal} className="cart-bar__total" />
      </button>
    </div>
  );
}
