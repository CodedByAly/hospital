import { menuItems } from '../data/menu.js'
import { useShop } from '../context/ShopContext.jsx'
import FoodImage from '../components/FoodImage.jsx'
import Icon from '../components/Icon.jsx'
import { formatPrice } from '../lib/format.js'
import { useReveal } from '../hooks/useReveal.js'

const featured = menuItems.filter((i) => i.featured)

export default function Signatures() {
  const { openItem } = useShop()
  const ref = useReveal()
  return (
    <section className="signatures section" aria-labelledby="sig-title">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">From the kitchen</p>
          <h2 id="sig-title" className="section-title">House signatures</h2>
        </div>
      </div>
      <ul ref={ref} className="sig-rail reveal" aria-label="Signature items">
        {featured.map((item) => (
          <li key={item.id} className="sig-card">
            <button type="button" className="sig-card__btn" onClick={() => openItem(item.id)} aria-label={`${item.name}, ${formatPrice(item.price)}. View details`}>
              <FoodImage item={item} className="food-img--card" />
              <span className="sig-card__body">
                <span className="sig-card__name">{item.name}</span>
                <span className="sig-card__desc">{item.description}</span>
                <span className="sig-card__foot">
                  <span className="sig-card__price">{formatPrice(item.price)}</span>
                  <span className="sig-card__add" aria-hidden="true"><Icon name="plus" size={18} strokeWidth={2.2} /></span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
