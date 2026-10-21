import { useEffect, useRef } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { registerCartTarget } from '../lib/fly.js'
import { formatPrice } from '../lib/format.js'
import { IconBag } from './Icons.jsx'

export function CartButton({ variant = 'header' }) {
  const { count, subtotal, openCart } = useCart()
  const ref = useRef(null)
  useEffect(() => registerCartTarget(ref.current), [])

  return (
    <button
      ref={ref}
      type="button"
      className={`cart-btn cart-btn--${variant}`}
      onClick={openCart}
      onAnimationEnd={(e) => e.currentTarget.classList.remove('is-bumped')}
      aria-label={`Open your order, ${count} ${count === 1 ? 'item' : 'items'}`}
    >
      <span className="cart-btn__icon">
        <IconBag size={variant === 'dock' ? 22 : 20} />
        {count > 0 && (
          <span className="cart-btn__count" key={count}>
            {count}
          </span>
        )}
      </span>
      {variant === 'header' && <span className="cart-btn__label">{count > 0 ? formatPrice(subtotal) : 'Order'}</span>}
      {variant === 'dock' && <span className="dock__label">{count > 0 ? formatPrice(subtotal) : 'Order'}</span>}
    </button>
  )
}
