import { restaurant } from '../config/restaurant'
import { formatPrice, formatTotals } from '../lib/format'

/**
 * Subtotal / delivery / total. Totals stay per currency (LBP and USD) because
 * the menu is priced in both and no exchange rate was provided.
 */
export default function CartTotals({ totals, type }) {
  const fee = restaurant.ordering.deliveryFee
  const showDelivery = type === 'delivery'
  const grand = showDelivery && fee ? mergeFee(totals, fee) : totals

  return (
    <dl className="totals">
      <div className="totals__row">
        <dt>المجموع الفرعي</dt>
        <dd>{formatTotals(totals)}</dd>
      </div>
      {showDelivery && (
        <div className="totals__row">
          <dt>التوصيل</dt>
          <dd>{fee ? formatPrice({ amount: fee, currency: 'LBP' }) : <span className="muted">يُحدَّد عند التأكيد</span>}</dd>
        </div>
      )}
      <div className="totals__row totals__row--grand">
        <dt>المجموع</dt>
        <dd>{formatTotals(grand)}</dd>
      </div>
      {totals.length > 1 && <p className="totals__note">بعض الأصناف مسعّرة بالليرة وبعضها بالدولار متل المنيو، فكل عملة محسوبة لحالها.</p>}
    </dl>
  )
}

function mergeFee(totals, fee) {
  const lbp = totals.find((t) => t.currency === 'LBP')
  if (lbp) return totals.map((t) => (t.currency === 'LBP' ? { ...t, amount: t.amount + fee } : t))
  return [{ amount: fee, currency: 'LBP' }, ...totals]
}
