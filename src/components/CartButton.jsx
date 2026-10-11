import { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { useLanguage } from '../i18n/LanguageContext';
import { onCartBump } from '../lib/flyToCart';
import Icon from './Icon';

/** Cart trigger with live count. "Catches" flying items with a small bump. */
export default function CartButton({ variant = 'header' }) {
  const { count } = useCart();
  const { openCart } = useUI();
  const { t } = useLanguage();
  const [bump, setBump] = useState(0);
  const ref = useRef(null);

  useEffect(() => onCartBump(() => setBump((b) => b + 1)), []);

  useEffect(() => {
    const el = ref.current;
    if (!bump || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(0.9, 1.08)', offset: 0.25 },
        { transform: 'scale(1.08, 0.94)', offset: 0.55 },
        { transform: 'scale(1)' },
      ],
      { duration: 420, easing: 'cubic-bezier(.3,.7,.4,1)' },
    );
  }, [bump]);

  if (variant === 'tab') {
    return (
      <button type="button" className="tabbar__item" onClick={openCart} aria-label={t.nav.openCart(count)}>
        <span className="tabbar__icon" ref={ref} data-cart-target>
          <Icon name="bag" />
          {count > 0 && (
            <span className="badge" key={`${count}-${bump}`}>
              {count}
            </span>
          )}
        </span>
        <span className="tabbar__label">{t.nav.cart}</span>
      </button>
    );
  }

  return (
    <button type="button" className="cart-btn" onClick={openCart} aria-label={t.nav.openCart(count)} ref={ref} data-cart-target>
      <Icon name="bag" />
      <span className="cart-btn__label">{t.nav.cart}</span>
      {count > 0 && (
        <span className="badge" key={`${count}-${bump}`}>
          {count}
        </span>
      )}
    </button>
  );
}
