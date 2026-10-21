import { useCart } from '../context/CartContext.jsx'
import { findItem } from '../data/menu.js'
import { formatPrice } from '../lib/format.js'
import { describeLine, lineTotal } from '../lib/pricing.js'

export function OrderSummary({ lines, subtotal, deliveryFee, feePending, total, editable = false }) {
  const { openCart } = useCart()
  return (
    <div className="summary">
      <ul className="summary__lines">
        {lines.map((line, i) => {
          const item = findItem(line.itemId)
          const { options, removed } = describeLine(line)
          return (
            <li key={line.key ?? i} className="summary__line">
              <span className="summary__qty">{line.qty}×</span>
              <span className="summary__name">
                {item?.name}
                {(options.length > 0 || removed.length > 0) && (
                  <span className="summary__meta">{[...options, ...removed].join(' · ')}</span>
                )}
              </span>
              <span className="summary__price">{formatPrice(lineTotal(line))}</span>
            </li>
          )
        })}
      </ul>
      {editable && (
        <button type="button" className="link-btn summary__edit" onClick={openCart}>
          Edit order
        </button>
      )}
      <dl className="totals">
        <div>
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        {(deliveryFee > 0 || feePending) && (
          <div className="totals__muted">
            <dt>Delivery</dt>
            <dd>{feePending ? 'Confirmed on WhatsApp' : formatPrice(deliveryFee)}</dd>
          </div>
        )}
        <div className="totals__total">
          <dt>Total{feePending ? ' before delivery' : ''}</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
    </div>
  )
}
