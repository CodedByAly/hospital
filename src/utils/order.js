import { menuById } from '../data/menu'
import { restaurant, whatsappLink } from '../config/restaurant'
import { money, itemTitle } from './format'
import { lineDetails, lineTotal } from './cartLine'
import { orderTotal } from '../components/OrderSummary'
import { readJSON, writeJSON } from './storage'

const ORDERS_KEY = 'chippy:orders'
const CUSTOMER_KEY = 'chippy:customer'

export function makeOrderId(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `CH-${dd}${mm}-${rand}`
}

export const paymentLabel = (payment, type) =>
  payment === 'whish' ? 'Whish Money' : type === 'pickup' ? 'Cash at pickup' : 'Cash on delivery'

export function buildOrder(form, lines, subtotal) {
  return {
    id: makeOrderId(),
    createdAt: new Date().toISOString(),
    type: form.type,
    customer: {
      name: form.name.trim(),
      phone: form.phone.trim(),
    },
    pickupTime: form.type === 'pickup' ? (form.pickupWhen === 'asap' ? 'asap' : form.pickupTime) : null,
    delivery:
      form.type === 'delivery'
        ? {
            area: form.area.trim(),
            address: form.address.trim(),
            building: form.building.trim(),
            floor: form.floor.trim(),
            apartment: form.apartment.trim(),
          }
        : null,
    notes: form.notes.trim(),
    payment: form.payment,
    lines: lines.map((l) => ({
      key: l.key,
      itemId: l.itemId,
      name: itemTitle(menuById[l.itemId]),
      qty: l.qty,
      details: lineDetails(l),
      total: lineTotal(l),
    })),
    subtotal,
    total: orderTotal(subtotal, form.type),
    deliveryFee: form.type === 'delivery' ? restaurant.ordering.deliveryFee : null,
  }
}

export function formatPickup(order) {
  if (order.type !== 'pickup') return null
  if (order.pickupTime === 'asap') return 'As soon as possible'
  const [h, m] = order.pickupTime.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  return `Today at ${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${suffix}`
}

export function formatAddress(d) {
  if (!d) return ''
  const unit = [d.building && `Bldg ${d.building}`, d.floor && `Floor ${d.floor}`, d.apartment && `Apt ${d.apartment}`].filter(Boolean).join(', ')
  return [d.area, d.address, unit].filter(Boolean).join(' · ')
}

// Plain-text order the restaurant receives on WhatsApp.
export function orderMessage(order) {
  const out = []
  out.push(`*New ${order.type === 'pickup' ? 'PICKUP' : 'DELIVERY'} order ${order.id}*`)
  out.push('')
  for (const l of order.lines) {
    out.push(`${l.qty} x ${l.name}  (${money(l.total)})`)
    for (const d of l.details) out.push(`   - ${d}`)
  }
  out.push('')
  out.push(`Subtotal: ${money(order.subtotal)}`)
  if (order.type === 'delivery') {
    out.push(`Delivery: ${typeof order.deliveryFee === 'number' ? money(order.deliveryFee) : 'to confirm'}`)
  }
  out.push(`*Total: ${money(order.total)}*${order.type === 'delivery' && typeof order.deliveryFee !== 'number' ? ' + delivery' : ''}`)
  out.push(`Payment: ${paymentLabel(order.payment, order.type)}`)
  out.push('')
  out.push(`Name: ${order.customer.name}`)
  out.push(`Phone: ${order.customer.phone}`)
  if (order.type === 'pickup') out.push(`Pickup: ${formatPickup(order)}`)
  if (order.type === 'delivery') out.push(`Address: ${formatAddress(order.delivery)}`)
  if (order.notes) out.push(`Notes: ${order.notes}`)
  return out.join('\n')
}

export const orderWhatsappLink = (order) => whatsappLink(orderMessage(order))

export function saveOrder(order) {
  const orders = readJSON(ORDERS_KEY, [])
  writeJSON(ORDERS_KEY, [order, ...orders.filter((o) => o.id !== order.id)].slice(0, 10))
}

export const findOrder = (id) => readJSON(ORDERS_KEY, []).find((o) => o.id === id) || null

export const loadCustomer = () => readJSON(CUSTOMER_KEY, null)
export const saveCustomer = (data) => writeJSON(CUSTOMER_KEY, data)

// Accepts Lebanese numbers written as 03 123 456, 71123456, +961 71 123 456...
export function isValidPhone(value) {
  const digits = value.replace(/[\s-()]/g, '')
  return /^(\+?961)?0?\d{7,8}$/.test(digits) || /^\+\d{8,15}$/.test(digits)
}
