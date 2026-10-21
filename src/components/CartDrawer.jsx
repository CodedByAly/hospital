import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { restaurant } from '../config/restaurant.js'
import { useCart } from '../context/CartContext.jsx'
import { findItem } from '../data/menu.js'
import { useDialog } from '../hooks/useDialog.js'
import { usePresence } from '../hooks/usePresence.js'
import { formatPrice } from '../lib/format.js'
import { describeLine, lineTotal } from '../lib/pricing.js'
import { IconArrowRight, IconBag, IconClose, IconEdit } from './Icons.jsx'
import { QuantityStepper } from './QuantityStepper.jsx'

export function CartDrawer() {
  const { cartOpen, closeCart } = useCart()
  const { mounted, visible } = usePresence(cartOpen, 300)
  if (!mounted) return null
  return <Drawer visible={visible} open={cartOpen} onClose={closeCart} />
}

function Drawer({ visible, open, onClose }) {
  const { lines, count, subtotal, setQty, remove, clear, openItem } = useCart()
  const [confirmClear, setConfirmClear] = useState(false)
  const [leaving, setLeaving] = useState(() => new Set())
  const dialogRef = useDialog(open, onClose)
  const navigate = useNavigate()

  // Let a line slide out before it is removed from the cart.
  const removeAnimated = (key) => {
    setLeaving((s) => new Set(s).add(key))
    setTimeout(() => remove(key), 220)
  }

  const goToCheckout = () => {
    onClose()
    navigate('/checkout')
  }

  return (
    <div className={`sheet-layer sheet-layer--drawer ${visible ? 'is-visible' : ''}`}>
      <div className="sheet-backdrop" onClick={onClose} aria-hidden="true" />
      <aside ref={dialogRef} className="sheet drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <header className="drawer__head">
          <div className="sheet__grab" aria-hidden="true" />
          <h2 id="cart-title" className="drawer__title">
            Your order {count > 0 && <span className="drawer__count">{count}</span>}
          </h2>
          <button type="button" className="sheet__close sheet__close--plain" onClick={onClose} aria-label="Close order">
            <IconClose size={20} />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="drawer__empty">
            <span className="drawer__empty-icon">
              <IconBag size={28} />
            </span>
            <p className="drawer__empty-title">Nothing here yet</p>
            <p className="drawer__empty-text">Pick something from the menu and it will show up here.</p>
            <button
              type="button"
              className="btn btn--primary"
              data-autofocus
              onClick={() => {
                onClose()
                navigate('/menu')
              }}
            >
              Browse the menu
            </button>
          </div>
        ) : (
          <>
            <ul className="drawer__lines">
              {lines.map((line) => {
                const item = findItem(line.itemId)
                const { options, removed } = describeLine(line)
                return (
                  <li key={line.key} className={`cart-line ${leaving.has(line.key) ? 'is-leaving' : ''}`}>
                    <div className="cart-line__main">
                      <p className="cart-line__name">{item.name}</p>
                      {options.length > 0 && <p className="cart-line__meta">{options.join(' · ')}</p>}
                      {removed.length > 0 && <p className="cart-line__meta cart-line__meta--removed">{removed.join(' · ')}</p>}
                      <div className="cart-line__actions">
                        <button type="button" className="link-btn" onClick={() => openItem(item.id, line.key)}>
                          <IconEdit size={14} /> Edit
                        </button>
                        <button type="button" className="link-btn link-btn--danger" onClick={() => removeAnimated(line.key)}>
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="cart-line__side">
                      <p className="cart-line__price">{formatPrice(lineTotal(line))}</p>
                      <QuantityStepper
                        size="sm"
                        value={line.qty}
                        min={0}
                        removeAtMin
                        label={`Quantity of ${item.name}`}
                        onChange={(q) => (q < 1 ? removeAnimated(line.key) : setQty(line.key, q))}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="drawer__clear">
              {confirmClear ? (
                <span className="drawer__confirm" role="group" aria-label="Confirm clearing the order">
                  Remove everything?
                  <button type="button" className="link-btn link-btn--danger" onClick={() => { clear(); setConfirmClear(false) }}>
                    Yes, clear
                  </button>
                  <button type="button" className="link-btn" onClick={() => setConfirmClear(false)}>
                    Keep
                  </button>
                </span>
              ) : (
                <button type="button" className="link-btn" onClick={() => setConfirmClear(true)}>
                  Clear order
                </button>
              )}
            </div>

            <footer className="sheet__foot drawer__foot">
              <dl className="totals">
                <div>
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                <div className="totals__muted">
                  <dt>Delivery</dt>
                  <dd>{restaurant.deliveryFee == null ? 'Confirmed with your order' : `+${formatPrice(restaurant.deliveryFee)} for delivery`}</dd>
                </div>
                <div className="totals__total">
                  <dt>Total</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
              </dl>
              <button type="button" className="btn btn--primary btn--block" onClick={goToCheckout}>
                <span>Checkout</span>
                <IconArrowRight size={18} />
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
