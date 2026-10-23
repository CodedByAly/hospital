import { useEffect, useRef } from 'react'
import { useCart } from '../context/CartContext'
import { BagIcon } from './Icons'

/** Cart trigger with live count. Bumps when a flying item lands on it. */
export default function CartButton({ className = '', showLabel = false }) {
  const cart = useCart()
  const ref = useRef(null)

  useEffect(() => {
    if (!cart.pulse || !ref.current?.animate) return
    ref.current.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.14)' }, { transform: 'scale(.96)' }, { transform: 'scale(1)' }],
      { duration: 420, easing: 'cubic-bezier(.3,.7,.4,1)' },
    )
  }, [cart.pulse])

  return (
    <button
      ref={ref}
      type="button"
      className={`cart-btn ${className}`}
      onClick={cart.open}
      data-cart-target
      aria-label={cart.count ? `السلة، ${cart.count} أصناف` : 'السلة فاضية'}
    >
      <BagIcon size={22} />
      {showLabel && <span className="cart-btn__label">السلة</span>}
      {cart.count > 0 && (
        <span key={cart.count} className="cart-btn__count" aria-hidden="true">
          {cart.count}
        </span>
      )}
    </button>
  )
}
