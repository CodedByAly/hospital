import { useCart } from '../cart/CartContext'
import { money } from '../data/site'
import './OrderBar.css'

// Phones: a sticky "View order" bar once something is in the cart.
export default function OrderBar() {
  const { count, subtotal, openCart, cartOpen } = useCart()
  if (!count) return null
  return (
    <div className={`order-bar${cartOpen ? ' is-hidden' : ''}`}>
      <button type="button" className="order-bar__btn" onClick={openCart} data-cart-target>
        <span className="order-bar__count" key={count}>
          {count}
        </span>
        <span className="order-bar__label">View order</span>
        <span className="order-bar__total">{money(subtotal)}</span>
      </button>
    </div>
  )
}
