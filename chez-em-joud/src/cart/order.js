import { itemsById } from '../data/menu'
import { money, site } from '../data/site'

// Short, readable order number: CEJ-2410-4831 (month-day + 4 random digits).
export function makeOrderNumber(date = new Date()) {
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const rand = String(Math.floor(1000 + Math.random() * 9000))
  return `CEJ-${dd}${mm}-${rand}`
}

export function lineDetails(line) {
  const parts = []
  if (line.flavor) parts.push(`Flavor: ${line.flavor}`)
  if (line.removed?.length) parts.push(`No ${line.removed.map((r) => r.toLowerCase()).join(', no ')}`)
  if (line.note) parts.push(`“${line.note}”`)
  return parts
}

export function orderTotals(lines, type) {
  const subtotal = lines.reduce((s, l) => s + itemsById[l.id].price * l.qty, 0)
  const fee = type === 'delivery' ? site.ordering.deliveryFee : 0
  return { subtotal, fee, total: subtotal + (fee || 0) }
}

// The WhatsApp message the restaurant receives.
export function orderMessage(order) {
  const { number, type, customer, lines, totals, payment } = order
  const out = [`*New order ${number}*`, `${type === 'delivery' ? 'Delivery' : 'Pickup'} · ${payment}`, '']

  lines.forEach((l) => {
    const item = itemsById[l.id]
    out.push(`${l.qty} × ${item.name} — ${money(item.price * l.qty)}`)
    lineDetails(l).forEach((d) => out.push(`   ${d}`))
  })

  out.push('', `Subtotal: ${money(totals.subtotal)}`)
  if (type === 'delivery') {
    out.push(totals.fee == null ? 'Delivery: please confirm the fee' : `Delivery: ${money(totals.fee)}`)
  }
  out.push(`*Total: ${money(totals.total)}${type === 'delivery' && totals.fee == null ? ' + delivery' : ''}*`, '')

  out.push(`Name: ${customer.name}`, `Phone: ${customer.phone}`)
  if (type === 'delivery') {
    out.push(`Area: ${customer.area}`, `Address: ${customer.address}`)
    if (customer.building) out.push(`Building / floor: ${customer.building}`)
    if (customer.notes) out.push(`Delivery notes: ${customer.notes}`)
  } else {
    out.push(`Pickup: ${customer.pickupTime === 'asap' ? 'As soon as possible' : customer.pickupAt}`)
    if (customer.notes) out.push(`Order notes: ${customer.notes}`)
  }
  return out.join('\n')
}
