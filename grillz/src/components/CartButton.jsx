import { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { onCartBump } from '../lib/flyToCart';
import { formatTotals } from '../lib/format';
import Icon from './Icon';

const label = (n) => (n ? `Open cart, ${n} ${n === 1 ? 'item' : 'items'}` : 'Open cart, empty');

/** Cart trigger with live count. It "catches" flying items with a small squash. */
export default function CartButton({ variant = 'header' }) {
  const { count, totals } = useCart();
  const { openCart } = useUI();
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

  const badge = count > 0 && (
    <span className="badge" key={`${count}-${bump}`}>
      {count}
    </span>
  );

  if (variant === 'tab') {
    return (
      <button type="button" className="tabbar__item tabbar__item--cart" onClick={openCart} aria-label={label(count)}>
        <span className="tabbar__icon" ref={ref} data-cart-target>
          <Icon name="bag" />
          {badge}
        </span>
        <span className="tabbar__label">Cart</span>
      </button>
    );
  }

  return (
    <button type="button" className="cart-btn" onClick={openCart} aria-label={label(count)}>
      <span className="cart-btn__icon" ref={ref} data-cart-target>
        <Icon name="bag" />
        {badge}
      </span>
      <span className="cart-btn__total">{count ? formatTotals(totals) : 'Cart'}</span>
    </button>
  );
}
