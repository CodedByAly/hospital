import FoodImage from '../components/FoodImage'
import Icon from '../components/Icon'
import { featuredIds, menuById, categoryById } from '../data/menu'
import { money } from '../utils/format'
import { useUI } from '../context/UIContext'

// Straight from the posters: the dishes Chippy has photographed.
export default function Lineup() {
  const { openItem } = useUI()
  const items = featuredIds.map((id) => menuById[id]).filter(Boolean)

  return (
    <section className="lineup section section--tight" aria-labelledby="lineup-title">
      <div className="container">
        <header className="section-head section-head--row" data-reveal>
          <div>
            <p className="eyebrow">Out of the fryer</p>
            <h2 id="lineup-title" className="display">The Line-up</h2>
          </div>
          <a href="#menu" className="link-arrow">
            Full menu <Icon name="arrowRight" size={16} />
          </a>
        </header>
      </div>
      <div className="lineup__track container" data-reveal>
        {items.map((item, i) => (
          <button key={item.id} type="button" className={`lineup__card lineup__card--${i % 3}`} onClick={() => openItem(item.id)}>
            <span className="lineup__media">
              <FoodImage name={item.image} alt={item.imageAlt} sizes="(min-width: 900px) 300px, 70vw" />
            </span>
            <span className="lineup__info">
              <span className="lineup__cat">{categoryById[item.category]?.name}</span>
              <span className="lineup__name">{item.fullName || item.name}</span>
              <span className="lineup__row">
                <span className="lineup__price">{money(item.price)}</span>
                <span className="lineup__cta" aria-hidden="true"><Icon name="plus" size={16} strokeWidth={2.2} /></span>
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
