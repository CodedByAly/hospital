import { useRef } from 'react'
import { buildLine, useCart } from '../context/CartContext'
import { useItemSheet } from '../context/ItemSheetContext'
import { useLang } from '../i18n/LanguageContext'
import { flyToCart } from '../lib/flyToCart'
import { formatPrice } from '../lib/format'
import FoodImage from './FoodImage'
import { PlusIcon } from './Icons'

const needsChoice = (item) => item.options?.some((g) => g.required)

/**
 * Quick add straight from a card. Items with required choices (e.g. which
 * soft drink) open the detail sheet instead.
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

/** Menu item card: photo on top, name, size and price underneath. */
export default function MenuCard({ item, eager = false, size = 'md' }) {
  const { t, pick, lang } = useLang()
  const { openItem } = useItemSheet()
  const mediaRef = useRef(null)
  const quickAdd = useQuickAdd(item, mediaRef)
  const name = pick(item.name)

  return (
    <article className={`menu-card menu-card--${size}`}>
      <button type="button" className="menu-card__open" onClick={() => openItem(item.id)} aria-label={t('item.details', { name })}>
        <FoodImage ref={mediaRef} item={item} className="menu-card__media" eager={eager} />
      </button>
      <div className="menu-card__body">
        <h3 className="menu-card__name">
          <button type="button" onClick={() => openItem(item.id)}>
            {name}
          </button>
        </h3>
        {item.note && <p className="menu-card__note">{pick(item.note)}</p>}
        {item.contents && <p className="menu-card__contents">{item.contents.map(pick).join(' · ')}</p>}
        <div className="menu-card__foot">
          <span className="menu-card__price">{formatPrice(item.price, lang)}</span>
          <button type="button" className="add-btn" onClick={quickAdd} aria-label={t('item.addNamed', { name })}>
            <PlusIcon size={18} />
          </button>
        </div>
      </div>
    </article>
  )
}
