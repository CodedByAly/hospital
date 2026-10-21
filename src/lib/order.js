import { restaurant } from '../config/restaurant.js'
import { findItem } from '../data/menu.js'
import { formatPrice } from './format.js'
import { describeLine, lineTotal } from './pricing.js'

export const PAYMENT_LABELS = {
  cash: { pickup: 'Cash on pickup', delivery: 'Cash on delivery' },
  whish: { pickup: 'Whish Money', delivery: 'Whish Money' },
}

export function paymentLabel(order) {
  return PAYMENT_LABELS[order.payment][order.type]
}

export function cartSubtotal(lines) {
  return lines.reduce((sum, line) => sum + lineTotal(line), 0)
}

export function deliveryFeeFor(type) {
  return type === 'delivery' && restaurant.deliveryFee != null ? restaurant.deliveryFee : 0
}

// Short, readable order number: JG + day of month + 4 random characters (no easily confused letters).
export function createOrderNumber(date = new Date()) {
  const alphabet = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'
  let code = ''
  for (let i = 0; i < 4; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)]
  return `JG-${String(date.getDate()).padStart(2, '0')}${code}`
}

export function orderMessage(order) {
  const lines = order.lines.map((line) => {
    const item = findItem(line.itemId)
    const { options, removed } = describeLine(line)
    const details = [...options, ...removed].map((d) => `   - ${d}`).join('\n')
    return `${line.qty} x ${item?.name ?? line.itemId}  ${formatPrice(lineTotal(line))}${details ? `\n${details}` : ''}`
  })

  const c = order.customer
  const who =
    order.type === 'pickup'
      ? [`Pickup time: ${c.pickupTime}`]
      : [
          `Area: ${c.area}`,
          `Address: ${c.address}`,
          c.building ? `Building / floor / apt: ${c.building}` : null,
        ].filter(Boolean)

  const total =
    order.type === 'delivery' && restaurant.deliveryFee == null
      ? `Total: ${formatPrice(order.total)} + delivery`
      : `Total: ${formatPrice(order.total)}`

  return [
    `New order ${order.number}`,
    `${order.type === 'pickup' ? 'PICKUP' : 'DELIVERY'}`,
    '',
    `Name: ${c.name}`,
    `Phone: ${c.phone}`,
    ...who,
    c.notes ? `Notes: ${c.notes}` : null,
    '',
    ...lines,
    '',
    `Subtotal: ${formatPrice(order.subtotal)}`,
    order.deliveryFee ? `Delivery: ${formatPrice(order.deliveryFee)}` : null,
    total,
    `Payment: ${paymentLabel(order)}${order.payment === 'whish' ? ` (to ${restaurant.whish.number})` : ''}`,
  ]
    .filter((l) => l !== null)
    .join('\n')
}

export const LAST_ORDER_KEY = 'jungs:last-order:v1'
