import { useRef } from 'react'
import { basePrice, cutoutUrl, imageUrl } from '../data/menu'
import { defaultConfig } from '../lib/cart'
import { formatPrice } from '../lib/format'
import { useCart } from '../context/CartContext'
import { useFly } from '../context/FlyContext'
import { useItemDialog } from '../context/ItemContext'
import { useLanguage } from '../context/LanguageContext'
import FoodImage from './FoodImage'
import Icon from './Icon'
import './MenuCard.css'

/** Items with nothing to choose can go straight into the cart from the card. */
const isQuickAdd = (item) => !item.sizes && !(item.options ?? []).some((g) => g.required)

export function itemSubtitle(item, pick) {
  if (item.description) return pick(item.description)
  const group = item.options?.[0]
  return group ? group.choices.map((c) => pick(c.label)).join(' · ') : ''
}

export default function MenuCard({ item, layout = 'row', headingLevel = 3 }) {
  const { t, pick, lang } = useLanguage()
  const { openItem } = useItemDialog()
  const cart = useCart()
  const { fly } = useFly()
  const imgRef = useRef(null)
  const Heading = `h${headingLevel}`
  const name = pick(item.name)
  const subtitle = itemSubtitle(item, pick)

  const quickAdd = () => {
    if (!isQuickAdd(item)) return openItem(item.id)
    const cut = cutoutUrl(item.image)
    fly({ from: imgRef.current, src: cut ?? imageUrl(item.image), cutout: Boolean(cut) })
    cart.add(item.id, defaultConfig(item), 1)
  }

  return (
    <article className={`menu-card menu-card--${layout}`}>
      <FoodImage
        src={imageUrl(item.image)}
        alt={name}
        ratio={layout === 'tile' ? '4 / 5' : '1 / 1'}
        imgRef={imgRef}
        className="menu-card__img"
      />
      <div className="menu-card__body">
        <Heading className="menu-card__name">
          <button type="button" className="menu-card__open" onClick={() => openItem(item.id)}>
            {name}
          </button>
        </Heading>
        {subtitle && <p className="menu-card__desc">{subtitle}</p>}
        <p className="menu-card__price">
          {item.sizes && <span className="muted">{t('common.from')} </span>}
          {formatPrice(basePrice(item), lang)}
        </p>
      </div>
      <button
        type="button"
        className="menu-card__add"
        onClick={quickAdd}
        aria-label={`${t('common.add')}: ${name}`}
      >
        <Icon name="plus" size={20} />
      </button>
    </article>
  )
}
