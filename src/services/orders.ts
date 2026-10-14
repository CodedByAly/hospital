/**
 * Order submission.
 *
 * There is no ordering backend yet, so an order is delivered to the
 * restaurant as a pre-written WhatsApp message. To plug in a real API
 * later, replace the body of `submitOrder` — the rest of the app only
 * relies on the returned `PlacedOrder`.
 */
import { restaurant, whatsappLink } from '../config/restaurant'
import { findItem } from '../data/menu'
import { describeLine, lineTotal, type CartLine } from '../store/cart'
import { storage } from '../utils/storage'
import { clock } from '../utils/format'

export type OrderType = 'pickup' | 'delivery'
export type PaymentMethod = 'cash' | 'whish'

export interface OrderDetails {
  type: OrderType
  name: string
  phone: string
  /** "asap" or "HH:MM" (pickup only) */
  pickupTime: string
  area: string
  address: string
  building: string
  notes: string
  payment: PaymentMethod
}

export interface PlacedLine {
  name: string
  qty: number
  options: string[]
  removed: string[]
  notes: string
  total: number
}

export interface PlacedOrder extends OrderDetails {
  number: string
  createdAt: string
  lines: PlacedLine[]
  subtotal: number
  deliveryFee: number | null
  total: number
  whatsappUrl: string
}

const LAST_ORDER = 'kuku.lastOrder'

const orderNumber = () => {
  const d = new Date()
  const stamp = `${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `KU-${stamp}-${rand}`
}

const usd = (v: number) => `$${v.toFixed(2)}`

export function buildOrderMessage(o: Omit<PlacedOrder, 'whatsappUrl'>) {
  const L: string[] = []
  L.push(`*New order ${o.number}*`)
  L.push(`${o.type === 'pickup' ? 'PICKUP' : 'DELIVERY'} · ${o.payment === 'cash' ? (o.type === 'pickup' ? 'Cash at pickup' : 'Cash on delivery') : 'Whish Money'}`)
  L.push('')
  for (const line of o.lines) {
    L.push(`${line.qty}× ${line.name} — ${usd(line.total)}`)
    for (const opt of line.options) L.push(`   • ${opt}`)
    if (line.removed.length) L.push(`   • No: ${line.removed.join(', ')}`)
    if (line.notes) L.push(`   • Note: ${line.notes}`)
  }
  L.push('')
  L.push(`Subtotal: ${usd(o.subtotal)}`)
  if (o.type === 'delivery') L.push(`Delivery: ${o.deliveryFee != null ? usd(o.deliveryFee) : 'to confirm'}`)
  L.push(`*Total: ${usd(o.total)}*`)
  L.push('')
  L.push(`Name: ${o.name}`)
  L.push(`Phone: ${o.phone}`)
  if (o.type === 'pickup') {
    L.push(`Pickup: ${o.pickupTime === 'asap' ? 'As soon as possible' : clock(o.pickupTime, 'en')}`)
  } else {
    L.push(`Area: ${o.area}`)
    L.push(`Address: ${o.address}`)
    if (o.building) L.push(`Building/floor: ${o.building}`)
  }
  if (o.notes) L.push(`Notes: ${o.notes}`)
  if (o.payment === 'whish') L.push('', 'Paying by Whish Money — I will send the transfer confirmation here.')
  return L.join('\n')
}

export function submitOrder(details: OrderDetails, cart: CartLine[]): PlacedOrder {
  const lines: PlacedLine[] = cart.map((l) => {
    const item = findItem(l.itemId)
    return {
      name: item?.name ?? l.itemId,
      qty: l.qty,
      options: describeLine(l, 'en'),
      removed: l.removed,
      notes: l.notes.trim(),
      total: Math.round(lineTotal(l) * 100) / 100,
    }
  })
  const subtotal = Math.round(lines.reduce((s, l) => s + l.total, 0) * 100) / 100
  const deliveryFee = details.type === 'delivery' ? restaurant.ordering.deliveryFee : null
  const total = Math.round((subtotal + (deliveryFee ?? 0)) * 100) / 100
  const base = { ...details, number: orderNumber(), createdAt: new Date().toISOString(), lines, subtotal, deliveryFee, total }
  const order: PlacedOrder = { ...base, whatsappUrl: whatsappLink(buildOrderMessage(base)) }
  storage.set(LAST_ORDER, order)
  return order
}

export const lastOrder = () => storage.get<PlacedOrder>(LAST_ORDER)
