import { useEffect, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import { t } from '../content/text'
import { useDialog } from '../hooks/useDialog'
import { usePresence } from '../hooks/usePresence'
import CartLines, { CartTotals } from './CartLines'
import Icon from './Icon'
import './CartDrawer.css'

export default function CartDrawer() {
  const { cartOpen, closeCart, activeItem } = useUI()
  const [mounted, visible] = usePresence(cartOpen, 360)
  if (!mounted) return null
  // While an item is being edited on top, the drawer stops trapping focus.
  return <DrawerPanel visible={visible} trapFocus={!activeItem} onClose={closeCart} />
}

function DrawerPanel({ visible, trapFocus, onClose }) {
  const cart = useCart()
  const titleId = useId()
  const ref = useDialog(visible && trapFocus, onClose)
  const [confirmClear, setConfirmClear] = useState(false)

  useEffect(() => {
    if (!cart.lines.length) setConfirmClear(false)
  }, [cart.lines.length])

  return (
    <div className={`drawer ${visible ? 'is-open' : ''}`}>
      <div className="drawer__backdrop" onClick={onClose} aria-hidden="true" />
      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={ref}>
        <header className="drawer__head">
          <h2 id={titleId}>{t('cart.title')}</h2>
          {cart.count > 0 && (
            <span className="drawer__count">
              {cart.count === 1 ? t('cart.oneItem') : t('cart.items', { count: cart.count })}
            </span>
          )}
          <button type="button" className="icon-btn drawer__close" onClick={onClose} aria-label={t('cart.close')}>
            <Icon name="close" size={22} />
          </button>
        </header>

        {cart.lines.length === 0 ? (
          <div className="drawer__empty">
            <div className="drawer__empty-mark" aria-hidden="true">
              <Icon name="bag" size={34} />
            </div>
            <h3>{t('cart.empty')}</h3>
            <p>{t('cart.emptyHint')}</p>
            <Link to="/menu" className="btn btn--dark" onClick={onClose}>
              {t('cart.browse')}
            </Link>
          </div>
        ) : (
          <>
            <div className="drawer__body">
              <CartLines editable />
              <div className="drawer__clear">
                {confirmClear ? (
                  <div className="drawer__confirm" role="group" aria-label={t('cart.clearConfirm')}>
                    <span>{t('cart.clearConfirm')}</span>
                    <button type="button" className="drawer__confirm-yes" onClick={cart.clear}>
                      {t('cart.clearYes')}
                    </button>
                    <button type="button" onClick={() => setConfirmClear(false)}>
                      {t('cart.clearNo')}
                    </button>
                  </div>
                ) : (
                  <button type="button" className="drawer__clear-btn" onClick={() => setConfirmClear(true)}>
                    <Icon name="trash" size={16} /> {t('cart.clear')}
                  </button>
                )}
              </div>
            </div>
            <footer className="drawer__foot">
              <CartTotals />
              <Link to="/checkout" className="btn btn--primary btn--lg btn--block" onClick={onClose}>
                {t('cart.checkout')} <Icon name="arrow" size={18} className="icon--flip" />
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
