import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useLang, fmt } from '../i18n/LanguageProvider'
import { useCart, describeLine, lineTotal } from '../store/cart'
import { useUI } from '../store/ui'
import { useDialog } from '../hooks/useDialog'
import { findItem } from '../data/menu'
import { restaurant } from '../config/restaurant'
import { money, lbp, num } from '../utils/format'
import { FoodImage } from './FoodImage'
import { QtyStepper } from './QtyStepper'
import { Icon } from './Icon'
import './CartDrawer.css'

export function CartDrawer() {
  const { isOpen, close } = useCart()
  return <AnimatePresence>{isOpen && <Drawer onClose={close} />}</AnimatePresence>
}

function Drawer({ onClose }: { onClose: () => void }) {
  const { t, lang, dir } = useLang()
  const { lines, subtotal, count, setQty, remove, clear } = useCart()
  const { openItem } = useUI()
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const ref = useDialog<HTMLDivElement>(true, onClose)
  const [confirmClear, setConfirmClear] = useState(false)
  const offscreen = dir === 'rtl' ? '-100%' : '100%'
  const approx = lbp(subtotal)

  return (
    <div className="cart" role="presentation">
      <motion.div className="cart__scrim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.aside
        ref={ref}
        className="cart__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        initial={reduce ? { opacity: 0 } : { x: offscreen }}
        animate={reduce ? { opacity: 1 } : { x: 0 }}
        exit={reduce ? { opacity: 0 } : { x: offscreen }}
        transition={{ type: 'spring', damping: 34, stiffness: 340 }}
      >
        <header className="cart__head">
          <div>
            <h2 id="cart-title">{t.cart.title}</h2>
            {count > 0 && <p>{fmt(t.cart.itemsCount, { n: num(count, lang) })}</p>}
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t.cart.close}>
            <Icon name="close" />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="cart__empty">
            <div className="cart__empty-art" aria-hidden="true">
              <Icon name="bag" />
            </div>
            <h3>{t.cart.empty}</h3>
            <p>{t.cart.emptyHint}</p>
            <Link to="/menu" className="btn btn--yellow" onClick={onClose}>
              {t.cart.browse}
            </Link>
          </div>
        ) : (
          <>
            <ul className="cart__lines">
              <AnimatePresence initial={false}>
                {lines.map((line) => {
                  const item = findItem(line.itemId)
                  if (!item) return null
                  const opts = describeLine(line, lang)
                  const removedLabels = line.removed.map((en) => item.removable?.find((r) => r.en === en)?.[lang] ?? en)
                  return (
                    <motion.li
                      key={line.key}
                      layout={!reduce}
                      initial={reduce ? false : { opacity: 0, x: dir === 'rtl' ? -40 : 40, rotateY: dir === 'rtl' ? 25 : -25 }}
                      animate={{ opacity: 1, x: 0, rotateY: 0 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir === 'rtl' ? 60 : -60, height: 0, marginBottom: 0, paddingBlock: 0 }}
                      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                      className="cart-line"
                    >
                      <FoodImage image={item.image} alt="" className="cart-line__img" sizes="80px" />
                      <div className="cart-line__info">
                        <div className="cart-line__top">
                          <h3>{item.name}</h3>
                          <span className="price">{money(lineTotal(line))}</span>
                        </div>
                        {opts.map((o) => (
                          <p key={o} className="cart-line__meta">{o}</p>
                        ))}
                        {removedLabels.length > 0 && (
                          <p className="cart-line__meta cart-line__meta--removed">
                            {t.cart.without}: {removedLabels.join(lang === 'ar' ? '، ' : ', ')}
                          </p>
                        )}
                        {line.notes && <p className="cart-line__meta cart-line__meta--note">“{line.notes}”</p>}
                        <div className="cart-line__actions">
                          <QtyStepper small value={line.qty} min={0} onChange={(v) => setQty(line.key, v)} label={item.name} />
                          <button type="button" className="cart-line__link" onClick={() => openItem(item.id, line)}>
                            <Icon name="edit" /> {t.cart.edit}
                          </button>
                          <button type="button" className="cart-line__link cart-line__link--danger" onClick={() => remove(line.key)}>
                            <Icon name="trash" /> <span className="sr-only">{t.cart.removeItem} {item.name}</span>
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  )
                })}
              </AnimatePresence>
            </ul>

            <footer className="cart__foot">
              <dl className="totals">
                <div>
                  <dt>{t.cart.subtotal}</dt>
                  <dd className="price">{money(subtotal)}</dd>
                </div>
                {restaurant.ordering.delivery && (
                  <div className="totals__muted">
                    <dt>{t.cart.delivery}</dt>
                    <dd>{restaurant.ordering.deliveryFee != null ? money(restaurant.ordering.deliveryFee) : t.cart.deliveryTbd}</dd>
                  </div>
                )}
                <div className="totals__grand">
                  <dt>{t.cart.total}</dt>
                  <dd className="price">{money(subtotal)}</dd>
                </div>
                {approx && (
                  <p className="totals__lbp">{fmt(t.cart.approxLbp, { v: approx, r: num(restaurant.payments.lbpRate!, lang) })}</p>
                )}
              </dl>
              <button
                type="button"
                className="btn btn--yellow btn--block cart__checkout"
                onClick={() => {
                  onClose()
                  navigate('/checkout')
                }}
              >
                {t.cart.checkout}
                <Icon name="arrow" className="flip-rtl" />
              </button>
              {confirmClear ? (
                <div className="cart__confirm" role="alert">
                  <span>{t.cart.clearConfirm}</span>
                  <button type="button" className="btn btn--sm btn--red" onClick={() => { clear(); setConfirmClear(false) }}>
                    {t.cart.yes}
                  </button>
                  <button type="button" className="btn btn--sm btn--ghost" onClick={() => setConfirmClear(false)}>
                    {t.cart.no}
                  </button>
                </div>
              ) : (
                <button type="button" className="cart__clear" onClick={() => setConfirmClear(true)}>
                  {t.cart.clear}
                </button>
              )}
            </footer>
          </>
        )}
      </motion.aside>
    </div>
  )
}
