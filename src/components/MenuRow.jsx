import { useRef } from 'react'
import { useCart, buildLine } from '../context/CartContext'
import { useItemSheet } from '../context/ItemSheetContext'
import { flyToCart } from '../lib/flyToCart'
import { formatPrice } from '../lib/format'
import FoodImage from './FoodImage'
import { PlusIcon } from './Icons'

const needsChoice = (item) => item.options?.some((g) => g.required)

/**
 * Quick add straight from a list or card. Items with required choices
 * open the detail sheet instead.
 */
export function useQuickAdd(item, sourceRef) {
  const cart = useCart()
  const { openItem } = useItemSheet()
  return (event) => {
    if (needsChoice(item)) {
      openItem(item.id)
      return
    }
    cart.add(buildLine(item, { quantity: 1 }))
    // Fly the photo when it is on screen, otherwise the button itself.
    const media = sourceRef.current
    const source = media && media.getBoundingClientRect().width ? media : event?.currentTarget
    flyToCart(source).then(cart.bump)
  }
}

/** A menu-board line: name, contents, price and a quick add button. */
export function MenuRow({ item }) {
  const { openItem } = useItemSheet()
  const mediaRef = useRef(null)
  const quickAdd = useQuickAdd(item, mediaRef)

  return (
    <li className="menu-row">
      <button type="button" className="menu-row__main" onClick={() => openItem(item.id)}>
        <FoodImage ref={mediaRef} item={item} className="menu-row__media" />
        <span className="menu-row__text">
          <span className="menu-row__name">{item.name}</span>
          {item.contents && <span className="menu-row__contents">{item.contents.join(' · ')}</span>}
        </span>
        <span className="menu-row__leader" aria-hidden="true" />
        <span className="menu-row__price">{formatPrice(item.price)}</span>
      </button>
      <button type="button" className="add-btn" onClick={quickAdd} aria-label={`زيد ${item.name} عالسلة`}>
        <PlusIcon size={18} />
      </button>
    </li>
  )
}

/** Large photo card for featured items. */
export function FeatureCard({ item, eager = false }) {
  const { openItem } = useItemSheet()
  const mediaRef = useRef(null)
  const quickAdd = useQuickAdd(item, mediaRef)

  return (
    <article className="feature-card">
      <button type="button" className="feature-card__open" onClick={() => openItem(item.id)} aria-label={`تفاصيل ${item.name}`}>
        <FoodImage ref={mediaRef} item={item} className="feature-card__media" eager={eager} />
      </button>
      <div className="feature-card__body">
        <h3 className="feature-card__name">
          <button type="button" onClick={() => openItem(item.id)}>
            {item.name}
          </button>
        </h3>
        {item.contents && <p className="feature-card__contents">{item.contents.join(' · ')}</p>}
        <div className="feature-card__foot">
          <span className="price">{formatPrice(item.price)}</span>
          <button type="button" className="btn btn--small btn--dark" onClick={quickAdd}>
            <PlusIcon size={16} />
            زيد عالسلة
          </button>
        </div>
      </div>
    </article>
  )
}
