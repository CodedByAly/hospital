import { restaurant, lines, whatsappLink, type Line } from '../config/restaurant'
import { formatPrice, formatTime } from './format'
import { lineLabel, type ResolvedLine } from './cart'
import { load, save } from './storage'

export type OrderType = 'pickup' | 'delivery'
export type Payment = 'cash' | 'whish'

export type OrderDetails = {
  type: OrderType
  lineId: string
  name: string
  phone: string
  pickupTime: string // 'asap' or ISO
  area: string
  address: string
  building: string
  notes: string
  payment: Payment
}

export type StoredOrder = {
  number: string
  placedAt: string
  details: OrderDetails
  lines: { name: string; qty: number; notes: string; total: number }[]
  subtotal: number
  deliveryFee: number | null
  total: number
}

const ORDERS_KEY = 'outlaw:orders'
const CUSTOMER_KEY = 'outlaw:customer'

export const lineById = (id: string): Line => lines.find((l) => l.id === id) ?? lines[0]

export function newOrderNumber() {
  const d = new Date()
  const stamp = `${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  return `OL-${stamp}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

export function buildOrder(details: OrderDetails, resolved: ResolvedLine[], subtotal: number): StoredOrder {
  const fee = details.type === 'delivery' ? restaurant.ordering.deliveryFee : 0
  return {
    number: newOrderNumber(),
    placedAt: new Date().toISOString(),
    details,
    lines: resolved.map((l) => ({ name: lineLabel(l), qty: l.qty, notes: l.notes, total: l.lineTotal })),
    subtotal,
    deliveryFee: fee,
    total: subtotal + (fee ?? 0),
  }
}

export function whatsappMessage(order: StoredOrder) {
  const d = order.details
  const line = lineById(d.lineId)
  const out = [`Hello ${restaurant.name}! New order ${order.number}`, '']
  out.push(`Order type: ${d.type === 'delivery' ? 'Delivery' : 'Take away'}`)
  out.push(`Name: ${d.name}`, `Phone: ${d.phone}`)
  if (d.type === 'pickup') out.push(`Pickup: ${d.pickupTime === 'asap' ? 'As soon as possible' : formatTime(new Date(d.pickupTime))}`)
  if (d.type === 'delivery') {
    out.push(`Area: ${d.area}`, `Address: ${d.address}`)
    if (d.building) out.push(`Building: ${d.building}`)
  }
  out.push('', 'Items:')
  order.lines.forEach((l) => {
    out.push(`• ${l.qty} × ${l.name} — ${formatPrice(l.total)}`)
    if (l.notes) out.push(`   Note: ${l.notes}`)
  })
  out.push('', `Subtotal: ${formatPrice(order.subtotal)}`)
  if (d.type === 'delivery') out.push(`Delivery: ${order.deliveryFee == null ? 'to be confirmed' : formatPrice(order.deliveryFee)}`)
  out.push(`Total: ${formatPrice(order.total)}${d.type === 'delivery' && order.deliveryFee == null ? ' + delivery' : ''}`)
  out.push(`Payment: ${d.payment === 'whish' ? `Whish Money to ${line.display}` : d.type === 'delivery' ? 'Cash on delivery' : 'Cash at pickup'}`)
  if (d.notes) out.push('', `Notes: ${d.notes}`)
  return out.join('\n')
}

export const orderLink = (order: StoredOrder) => whatsappLink(lineById(order.details.lineId), whatsappMessage(order))

export function saveOrder(order: StoredOrder) {
  const all = load<StoredOrder[]>(ORDERS_KEY, [])
  save(ORDERS_KEY, [order, ...all].slice(0, 20))
}

export const findOrder = (number: string) => load<StoredOrder[]>(ORDERS_KEY, []).find((o) => o.number === number) ?? null

type Customer = Pick<OrderDetails, 'name' | 'phone' | 'area' | 'address' | 'building' | 'lineId'>
export const loadCustomer = () => load<Partial<Customer>>(CUSTOMER_KEY, {})
export const saveCustomer = (c: Customer) => save(CUSTOMER_KEY, c)
