import { money } from '../utils/format'
import { restaurant } from '../config/restaurant'

// Subtotal / delivery / total block shared by the cart, checkout and confirmation.
export default function OrderSummary({ subtotal, orderType }) {
  const fee = restaurant.ordering.deliveryFee
  const isDelivery = orderType !== 'pickup'
  const feeKnown = typeof fee === 'number'
  const total = subtotal + (isDelivery && feeKnown ? fee : 0)

  return (
    <dl className="summary">
      <div className="summary__row">
        <dt>Subtotal</dt>
        <dd>{money(subtotal)}</dd>
      </div>
      {isDelivery && (
        <div className="summary__row">
          <dt>Delivery</dt>
          <dd className={feeKnown ? '' : 'summary__muted'}>{feeKnown ? (fee === 0 ? 'Free' : money(fee)) : 'Confirmed on call'}</dd>
        </div>
      )}
      <div className="summary__row summary__row--total">
        <dt>Total{isDelivery && !feeKnown ? <small> before delivery</small> : null}</dt>
        <dd>{money(total)}</dd>
      </div>
    </dl>
  )
}

export function orderTotal(subtotal, orderType) {
  const fee = restaurant.ordering.deliveryFee
  return subtotal + (orderType !== 'pickup' && typeof fee === 'number' ? fee : 0)
}
