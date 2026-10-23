import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import { t } from '../content/text'
import { describeSelection, formatPrice } from '../lib/price'
import FoodImage from './FoodImage'
import QtyStepper from './QtyStepper'
import Icon from './Icon'

const LEAVE_MS = 240

export default function CartLines({ editable = false }) {
  const cart = useCart()
  const { openItem } = useUI()
  const [leaving, setLeaving] = useState([])

  const removeLine = (key) => {
    setLeaving((l) => [...l, key])
    setTimeout(() => {
      cart.remove(key)
      setLeaving((l) => l.filter((k) => k !== key))
    }, LEAVE_MS)
  }

  return (
    <ul className="cart-lines">
      {cart.lines.map((line) => {
        const { chosen, removed } = describeSelection(line.item, line.selection)
        const name = line.item.name
        return (
          <li key={line.key} className={`cart-line ${leaving.includes(line.key) ? 'is-leaving' : ''}`}>
            <div className="cart-line__inner">
              <FoodImage item={line.item} className="cart-line__img" />
              <div className="cart-line__info">
                <div className="cart-line__top">
                  <h3 className="cart-line__name">{name}</h3>
                  <span className="cart-line__price num">{formatPrice(line.totalCents)}</span>
                </div>
                {chosen.length > 0 && <p className="cart-line__opts">{chosen.join(' · ')}</p>}
                {removed.length > 0 && (
                  <p className="cart-line__removed">
                    {t('cart.without')} {removed.join(', ').toLowerCase()}
                  </p>
                )}
                {line.qty > 1 && (
                  <p className="cart-line__unit num">
                    {line.qty} × {formatPrice(line.unitCents)}
                  </p>
                )}
                {editable ? (
                  <div className="cart-line__actions">
                    <QtyStepper
                      size="sm"
                      min={0}
                      value={line.qty}
                      label={`${t('item.quantity')}: ${name}`}
                      onChange={(qty) => (qty <= 0 ? removeLine(line.key) : cart.setQty(line.key, qty))}
                    />
                    {line.item.groups?.length > 0 && (
                      <button type="button" className="cart-line__link" onClick={() => openItem(line.item.id, line.key)}>
                        <Icon name="edit" size={15} /> {t('cart.edit')}
                      </button>
                    )}
                    <button
                      type="button"
                      className="cart-line__link cart-line__link--remove"
                      onClick={() => removeLine(line.key)}
                      aria-label={t('cart.removeItem', { name })}
                    >
                      {t('cart.remove')}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export function CartTotals() {
  const cart = useCart()
  return (
    <dl className="cart-totals">
      <div>
        <dt>{t('cart.subtotal')}</dt>
        <dd className="num">{formatPrice(cart.subtotalCents)}</dd>
      </div>
      <div>
        <dt>{t('cart.delivery')}</dt>
        <dd>{cart.deliveryCents == null ? t('cart.deliveryTbc') : <span className="num">{formatPrice(cart.deliveryCents)}</span>}</dd>
      </div>
      <div className="cart-totals__total">
        <dt>{t('cart.total')}</dt>
        <dd>
          <span className="num">{formatPrice(cart.totalCents)}</span>
          {cart.deliveryCents == null && <small> {t('cart.plusDelivery')}</small>}
        </dd>
      </div>
    </dl>
  )
}
