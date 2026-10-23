import { restaurant } from '../config/restaurant'
import { formatPrice, formatTotals } from './format'
import { formatClock } from './hours'

/** Short, readable order number, e.g. "AM-1023-4821". */
export function createOrderNumber(date = new Date()) {
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `AM-${mm}${dd}-${rand}`
}

export const ORDER_TYPE_LABEL = { delivery: 'توصيل', pickup: 'استلام من المحل' }

export function paymentLabel(method, type) {
  if (method === 'whish') return 'Whish Money'
  return type === 'delivery' ? 'كاش عند التوصيل' : 'كاش عند الاستلام'
}

export function pickupTimeLabel(value) {
  if (!value || value === 'asap') return 'بأقرب وقت'
  const [h, m] = value.split(':').map(Number)
  return formatClock(h * 60 + m)
}

export function describeLine(line) {
  const parts = []
  if (line.options?.length) parts.push(line.options.map((o) => o.name).join('، '))
  if (line.addons?.length) parts.push(`إضافات: ${line.addons.map((a) => a.name).join('، ')}`)
  if (line.removed?.length) parts.push(`بدون: ${line.removed.join('، ')}`)
  if (line.note) parts.push(`ملاحظة: ${line.note}`)
  return parts
}

/** Plain-text order the restaurant receives on WhatsApp. */
export function orderToMessage(order) {
  const c = order.customer
  const rows = [
    `طلب جديد من الموقع — ${order.number}`,
    '',
    `النوع: ${ORDER_TYPE_LABEL[order.type]}`,
    `الاسم: ${c.name}`,
    `الهاتف: ${c.phone}`,
  ]
  if (order.type === 'delivery') {
    rows.push(`المنطقة: ${c.area}`, `العنوان: ${c.address}`)
    if (c.building) rows.push(`البناية / الطابق: ${c.building}`)
  } else {
    rows.push(`وقت الاستلام: ${pickupTimeLabel(c.pickupTime)}`)
  }
  rows.push('', 'الطلب:')
  for (const line of order.lines) {
    rows.push(`• ${line.quantity} × ${line.name} — ${formatPrice({ amount: line.unitPrice * line.quantity, currency: line.currency })}`)
    for (const detail of describeLine(line)) rows.push(`   ${detail}`)
  }
  rows.push('', `المجموع: ${formatTotals(order.totals)}`)
  if (order.type === 'delivery') {
    rows.push(
      restaurant.ordering.deliveryFee != null
        ? `رسوم التوصيل: ${formatPrice({ amount: restaurant.ordering.deliveryFee, currency: 'LBP' })}`
        : 'رسوم التوصيل: تُحدَّد عند التأكيد',
    )
  }
  rows.push(`الدفع: ${paymentLabel(order.payment, order.type)}`)
  if (order.payment === 'whish') rows.push('(سأرسل صورة إيصال التحويل)')
  if (c.notes) rows.push('', `ملاحظات: ${c.notes}`)
  return rows.join('\n')
}

/**
 * Sends the order. With an endpoint configured it is POSTed as JSON;
 * otherwise the caller opens WhatsApp with `orderToMessage(order)`.
 */
export async function submitOrder(order) {
  const endpoint = restaurant.ordering.orderEndpoint
  if (!endpoint) return { channel: 'whatsapp' }
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(order),
  })
  if (!res.ok) throw new Error(`Order endpoint responded ${res.status}`)
  return { channel: 'endpoint' }
}
