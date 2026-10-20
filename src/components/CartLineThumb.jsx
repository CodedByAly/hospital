import { menuById } from '../data/menu'

// Small square for cart rows: the dish cut-out, or the item's initials
// on brand colours when there is no photo.
export default function CartLineThumb({ itemId }) {
  const item = menuById[itemId]
  if (!item) return null
  if (item.image) {
    return (
      <span className="thumb">
        <img src={`/images/menu/${item.image}-480.webp`} alt="" loading="lazy" decoding="async" />
      </span>
    )
  }
  const initials = item.name.replace(/&/g, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('')
  return (
    <span className="thumb thumb--text" aria-hidden="true">
      {initials}
    </span>
  )
}
