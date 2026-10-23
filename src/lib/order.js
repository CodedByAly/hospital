import { ordering, restaurant } from '../config/restaurant'
import { getItem } from '../data/menu'
import { describeSelection, formatPrice } from './price'

export function createOrderNumber(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0')
  const stamp = `${pad(date.getMonth() + 1)}${pad(date.getDate())}`
  const random = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `MB-${stamp}-${random}`
}

/** The text sent to the restaurant on WhatsApp. Always English for the kitchen. */
export function orderMessage(order) {
  const lines = []
  lines.push(`New delivery order ${order.number}`)
  lines.push('')
  for (const line of order.lines) {
    const item = getItem(line.itemId)
    if (!item) continue
    const { chosen, removed } = describeSelection(item, line.selection, 'en')
    lines.push(`${line.qty} x ${item.name.en}  ${formatPrice(line.unitCents * line.qty)}`)
    if (chosen.length) lines.push(`   ${chosen.join(', ')}`)
    if (removed.length) lines.push(`   No ${removed.join(', no ')}`)
  }
  lines.push('')
  lines.push(`Subtotal: ${formatPrice(order.subtotalCents)}`)
  lines.push(
    order.deliveryCents == null
      ? 'Delivery fee: to be confirmed'
      : `Delivery fee: ${formatPrice(order.deliveryCents)}`,
  )
  lines.push(`Total: ${formatPrice(order.totalCents)}${order.deliveryCents == null ? ' + delivery' : ''}`)
  lines.push(`Payment: ${order.payment === 'whish' ? 'Whish Money' : 'Cash on delivery'}`)
  lines.push('')
  const c = order.customer
  lines.push(`Name: ${c.name}`)
  lines.push(`Phone: ${c.phone}`)
  lines.push(`Area: ${c.area}`)
  lines.push(`Address: ${c.street}`)
  const building = [c.building && `Building ${c.building}`, c.floor && `Floor ${c.floor}`, c.apartment && `Apt ${c.apartment}`]
    .filter(Boolean)
    .join(', ')
  if (building) lines.push(building)
  if (c.notes) lines.push(`Notes: ${c.notes}`)
  return lines.join('\n')
}

export const orderWhatsAppUrl = (order) =>
  `https://wa.me/${ordering.whatsappNumber}?text=${encodeURIComponent(orderMessage(order))}`

export const restaurantName = restaurant.name
