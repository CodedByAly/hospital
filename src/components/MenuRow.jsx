import { useRef } from 'react'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import { t } from '../content/text'
import { defaultSelection, formatPrice, listedVariants, missingRequired, toCents } from '../lib/price'
import { flyToCart } from '../lib/flyToCart'
import FoodImage from './FoodImage'
import Icon from './Icon'

export default function MenuRow({ item }) {
  const { openItem, canOrder } = useUI()
  const cart = useCart()
  const imgRef = useRef(null)
  const addRef = useRef(null)
  const name = item.name
  const variants = listedVariants(item)
  const inCart = cart.lines.filter((l) => l.itemId === item.id).reduce((n, l) => n + l.qty, 0)

  // Items with nothing to choose go straight into the cart; the rest open the detail panel.
  const quickAdd = () => {
    const selection = defaultSelection(item)
    if (missingRequired(item, selection).length || (item.groups ?? []).some((g) => g.type !== 'single')) {
      openItem(item.id)
      return
    }
    cart.add(item.id, selection, 1)
    flyToCart(imgRef.current ?? addRef.current, item.image)
  }

  return (
    <article className={`menu-row ${item.image ? 'has-img' : ''}`}>
      <button type="button" className="menu-row__open" onClick={() => openItem(item.id)}>
        <span className="visually-hidden">{name}</span>
      </button>

      <div className="menu-row__text">
        <h3 className="menu-row__title">
          <span className="menu-row__name">{name}</span>
          <span className="menu-row__leader" aria-hidden="true" />
          <span className="menu-row__price num">
            {formatPrice(toCents(item.price))}
          </span>
        </h3>
        {item.description && <p className="menu-row__desc">{item.description}</p>}
        {variants.length > 0 && (
          <p className="menu-row__variants">
            {variants.map((v, i) => (
              <span key={v.label}>
                {i > 0 && <span className="menu-row__sep" aria-hidden="true"> | </span>}
                <span className={/combo/i.test(v.label) ? 'is-combo' : ''}>{v.label}</span>{' '}
                <span className="num">{formatPrice(v.cents)}</span>
              </span>
            ))}
          </p>
        )}
      </div>

      {item.image && (
        <div className="menu-row__media">
          <FoodImage item={item} imgRef={imgRef} sizes="160px" />
        </div>
      )}

      {canOrder && (
        <button
          type="button"
          ref={addRef}
          className={`menu-row__add ${inCart ? 'has-count' : ''}`}
          onClick={quickAdd}
          aria-label={t('menu.addItem', { name })}
        >
          {inCart ? <span className="num">{inCart}</span> : <Icon name="plus" size={20} />}
        </button>
      )}
    </article>
  )
}
