import { useState } from 'react'
import { itemsById } from '../data/menu.js'
import { restaurant } from '../data/restaurant.js'
import { useShop } from '../context/ShopContext.jsx'
import { lineDetails, lineTotal } from '../lib/cart.js'
import { formatPrice } from '../lib/format.js'
import { goToSection, navigate } from '../lib/router.js'
import FoodImage from './FoodImage.jsx'
import Icon from './Icon.jsx'
import Overlay from './Overlay.jsx'
import QuantityStepper from './QuantityStepper.jsx'

const LEAVE_MS = 220

export function CartLine({ line, compact = false }) {
  const { setQty, removeLine, openItem } = useShop()
  const [leaving, setLeaving] = useState(false)
  const item = itemsById[line.itemId]
  if (!item) return null

  const remove = () => {
    setLeaving(true)
    setTimeout(() => removeLine(line.uid), LEAVE_MS)
  }
  const changeQty = (qty) => (qty < 1 ? remove() : setQty(line.uid, qty))
  const details = lineDetails(line)

  return (
    <li className={`cart-line ${leaving ? 'is-leaving' : ''}`}>
      <FoodImage item={item} className="food-img--thumb" />
      <div className="cart-line__main">
        <div className="cart-line__top">
          <h3 className="cart-line__name">{item.name}</h3>
          <span className="cart-line__total">{formatPrice(lineTotal(line))}</span>
        </div>
        {details.length > 0 && (
          <ul className="cart-line__details">
            {details.map((d) => <li key={d}>{d}</li>)}
          </ul>
        )}
        {!compact && (
          <div className="cart-line__actions">
            <QuantityStepper size="sm" min={0} value={line.qty} onChange={changeQty} label={`Quantity of ${item.name}`} />
            <div className="cart-line__links">
              {(item.options.length > 0 || item.addons || item.removable.length > 0) && (
                <button type="button" className="text-btn" onClick={() => openItem(item.id, line)}>
                  <Icon name="edit" size={15} /> Edit
                </button>
              )}
              <button type="button" className="text-btn text-btn--muted" onClick={remove}>
                <Icon name="trash" size={15} /> Remove
              </button>
            </div>
          </div>
        )}
        {compact && <p className="cart-line__qty">Qty {line.qty}</p>}
      </div>
    </li>
  )
}

export default function CartDrawer() {
  const { lines, count, subtotal, cartOpen, closeCart, clearCart } = useShop()
  const [confirmClear, setConfirmClear] = useState(false)
  const fee = restaurant.ordering.deliveryFee

  const toCheckout = () => {
    closeCart()
    navigate('/checkout')
    window.scrollTo(0, 0)
  }

  return (
    <Overlay open={cartOpen} onClose={closeCart} variant="drawer" labelledBy="cart-title" className="cart">
      <div className="cart__head">
        <h2 id="cart-title" className="cart__title">
          Your bag {count > 0 && <span className="cart__count">{count} item{count === 1 ? '' : 's'}</span>}
        </h2>
        <button type="button" className="icon-btn" onClick={closeCart} aria-label="Close bag" data-autofocus>
          <Icon name="close" size={20} />
        </button>
      </div>

      {lines.length === 0 ? (
        <div className="cart__empty">
          <img src="/images/logo-240.webp" alt="" width="96" height="96" loading="lazy" />
          <p className="cart__empty-title">Your bag is empty</p>
          <p className="muted">Strips, sliders, a Cregg or two. Whatever you're craving, it starts on the menu.</p>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => {
              closeCart()
              setTimeout(() => goToSection('menu'), 260)
            }}
          >
            Browse the menu
          </button>
        </div>
      ) : (
        <>
          <ul className="cart__lines">
            {lines.map((line) => <CartLine key={line.uid} line={line} />)}
          </ul>

          <div className="cart__foot">
            <dl className="totals">
              <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            </dl>
            <p className="cart__note">
              {fee == null
                ? 'Pickup is free. For delivery, the branch confirms the fee for your area on WhatsApp.'
                : `Pickup is free. Delivery adds ${formatPrice(fee)}.`}
            </p>
            <button type="button" className="btn btn--primary btn--block btn--lg" onClick={toCheckout}>
              <span>Checkout</span>
              <span className="btn__price">{formatPrice(subtotal)}</span>
            </button>
            <div className="cart__clear">
              {confirmClear ? (
                <span className="cart__confirm">
                  Empty the whole bag?
                  <button type="button" className="text-btn text-btn--danger" onClick={() => { clearCart(); setConfirmClear(false) }}>Yes, clear</button>
                  <button type="button" className="text-btn" onClick={() => setConfirmClear(false)}>Keep</button>
                </span>
              ) : (
                <button type="button" className="text-btn text-btn--muted" onClick={() => setConfirmClear(true)}>Clear bag</button>
              )}
            </div>
          </div>
        </>
      )}
    </Overlay>
  )
}
