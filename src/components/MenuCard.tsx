import { useRef, type MouseEvent } from 'react'
import type { MenuItem } from '../data/types'
import { isOrderable } from '../data/menu'
import { copy as t } from '../content/copy'
import { useCart } from '../store/cart'
import { useUI } from '../store/ui'
import { money } from '../utils/format'
import { flyToCart } from '../utils/flyToCart'
import { FoodImage, imageUrl } from './FoodImage'
import { TiltCard } from './TiltCard'
import { Icon } from './Icon'
import './MenuCard.css'

const needsChoices = (item: MenuItem) => (item.options ?? []).some((g) => g.required)

/**
 * row  — menu list item: text on the left, photo on the right (the default)
 * tile — photo on top, used for bundles
 */
export function MenuCard({ item, variant = 'row' }: { item: MenuItem; variant?: 'row' | 'tile' }) {
  const { add } = useCart()
  const { openItem } = useUI()
  const imgRef = useRef<HTMLDivElement>(null)
  const orderable = isOrderable(item)

  const quickAdd = (e: MouseEvent) => {
    e.stopPropagation()
    if (!orderable || needsChoices(item)) {
      openItem(item.id)
      return
    }
    const rect = imgRef.current?.getBoundingClientRect() ?? (e.currentTarget as HTMLElement).getBoundingClientRect()
    flyToCart(rect, item.image ? imageUrl(item.image, true) : undefined)
    add({ itemId: item.id, qty: 1, selections: {}, removed: [], notes: '' })
  }

  const price = (
    <p className="mc__price">
      {orderable ? <span>{money(item.price)}</span> : <span className="mc__ask">{t.menu.ask}</span>}
      {item.compareAt && (
        <s>
          <span className="sr-only">{t.menu.from} </span>
          {money(item.compareAt)}
        </s>
      )}
    </p>
  )

  const addButton = (
    <button type="button" className="mc__add" onClick={quickAdd} aria-label={`${t.menu.add} ${item.name}`}>
      <Icon name="plus" />
    </button>
  )

  const body = (
    <article className={`mc mc--${variant}`}>
      <button type="button" className="mc__hit" onClick={() => openItem(item.id)} aria-label={`${item.name}, ${orderable ? money(item.price) : t.menu.ask}`} />
      <div className="mc__media" ref={imgRef}>
        <FoodImage image={item.image} alt={item.name} sizes={variant === 'tile' ? '(max-width: 620px) 82vw, 380px' : '140px'} />
        {variant === 'row' && addButton}
        {variant === 'tile' && item.compareAt && <span className="mc__save">{t.menu.save.replace('{v}', money(item.compareAt - item.price))}</span>}
      </div>
      <div className="mc__text">
        <h3 className="mc__name">{item.name}</h3>
        {item.description && <p className="mc__desc">{item.description}</p>}
        {variant === 'tile' ? (
          <div className="mc__foot">
            {price}
            {addButton}
          </div>
        ) : (
          price
        )}
      </div>
    </article>
  )

  return variant === 'tile' ? (
    <TiltCard max={4} className="mc-tilt">
      {body}
    </TiltCard>
  ) : (
    body
  )
}
