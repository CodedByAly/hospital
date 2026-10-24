import { useEffect, useState } from 'react'
import Modal from './Modal'
import Checkout from './Checkout'
import { BagIcon, MinusIcon, PlusIcon, TrashIcon } from './Icons'
import { useCart } from '../cart/CartContext'
import { lineDetails } from '../cart/order'
import { itemsById } from '../data/menu'
import { money, site } from '../data/site'
import './CartDrawer.css'

export default function CartDrawer() {
  const { cartOpen, closeCart, lines, count, subtotal, setQty, remove, clear, openItem } = useCart()
  const [step, setStep] = useState('cart')
  const [confirmClear, setConfirmClear] = useState(false)

  // Always start on the cart when it's reopened.
  useEffect(() => {
    if (cartOpen) {
      setStep('cart')
      setConfirmClear(false)
    }
  }, [cartOpen])

  // Nothing left to check out.
  useEffect(() => {
    if (!lines.length && step === 'checkout') setStep('cart')
  }, [lines.length, step])

  const fee = site.ordering.deliveryFee

  return (
    <Modal open={cartOpen} onClose={closeCart} label="Your order" variant="drawer" closeLabel="Close your order">
      {step === 'checkout' ? (
        <Checkout onBack={() => setStep('cart')} />
      ) : (
        <div className="cart">
          <header className="cart__head">
            <h2 className="display cart__title">Your order</h2>
            {count > 0 && (
              <p className="cart__count">
                {count} {count === 1 ? 'item' : 'items'}
              </p>
            )}
          </header>

          {lines.length === 0 ? (
            <div className="cart__empty">
              <span className="cart__empty-icon">
                <BagIcon />
              </span>
              <p className="display">Nothing here yet.</p>
              <p>Add a sandwich, a burger or something sweet and it will show up here.</p>
              <a href="#menu" className="btn" onClick={closeCart}>
                Browse the menu
              </a>
            </div>
          ) : (
            <>
              <ul className="cart__lines">
                {lines.map((l) => {
                  const item = itemsById[l.id]
                  const details = lineDetails(l)
                  return (
                    <li key={l.key} className="line">
                      <div className="line__top">
                        <div className="line__text">
                          <p className="line__name">{item.name}</p>
                          <p className="line__unit">{money(item.price)} each</p>
                          {details.length > 0 && (
                            <ul className="line__details">
                              {details.map((d) => (
                                <li key={d}>{d}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <p className="line__price">{money(item.price * l.qty)}</p>
                      </div>
                      <div className="line__actions">
                        <div className="stepper stepper--sm" role="group" aria-label={`Quantity of ${item.name}`}>
                          <button
                            type="button"
                            onClick={() => setQty(l.key, l.qty - 1)}
                            aria-label={l.qty === 1 ? `Remove ${item.name}` : `One less ${item.name}`}
                          >
                            {l.qty === 1 ? <TrashIcon /> : <MinusIcon />}
                          </button>
                          <output aria-live="polite">{l.qty}</output>
                          <button type="button" onClick={() => setQty(l.key, l.qty + 1)} aria-label={`One more ${item.name}`}>
                            <PlusIcon />
                          </button>
                        </div>
                        <button type="button" className="line__link" onClick={() => openItem(item, l.key)}>
                          Edit
                        </button>
                        <button type="button" className="line__link" onClick={() => remove(l.key)}>
                          Remove
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <div className="cart__clear">
                {confirmClear ? (
                  <p>
                    Empty the whole order?{' '}
                    <button type="button" className="line__link" onClick={clear}>
                      Yes, clear it
                    </button>{' '}
                    <button type="button" className="line__link" onClick={() => setConfirmClear(false)}>
                      Keep it
                    </button>
                  </p>
                ) : (
                  <button type="button" className="line__link" onClick={() => setConfirmClear(true)}>
                    Clear order
                  </button>
                )}
              </div>

              <footer className="cart__foot">
                <dl className="totals">
                  <div>
                    <dt>Subtotal</dt>
                    <dd>{money(subtotal)}</dd>
                  </div>
                  {site.ordering.delivery && (
                    <div className="totals__muted">
                      <dt>Delivery</dt>
                      <dd>{fee == null ? 'Confirmed on WhatsApp' : money(fee)}</dd>
                    </div>
                  )}
                </dl>
                <button type="button" className="btn btn--block cart__go" onClick={() => setStep('checkout')}>
                  <span>Checkout</span>
                  <span>{money(subtotal)}</span>
                </button>
              </footer>
            </>
          )}
        </div>
      )}
    </Modal>
  )
}
