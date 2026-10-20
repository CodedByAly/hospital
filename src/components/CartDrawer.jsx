import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Overlay from './Overlay'
import Icon from './Icon'
import QuantityStepper from './QuantityStepper'
import CartLineThumb from './CartLineThumb'
import OrderSummary from './OrderSummary'
import useDialog from '../hooks/useDialog'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import { menuById } from '../data/menu'
import { money, itemTitle } from '../utils/format'
import { lineDetails, lineTotal } from '../utils/cartLine'

export default function CartDrawer() {
  const { cartOpen, setCartOpen, openItem } = useUI()
  const { lines, count, subtotal, setQty, remove, clear } = useCart()
  const [leaving, setLeaving] = useState([])
  const [confirmClear, setConfirmClear] = useState(false)
  const navigate = useNavigate()
  const close = () => {
    setCartOpen(false)
    setConfirmClear(false)
  }
  const ref = useDialog(cartOpen, close)

  // Let the row slide out before it is removed from state.
  function removeAnimated(key) {
    setLeaving((l) => [...l, key])
    setTimeout(() => {
      remove(key)
      setLeaving((l) => l.filter((k) => k !== key))
    }, 220)
  }

  function goToCheckout() {
    close()
    navigate('/checkout')
  }

  function browse() {
    close()
    navigate('/#menu')
  }

  return (
    <Overlay open={cartOpen} onClose={close} variant="drawer" labelledBy="cart-title" panelRef={ref}>
      <div className="drawer__head">
        <h2 id="cart-title">
          Your order {count > 0 && <span className="drawer__count">{count} {count === 1 ? 'item' : 'items'}</span>}
        </h2>
        <button type="button" className="icon-btn" onClick={close} aria-label="Close order">
          <Icon name="close" size={20} />
        </button>
      </div>

      {lines.length === 0 ? (
        <div className="drawer__empty">
          <div className="drawer__empty-mark" aria-hidden="true">
            <Icon name="bag" size={30} strokeWidth={1.4} />
          </div>
          <p className="drawer__empty-title">Nothing here yet</p>
          <p>Pick something from the menu and it will show up here.</p>
          <button type="button" className="btn btn--primary" onClick={browse}>
            See the menu
          </button>
        </div>
      ) : (
        <>
          <ul className="drawer__lines">
            {lines.map((line) => {
              const item = menuById[line.itemId]
              const details = lineDetails(line)
              return (
                <li key={line.key} className={`cart-line ${leaving.includes(line.key) ? 'is-leaving' : ''}`}>
                  <CartLineThumb itemId={line.itemId} />
                  <div className="cart-line__main">
                    <div className="cart-line__top">
                      <p className="cart-line__name">{itemTitle(item)}</p>
                      <p className="cart-line__price">{money(lineTotal(line))}</p>
                    </div>
                    {details.length > 0 && (
                      <ul className="cart-line__details">
                        {details.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    )}
                    <div className="cart-line__controls">
                      <QuantityStepper
                        size="sm"
                        min={0}
                        value={line.qty}
                        label={`Quantity of ${itemTitle(item)}`}
                        onChange={(q) => (q <= 0 ? removeAnimated(line.key) : setQty(line.key, q))}
                      />
                      <button type="button" className="link-btn" onClick={() => openItem(line.itemId, line.key)}>
                        <Icon name="edit" size={15} /> Edit
                      </button>
                      <button type="button" className="link-btn link-btn--muted" onClick={() => removeAnimated(line.key)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="drawer__foot">
            <OrderSummary subtotal={subtotal} orderType="delivery" />
            <button type="button" className="btn btn--primary btn--lg btn--block" onClick={goToCheckout}>
              <span>Checkout</span>
              <Icon name="arrowRight" size={18} />
            </button>
            <div className="drawer__clear">
              {confirmClear ? (
                <p role="alert">
                  Remove everything?{' '}
                  <button type="button" className="link-btn link-btn--danger" onClick={() => { clear(); setConfirmClear(false) }}>
                    Yes, clear
                  </button>{' '}
                  <button type="button" className="link-btn" onClick={() => setConfirmClear(false)}>
                    Keep
                  </button>
                </p>
              ) : (
                <button type="button" className="link-btn link-btn--muted" onClick={() => setConfirmClear(true)}>
                  <Icon name="trash" size={15} /> Clear order
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </Overlay>
  )
}
