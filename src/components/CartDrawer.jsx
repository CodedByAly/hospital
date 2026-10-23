import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useItemSheet } from '../context/ItemSheetContext'
import { useDialog } from '../hooks/useDialog'
import { usePresence } from '../hooks/usePresence'
import { formatPrice } from '../lib/format'
import { describeLine } from '../lib/order'
import CartTotals from './CartTotals'
import FoodImage from './FoodImage'
import QuantityStepper from './QuantityStepper'
import { BagIcon, CloseIcon, EditIcon } from './Icons'

export default function CartDrawer() {
  const cart = useCart()
  const [mounted, visible] = usePresence(cart.isOpen, 320)
  const dialogRef = useDialog(cart.isOpen, cart.close)
  if (!mounted) return null

  return (
    <div className={`drawer-layer ${visible ? 'is-open' : ''}`}>
      <div className="drawer-backdrop" onClick={cart.close} aria-hidden="true" />
      <aside ref={dialogRef} className="drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <header className="drawer__head">
          <h2 id="cart-title" className="drawer__title">
            سلّتك
            {cart.count > 0 && <span className="drawer__count">{cart.count}</span>}
          </h2>
          <button type="button" className="icon-btn" onClick={cart.close} aria-label="إغلاق السلة">
            <CloseIcon />
          </button>
        </header>
        {cart.lines.length ? <CartContents /> : <EmptyCart />}
      </aside>
    </div>
  )
}

function EmptyCart() {
  const cart = useCart()
  return (
    <div className="drawer__empty">
      <span className="drawer__empty-icon" aria-hidden="true">
        <BagIcon size={34} />
      </span>
      <p className="drawer__empty-title">السلة فاضية</p>
      <p className="muted">اختار من المنيو وزيد عالسلة.</p>
      <Link to="/menu" className="btn btn--primary" onClick={cart.close}>
        تصفّح المنيو
      </Link>
    </div>
  )
}

function CartContents() {
  const cart = useCart()
  const { openItem } = useItemSheet()
  const navigate = useNavigate()
  const [confirmClear, setConfirmClear] = useState(false)

  return (
    <>
      <ul className="cart-lines">
        {cart.lines.map((line) => (
          <CartLine key={line.key} line={line} onEdit={() => openItem(line.itemId, line)} />
        ))}
      </ul>

      <div className="drawer__foot">
        <CartTotals totals={cart.totals} />
        <button
          type="button"
          className="btn btn--primary btn--block"
          onClick={() => {
            cart.close()
            navigate('/checkout')
          }}
        >
          كمّل الطلب
        </button>
        <div className="drawer__secondary">
          {confirmClear ? (
            <span className="confirm-inline" role="group" aria-label="تأكيد تفريغ السلة">
              أكيد؟
              <button type="button" className="text-btn text-btn--danger" onClick={cart.clear}>
                فرّغ السلة
              </button>
              <button type="button" className="text-btn" onClick={() => setConfirmClear(false)}>
                لا
              </button>
            </span>
          ) : (
            <button type="button" className="text-btn" onClick={() => setConfirmClear(true)}>
              فرّغ السلة
            </button>
          )}
          <Link to="/menu" className="text-btn" onClick={cart.close}>
            زيد أصناف
          </Link>
        </div>
      </div>
    </>
  )
}

function CartLine({ line, onEdit }) {
  const cart = useCart()
  const [leaving, setLeaving] = useState(false)

  const remove = () => {
    setLeaving(true)
    setTimeout(() => cart.remove(line.key), 220)
  }

  return (
    <li className={`cart-line ${leaving ? 'is-leaving' : ''}`}>
      <FoodImage item={{ name: line.name, image: line.image }} className="cart-line__media" />
      <div className="cart-line__info">
        <p className="cart-line__name">{line.name}</p>
        {describeLine(line).map((d) => (
          <p key={d} className="cart-line__detail">
            {d}
          </p>
        ))}
        <p className="cart-line__unit">{formatPrice({ amount: line.unitPrice, currency: line.currency })} للواحدة</p>
        <div className="cart-line__actions">
          <QuantityStepper
            size="sm"
            value={line.quantity}
            removable
            onChange={(q) => (q < 1 ? remove() : cart.setQuantity(line.key, q))}
            label={`كمية ${line.name}`}
          />
          <button type="button" className="text-btn" onClick={onEdit}>
            <EditIcon size={16} />
            تعديل
          </button>
        </div>
      </div>
      <p className="cart-line__total">{formatPrice({ amount: line.unitPrice * line.quantity, currency: line.currency })}</p>
    </li>
  )
}
