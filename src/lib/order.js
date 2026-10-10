import { restaurant, whatsappLink } from '../config/restaurant'
import { makePick, makeT } from '../i18n/translate'
import { formatPrice } from './format'
import { lineDetailParts } from './cart'
import { storage } from './storage'

const ORDERS_KEY = 'streets:orders'
const CUSTOMER_KEY = 'streets:customer'

export const newOrderNumber = () => `ST-${Math.floor(10000 + Math.random() * 90000)}`

/** Freezes the cart into an order so it can be shown again even if the menu changes later. */
export function createOrder({ form, lines, subtotal, lang }) {
  const deliveryFee = form.type === 'delivery' ? restaurant.ordering.deliveryFee : 0
  const t = makeT(lang)
  const pick = makePick(lang)
  return {
    number: newOrderNumber(),
    createdAt: new Date().toISOString(),
    lang,
    type: form.type,
    payment: form.payment,
    customer: {
      name: form.name.trim(),
      phone: form.phone.trim(),
      table: form.table.trim(),
      time: form.time,
      area: form.area.trim(),
      address: form.address.trim(),
      building: form.building.trim(),
      notes: form.notes.trim(),
    },
    lines: lines.map((l) => ({
      itemId: l.item.id,
      image: l.item.image,
      name: l.item.name,
      details: lineDetailParts(l, t, pick, lang),
      notes: l.config.notes,
      qty: l.qty,
      unitPrice: l.unitPrice,
      total: l.lineTotal,
    })),
    subtotal,
    deliveryFee, // null = to be confirmed
    total: subtotal + (deliveryFee || 0),
  }
}

export function saveOrder(order) {
  const orders = storage.get(ORDERS_KEY, [])
  storage.set(ORDERS_KEY, [order, ...orders.filter((o) => o.number !== order.number)].slice(0, 20))
  storage.set(CUSTOMER_KEY, {
    name: order.customer.name,
    phone: order.customer.phone,
    area: order.customer.area,
    address: order.customer.address,
    building: order.customer.building,
  })
}

export const getOrder = (number) => storage.get(ORDERS_KEY, []).find((o) => o.number === number) ?? null
export const savedCustomer = () => storage.get(CUSTOMER_KEY, null)

export const orderTypeLabel = (type, t) => ({ dineIn: t('checkout.dineIn'), pickup: t('checkout.pickup'), delivery: t('checkout.delivery') })[type]

export function paymentLabel(order, t) {
  if (order.payment === 'whish') return t('checkout.whish')
  return { dineIn: t('checkout.cashDineIn'), pickup: t('checkout.cashPickup'), delivery: t('checkout.cashDelivery') }[order.type]
}

export function pickupTimeLabel(time, t) {
  return time === 'asap' ? t('checkout.asap') : time
}

/** Plain-text order for WhatsApp, in the language the guest ordered in. */
export function orderMessage(order) {
  const t = makeT(order.lang)
  const pick = makePick(order.lang)
  const price = (n) => formatPrice(n, order.lang)
  const c = order.customer
  const out = [
    t('whatsapp.hello'),
    `*${t('whatsapp.orderHeading', { number: order.number })}*`,
    '',
    `${t('whatsapp.type')}: ${orderTypeLabel(order.type, t)}`,
    `${t('whatsapp.name')}: ${c.name}`,
    `${t('whatsapp.phone')}: ${c.phone}`,
  ]
  if (order.type === 'dineIn') out.push(`${t('whatsapp.table')}: ${c.table}`)
  if (order.type === 'pickup') out.push(`${t('whatsapp.time')}: ${pickupTimeLabel(c.time, t)}`)
  if (order.type === 'delivery') {
    out.push(`${t('whatsapp.area')}: ${c.area}`, `${t('whatsapp.address')}: ${c.address}`)
    if (c.building) out.push(`${t('whatsapp.building')}: ${c.building}`)
  }
  out.push('', `*${t('whatsapp.items')}*`)
  order.lines.forEach((l) => {
    out.push(`${l.qty} × ${pick(l.name)} — ${price(l.total)}`)
    if (l.details.length) out.push(`   ${l.details.join(' · ')}`)
    if (l.notes) out.push(`   ${t('cart.note')}: ${l.notes}`)
  })
  out.push('', `${t('whatsapp.subtotal')}: ${price(order.subtotal)}`)
  if (order.type === 'delivery') {
    out.push(`${t('whatsapp.delivery')}: ${order.deliveryFee == null ? t('whatsapp.toConfirm') : price(order.deliveryFee)}`)
  }
  out.push(`*${t('whatsapp.total')}: ${price(order.total)}*`, `${t('whatsapp.payment')}: ${paymentLabel(order, t)}`)
  if (c.notes) out.push('', `${t('whatsapp.notes')}: ${c.notes}`)
  return out.join('\n')
}

export const orderWhatsappLink = (order) => whatsappLink(orderMessage(order))
