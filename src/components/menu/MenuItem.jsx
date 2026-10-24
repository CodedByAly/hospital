import Highlight from './Highlight'
import { formatPrice } from '../../data/menu'

const sizeNames = { S: 'Small', M: 'Medium', L: 'Large' }

export default function MenuItem({ item, sizes, query }) {
  const labelled = item.prices && sizes && sizes.length === item.prices.length

  return (
    <li className="item">
      <span className="item__name">
        <Highlight text={item.name} query={query} />
      </span>
      <span className="item__leader" aria-hidden="true" />
      {item.prices ? (
        <span className={`item__price item__price--multi${labelled ? '' : ' item__price--plain'}`}>
          {item.prices.map((p, i) => (
            <span key={i}>
              {labelled && (
                <abbr className="item__size" title={sizeNames[sizes[i]] || sizes[i]}>
                  {sizes[i]}
                </abbr>
              )}
              {formatPrice(p)}
            </span>
          ))}
        </span>
      ) : (
        <span className="item__price">{formatPrice(item.price)}</span>
      )}
      {item.note && <span className="item__note">{item.note}</span>}
    </li>
  )
}
