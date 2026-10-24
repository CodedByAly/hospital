import Highlight from './Highlight'
import { formatPrice } from '../../data/menu'

// The green "Special item" band from the printed menu.
export default function Specials({ category, query }) {
  return (
    <section className="specials" id={`menu-${category.id}`} aria-labelledby="specials-title" data-cat={category.id}>
      <h3 id="specials-title" className="specials__title display">
        {category.title}
      </h3>
      <ul className="specials__list">
        {category.items.map((item) => (
          <li key={item.name} className="specials__item">
            <span className="specials__name">
              <Highlight text={item.name} query={query} />
            </span>
            <span className="specials__price">
              {item.prices ? item.prices.map(formatPrice).join(' / ') : formatPrice(item.price)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
