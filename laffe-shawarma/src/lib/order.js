import { restaurant } from '../config/restaurant'
import { formatPrice } from './format'
import { formatClock } from './hours'

/** Short, readable order number, e.g. "LS-1023-4821". */
export function createOrderNumber(date = new Date()) {
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `LS-${mm}${dd}-${rand}`
}

export function paymentLabel(method, type, t) {
  if (method === 'whish') return 'Whish Money'
  return t(type === 'delivery' ? 'checkout.cashDelivery' : 'checkout.cashPickup')
}

export function pickupTimeLabel(value, t, lang) {
  if (!value || value === 'asap') return t('order.asap')
  const [h, m] = value.split(':').map(Number)
  return formatClock(h * 60 + m, lang)
}

/** Detail lines (options, extras, removals, note) for a cart line, in the current language. */
export function describeLine(line, t, pick) {
  const parts = []
  if (line.options?.length) parts.push(line.options.map((o) => pick(o.name)).join(' · '))
  if (line.addons?.length) parts.push(`${t('line.extras')}: ${line.addons.map((a) => pick(a.name)).join(', ')}`)
  if (line.removed?.length) parts.push(`${t('line.without')}: ${line.removed.map(pick).join(', ')}`)
  if (line.note) parts.push(`${t('line.note')}: ${line.note}`)
  return parts
}

/** Plain-text order the restaurant receives on WhatsApp, in the customer's language. */
export function orderToMessage(order, { t, pick, lang }) {
  const c = order.customer
  const rows = [
    t('order.waTitle', { number: order.number }),
    '',
    `${t('order.waType')}: ${t(`order.type.${order.type}`)}`,
    `${t('order.waName')}: ${c.name}`,
    `${t('order.waPhone')}: ${c.phone}`,
  ]
  if (order.type === 'delivery') {
    rows.push(`${t('order.waArea')}: ${c.area}`, `${t('order.waAddress')}: ${c.address}`)
    if (c.building) rows.push(`${t('order.waBuilding')}: ${c.building}`)
  } else {
    rows.push(`${t('order.waPickup')}: ${pickupTimeLabel(c.pickupTime, t, lang)}`)
  }
  rows.push('', `${t('order.waItems')}:`)
  for (const line of order.lines) {
    const name = [pick(line.name), line.size ? `(${pick(line.size)})` : ''].filter(Boolean).join(' ')
    rows.push(`• ${line.quantity} × ${name} — ${formatPrice(line.unitPrice * line.quantity, lang)}`)
    for (const detail of describeLine(line, t, pick)) rows.push(`   ${detail}`)
  }
  rows.push('', `${t('order.waTotal')}: ${formatPrice(order.total, lang)}`)
  if (order.type === 'delivery') {
    rows.push(
      `${t('order.waDelivery')}: ${
        restaurant.ordering.deliveryFee != null ? formatPrice(restaurant.ordering.deliveryFee, lang) : t('totals.deliveryTbd')
      }`,
    )
  }
  rows.push(`${t('order.waPayment')}: ${paymentLabel(order.payment, order.type, t)}`)
  if (order.payment === 'whish') rows.push(t('order.waReceipt'))
  if (c.notes) rows.push('', `${t('order.waNotes')}: ${c.notes}`)
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
