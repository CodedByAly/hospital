import { useCart } from '../cart/CartContext'
import { BagIcon } from './Icons'
import { money } from '../data/site'

export default function CartButton({ showTotal = false }) {
  const { count, subtotal, openCart } = useCart()
  return (
    <button
      type="button"
      className={`cart-btn${count ? ' has-items' : ''}`}
      onClick={openCart}
      aria-label={count ? `Your order, ${count} ${count === 1 ? 'item' : 'items'}, ${money(subtotal)}` : 'Your order is empty'}
      data-cart-target
    >
      <BagIcon />
      {count > 0 && (
        <span className="cart-btn__count" key={count} aria-hidden="true">
          {count}
        </span>
      )}
      {showTotal && count > 0 && (
        <span className="cart-btn__total" aria-hidden="true">
          {money(subtotal)}
        </span>
      )}
    </button>
  )
}
