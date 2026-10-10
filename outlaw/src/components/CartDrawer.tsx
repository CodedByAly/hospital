import { AnimatePresence, motion } from 'framer-motion'
import { Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { restaurant } from '../config/restaurant'
import { useCart } from '../context/CartContext'
import { useScrollLock } from '../hooks/useScrollLock'
import { formatPrice } from '../lib/format'
import DishImage from './DishImage'
import Qty from './Qty'
import './CartDrawer.css'

export default function CartDrawer() {
  const { lines, subtotal, count, drawerOpen, setDrawerOpen, setQty, remove, clear } = useCart()
  const [confirmClear, setConfirmClear] = useState(false)
  const navigate = useNavigate()
  useScrollLock(drawerOpen)
  const close = () => {
    setDrawerOpen(false)
    setConfirmClear(false)
  }

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawerOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen, setDrawerOpen])

  return (
    <AnimatePresence>
      {drawerOpen && (
        <motion.div className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" className="drawer__scrim" aria-label="Close your order" tabIndex={-1} onClick={close} />
          <motion.aside
            className="drawer__panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 34 }}
          >
            <header className="drawer__head">
              <div>
                <p className="mark">{count} {count === 1 ? 'item' : 'items'}</p>
                <h2 id="drawer-title">Your order</h2>
              </div>
              <button type="button" className="icon-btn" onClick={close} aria-label="Close" autoFocus>
                <X size={20} aria-hidden="true" />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="drawer__empty">
                <p>Nothing here yet.</p>
                <p className="muted">Pick a few rolls and they'll wait for you here.</p>
                <Link to="/menu" className="btn btn--ember" onClick={close}>Open the menu</Link>
              </div>
            ) : (
              <>
                <ul className="drawer__lines">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li key={l.key} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30, height: 0 }}>
                        <DishImage item={l.item} className="drawer__thumb" />
                        <div className="drawer__info">
                          <p className="drawer__name">{l.item.name}</p>
                          {l.size && <p className="drawer__meta">{l.size.label}</p>}
                          {l.notes && <p className="drawer__meta">“{l.notes}”</p>}
                          <div className="drawer__row">
                            <Qty value={l.qty} min={0} onChange={(n) => setQty(l.key, n)} label={l.item.name} />
                            <span className="price">{formatPrice(l.lineTotal)}</span>
                          </div>
                        </div>
                        <button type="button" className="icon-btn drawer__remove" onClick={() => remove(l.key)} aria-label={`Remove ${l.item.name}`}>
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <footer className="drawer__foot">
                  <div className="drawer__total">
                    <span>Subtotal</span>
                    <span className="price">{formatPrice(subtotal)}</span>
                  </div>
                  {restaurant.ordering.delivery && <p className="drawer__note">Delivery fee, if any, is confirmed on WhatsApp.</p>}
                  <button type="button" className="btn btn--ember btn--lg btn--block" onClick={() => { close(); navigate('/checkout') }}>
                    Checkout
                  </button>
                  {confirmClear ? (
                    <div className="drawer__confirm">
                      <span>Clear every item?</span>
                      <button type="button" className="link-arrow" onClick={() => { clear(); setConfirmClear(false) }}>Yes, clear</button>
                      <button type="button" className="link-arrow" onClick={() => setConfirmClear(false)}>Keep</button>
                    </div>
                  ) : (
                    <button type="button" className="drawer__clear" onClick={() => setConfirmClear(true)}>Clear order</button>
                  )}
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
