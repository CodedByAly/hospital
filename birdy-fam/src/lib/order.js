import { itemsById } from '../data/menu.js'
import { restaurant, formatPhone } from '../data/restaurant.js'
import { lineDetails, lineTotal } from './cart.js'
import { formatPrice, normalizeLebanesePhone } from './format.js'

export const PAYMENT_LABELS = {
  cash: { pickup: 'Cash at pickup', delivery: 'Cash on delivery' },
  whish: { pickup: 'Whish Money', delivery: 'Whish Money' },
}

function orderNumber(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0/O, 1/I
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => alphabet[b % alphabet.length]).join('')
  return `BF-${dd}${mm}-${rand}`
}

/** Freezes the bag into a self-contained order record (survives menu edits). */
export function buildOrder({ lines, subtotal, form, pickupLabel }) {
  const fee = form.type === 'delivery' ? restaurant.ordering.deliveryFee : 0
  return {
    number: orderNumber(),
    createdAt: new Date().toISOString(),
    type: form.type,
    branch: restaurant.branches.find((b) => b.id === form.branchId),
    customer: {
      name: form.name.trim(),
      phone: normalizeLebanesePhone(form.phone),
      area: form.area.trim(),
      address: form.address.trim(),
      building: form.building.trim(),
    },
    when: form.type === 'pickup' ? pickupLabel : 'As soon as possible',
    notes: form.notes.trim(),
    payment: form.payment,
    paymentLabel: PAYMENT_LABELS[form.payment][form.type],
    items: lines.map((l) => ({
      name: itemsById[l.itemId].name,
      qty: l.qty,
      details: lineDetails(l),
      total: lineTotal(l),
    })),
    subtotal,
    deliveryFee: fee, // null = to be confirmed by the branch
    total: fee == null ? subtotal : subtotal + fee,
  }
}

/** Plain-text order for WhatsApp. Kept short enough to read on a phone. */
export function orderMessage(order) {
  const out = [`New order ${order.number}`]
  out.push(order.type === 'pickup' ? `PICKUP from ${order.branch.name}, ${order.when}` : `DELIVERY from ${order.branch.name}`)
  out.push('', `Name: ${order.customer.name}`, `Phone: ${formatPhone(order.customer.phone)}`)
  if (order.type === 'delivery') {
    out.push(`Area: ${order.customer.area}`, `Address: ${order.customer.address}`)
    if (order.customer.building) out.push(`Building / floor / apt: ${order.customer.building}`)
  }
  out.push('')
  for (const i of order.items) {
    out.push(`${i.qty} x ${i.name}  ${formatPrice(i.total)}`)
    for (const d of i.details) out.push(`    ${d}`)
  }
  out.push('', `Subtotal: ${formatPrice(order.subtotal)}`)
  if (order.type === 'delivery') out.push(`Delivery: ${order.deliveryFee == null ? 'please confirm' : formatPrice(order.deliveryFee)}`)
  out.push(`Total: ${formatPrice(order.total)}${order.deliveryFee == null && order.type === 'delivery' ? ' + delivery' : ''}`)
  out.push(`Payment: ${order.paymentLabel}`)
  if (order.payment === 'whish') out.push('I will send the Whish transfer screenshot here.')
  if (order.notes) out.push('', `Notes: ${order.notes}`)
  return out.join('\n')
}
