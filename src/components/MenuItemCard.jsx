import { useRef } from 'react'
import FoodImage from './FoodImage'
import Icon from './Icon'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import { money, itemTitle } from '../utils/format'
import { flyToCart } from '../utils/flyToCart'

export default function MenuItemCard({ item, hideDescription = false }) {
  const { add, lines } = useCart()
  const { openItem, notify } = useUI()
  const imgRef = useRef(null)
  const btnRef = useRef(null)
  const inCart = lines.filter((l) => l.itemId === item.id).reduce((n, l) => n + l.qty, 0)
  const needsChoice = item.options?.length > 0

  function quickAdd() {
    if (needsChoice) {
      openItem(item.id)
      return
    }
    add({ itemId: item.id })
    notify(`${itemTitle(item)} added to your order`)
    flyToCart(imgRef.current || btnRef.current)
  }

  return (
    <article className={`dish ${item.image ? 'dish--photo' : ''}`}>
      <div className="dish__text">
        <h4 className="dish__name">
          <button type="button" className="dish__open" onClick={() => openItem(item.id)}>
            {item.name}
          </button>
          {item.detail && <span className="dish__detail">{item.detail}</span>}
        </h4>
        {item.description && !hideDescription && <p className="dish__desc">{item.description}</p>}
        <div className="dish__meta">
          <span className="dish__price">{money(item.price)}</span>
          {inCart > 0 && <span className="dish__incart">{inCart} in order</span>}
        </div>
      </div>

      {item.image && (
        <div className="dish__media">
          <FoodImage ref={imgRef} name={item.image} alt={item.imageAlt} sizes="(min-width: 900px) 240px, 40vw" />
        </div>
      )}

      <button
        ref={btnRef}
        type="button"
        className="dish__add"
        onClick={quickAdd}
        aria-label={needsChoice ? `Choose options for ${itemTitle(item)}` : `Add ${itemTitle(item)} to order`}
      >
        <Icon name="plus" size={18} strokeWidth={2.2} />
      </button>
    </article>
  )
}
