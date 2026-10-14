import { useRef, type MouseEvent } from 'react'
import type { MenuItem } from '../data/types'
import { isOrderable } from '../data/menu'
import { useLang, fmt } from '../i18n/LanguageProvider'
import { useCart } from '../store/cart'
import { useUI } from '../store/ui'
import { money } from '../utils/format'
import { flyToCart } from '../utils/flyToCart'
import { FoodImage, imageUrl } from './FoodImage'
import { TiltCard } from './TiltCard'
import { Icon } from './Icon'
import './MenuCard.css'

const needsChoices = (item: MenuItem) => (item.options ?? []).some((g) => g.required)

export function MenuCard({ item, variant = 'grid' }: { item: MenuItem; variant?: 'grid' | 'feature' }) {
  const { t, l } = useLang()
  const { add } = useCart()
  const { openItem } = useUI()
  const imgRef = useRef<HTMLDivElement>(null)
  const orderable = isOrderable(item)
  const desc = l(item.description)

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

  return (
    <TiltCard className={`menu-card menu-card--${variant}`} max={variant === 'feature' ? 7 : 6}>
      <article className="menu-card__body">
        <button type="button" className="menu-card__hit" onClick={() => openItem(item.id)} aria-label={`${item.name} — ${orderable ? money(item.price) : t.menu.ask}`} />
        <div className="menu-card__media" ref={imgRef}>
          <FoodImage image={item.image} alt={item.name} sizes={variant === 'feature' ? '(max-width: 600px) 80vw, 420px' : '(max-width: 600px) 46vw, 300px'} />
          {item.compareAt && (
            <span className="menu-card__save">{fmt(t.menu.save, { v: money(item.compareAt - item.price) })}</span>
          )}
        </div>
        <div className="menu-card__text">
          <h3 className="menu-card__name">{item.name}</h3>
          {desc && <p className="menu-card__desc">{desc}</p>}
          <div className="menu-card__foot">
            <p className="menu-card__price">
              {orderable ? <span className="price">{money(item.price)}</span> : <span className="menu-card__ask">{t.menu.ask}</span>}
              {item.compareAt && (
                <s className="menu-card__was">
                  <span className="sr-only">{t.menu.from} </span>
                  {money(item.compareAt)}
                </s>
              )}
            </p>
            <button type="button" className="menu-card__add" onClick={quickAdd} aria-label={`${t.menu.add} ${item.name}`}>
              <Icon name="plus" />
              <span>{t.menu.add}</span>
            </button>
          </div>
        </div>
      </article>
    </TiltCard>
  )
}
