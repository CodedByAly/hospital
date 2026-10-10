import { asset } from '../lib/asset'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getItem, imageUrl } from '../data/menu'
import { formatPrice } from '../lib/format'
import { useCart } from '../context/CartContext'
import { useItemDialog } from '../context/ItemContext'
import { useLanguage } from '../context/LanguageContext'
import Dialog from './Dialog'
import FoodImage from './FoodImage'
import Icon from './Icon'
import LineDetails from './LineDetails'
import QtyStepper from './QtyStepper'
import './CartDrawer.css'

export default function CartDrawer() {
  const cart = useCart()
  const { t, pick, lang } = useLanguage()
  const navigate = useNavigate()
  const [confirmClear, setConfirmClear] = useState(false)

  const close = () => {
    setConfirmClear(false)
    cart.close()
  }

  return (
    <Dialog open={cart.isOpen} onClose={close} label={t('cart.title')} variant="drawer" className="cart-drawer">
      <header className="cart-drawer__head">
        <h2>{t('cart.title')}</h2>
        {cart.count > 0 && <span className="muted">{cart.count === 1 ? t('cart.item') : t('cart.items', { count: cart.count })}</span>}
      </header>

      {cart.lines.length === 0 ? (
        <div className="cart-drawer__empty">
          <img src={asset('img/float/streets-smoothie.webp')} alt="" width="90" height="142" loading="lazy" />
          <h3>{t('cart.empty')}</h3>
          <p className="muted">{t('cart.emptyHint')}</p>
          <button type="button" className="btn btn--primary" onClick={() => { close(); navigate('/menu') }}>
            {t('cart.browse')}
          </button>
        </div>
      ) : (
        <ul className="cart-drawer__lines">
          {cart.lines.map((line) => (
            <CartLine key={line.key} line={line} onEdit={close} />
          ))}
        </ul>
      )}

      {cart.lastRemoved && (
        <div className="cart-drawer__undo" role="status">
          <span>{t('cart.removed', { name: pick(getItem(cart.lastRemoved.line.itemId)?.name) })}</span>
          <button type="button" className="link" onClick={cart.undoRemove}>{t('cart.undo')}</button>
        </div>
      )}

      {cart.lines.length > 0 && (
        <footer className="cart-drawer__foot">
          <dl className="totals">
            <div><dt>{t('cart.subtotal')}</dt><dd>{formatPrice(cart.subtotal, lang)}</dd></div>
            <div className="totals__muted">
              <dt>{t('cart.deliveryIf')}</dt>
              <dd>{cart.deliveryFee == null ? t('cart.deliveryLater') : formatPrice(cart.deliveryFee, lang)}</dd>
            </div>
            <div className="totals__grand"><dt>{t('cart.total')}</dt><dd>{formatPrice(cart.subtotal, lang)}</dd></div>
          </dl>
          <button type="button" className="btn btn--primary btn--block btn--lg" onClick={() => { close(); navigate('/checkout') }}>
            {t('cart.checkout')}
            <Icon name="arrow" className="flip-rtl" />
          </button>
          {confirmClear ? (
            <div className="cart-drawer__confirm" role="group" aria-label={t('cart.clearConfirm')}>
              <span>{t('cart.clearConfirm')}</span>
              <button type="button" className="link link--danger" onClick={() => { cart.clear(); setConfirmClear(false) }}>{t('cart.yes')}</button>
              <button type="button" className="link" onClick={() => setConfirmClear(false)}>{t('cart.no')}</button>
            </div>
          ) : (
            <button type="button" className="cart-drawer__clear link" onClick={() => setConfirmClear(true)}>{t('cart.clear')}</button>
          )}
        </footer>
      )}
    </Dialog>
  )
}

function CartLine({ line, onEdit }) {
  const cart = useCart()
  const { openItem } = useItemDialog()
  const { t, pick, lang } = useLanguage()
  const [leaving, setLeaving] = useState(false)
  const name = pick(line.item.name)

  const remove = () => {
    setLeaving(true)
    setTimeout(() => cart.remove(line.key), 200)
  }

  return (
    <li className="cart-line" data-leaving={leaving || undefined}>
      <FoodImage src={imageUrl(line.item.image)} alt={name} className="cart-line__img" />
      <div className="cart-line__body">
        <div className="cart-line__top">
          <h3 className="cart-line__name">{name}</h3>
          <span className="cart-line__total">{formatPrice(line.lineTotal, lang)}</span>
        </div>
        <LineDetails line={line} />
        {line.qty > 1 && <p className="cart-line__each muted">{formatPrice(line.unitPrice, lang)} {t('common.each')}</p>}
        <div className="cart-line__actions">
          <QtyStepper
            size="sm"
            min={0}
            value={line.qty}
            onChange={(q) => (q <= 0 ? remove() : cart.setQty(line.key, q))}
            label={`${t('common.quantity')}: ${name}`}
          />
          <button type="button" className="icon-btn" onClick={() => { onEdit(); openItem(line.item.id, line.key) }} aria-label={`${t('common.edit')}: ${name}`}>
            <Icon name="edit" size={18} />
          </button>
          <button type="button" className="icon-btn" onClick={remove} aria-label={`${t('common.remove')}: ${name}`}>
            <Icon name="trash" size={18} />
          </button>
        </div>
      </div>
    </li>
  )
}
