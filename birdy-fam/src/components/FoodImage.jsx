import { categoryById } from '../data/menu.js'

/**
 * Item photo, or a typographic placeholder in the style of the printed menu when
 * no photo has been supplied yet. Photos keep their aspect via object-fit: cover.
 */
export default function FoodImage({ item, className = '', sizes, eager = false, id }) {
  if (item.image) {
    return (
      <div className={`food-img ${className}`} id={id}>
        <img src={item.image} alt={item.name} loading={eager ? 'eager' : 'lazy'} decoding="async" sizes={sizes} />
      </div>
    )
  }
  return (
    <div className={`food-img food-img--placeholder ${className}`} id={id} role="img" aria-label={`${item.name}, photo coming soon`}>
      <span className="food-img__cat">{categoryById[item.category]?.name}</span>
      <span className="food-img__name">{item.name}</span>
    </div>
  )
}
