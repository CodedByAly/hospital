import MenuItem from './MenuItem'
import { formatPrice } from '../../data/menu'

export default function MenuCategory({ category, query }) {
  const { id, title, sizes, note, items, addons } = category
  const sized = sizes && items.some((i) => i.prices)

  return (
    <section className="cat" id={`menu-${id}`} aria-labelledby={`menu-${id}-title`} data-cat={id}>
      <header className="cat__head">
        <h4 id={`menu-${id}-title`} className="cat__title display">
          {title}
        </h4>
        <span className="cat__dash dash" aria-hidden="true" />
        {sized && <span className="cat__sizes">{sizes.join(' / ')}</span>}
      </header>

      {note && <p className="cat__note">{note}</p>}

      <ul className={`cat__items${items.length > 4 ? ' cat__items--cols' : ''}`}>
        {items.map((item) => (
          <MenuItem key={item.name} item={item} sizes={sizes} query={query} />
        ))}
      </ul>

      {addons && (
        <div className="addons">
          <p className="addons__title">{addons.title}</p>
          <ul className="addons__list">
            {addons.items.map((a) => (
              <li key={a.name}>
                {a.name} <span className="addons__price">+{formatPrice(a.price)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
