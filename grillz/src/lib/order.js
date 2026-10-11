import restaurant from '../config/restaurant';
import { itemsById } from '../data/menu';
import { unitPrice, lineDetails, lineCurrency, totalsOf, deliveryFeeFor } from '../context/CartContext';
import { formatPrice, formatTotals, addTotals } from './format';
import { readJSON, writeJSON } from './storage';
import { whatsappLink } from './links';

const ORDERS_KEY = 'grillz.orders.v1';
const CUSTOMER_KEY = 'grillz.customer.v1';
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function newOrderNumber() {
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  return `GZ-${[...bytes].map((b) => ALPHABET[b % ALPHABET.length]).join('')}`;
}

/** A self-contained snapshot of the order, with prices frozen at checkout. */
export function createOrder(form, lines) {
  const items = lines.map((l) => ({
    itemId: l.itemId,
    name: itemsById[l.itemId].name,
    details: lineDetails(l),
    note: l.note,
    qty: l.qty,
    unit: unitPrice(l),
    currency: lineCurrency(l),
  }));
  const subtotal = totalsOf(lines);
  const deliveryFee = deliveryFeeFor(form.type);
  return {
    id: newOrderNumber(),
    createdAt: new Date().toISOString(),
    type: form.type,
    customer: { name: form.name.trim(), phone: form.phone.trim() },
    pickupTime: form.type === 'pickup' && form.when === 'later' ? form.time : null,
    delivery: form.type === 'delivery' ? { area: form.area.trim(), address: form.address.trim(), building: form.building.trim() } : null,
    notes: form.notes.trim(),
    payment: form.payment,
    items,
    subtotal,
    deliveryFee,
    total: addTotals(subtotal, { LBP: deliveryFee || 0 }),
  };
}

export function saveOrder(order) {
  const orders = readJSON(ORDERS_KEY, []).filter((o) => o.id !== order.id);
  writeJSON(ORDERS_KEY, [order, ...orders].slice(0, 10));
}
export const findOrder = (id) => readJSON(ORDERS_KEY, []).find((o) => o.id === id) || null;
export const loadCustomer = () => readJSON(CUSTOMER_KEY, {});
export function saveCustomer({ name, phone, area, address, building }) {
  writeJSON(CUSTOMER_KEY, { name, phone, area, address, building });
}

export function paymentLabel(order) {
  if (order.payment === 'whish') return 'Whish Money';
  return order.type === 'delivery' ? 'Cash on delivery' : 'Cash on pickup';
}

/** The WhatsApp message the customer sends to Grillz. */
export function orderMessage(order) {
  const out = ['Hi Grillz, I’d like to order.', '', `*Order ${order.id}*`, `Type: ${order.type === 'delivery' ? 'Delivery' : 'Pickup'}`, `Name: ${order.customer.name}`, `Phone: ${order.customer.phone}`];
  if (order.type === 'pickup') out.push(`Pickup time: ${order.pickupTime || 'As soon as it’s ready'}`);
  if (order.delivery) {
    out.push(`Area: ${order.delivery.area}`, `Address: ${order.delivery.address}`);
    if (order.delivery.building) out.push(`Building / floor: ${order.delivery.building}`);
  }
  if (order.notes) out.push(`Notes: ${order.notes}`);
  out.push('', '*Items*');
  for (const i of order.items) {
    out.push(`• ${i.qty}× ${i.name} — ${formatPrice(i.unit * i.qty, i.currency)}`);
    const extra = [...i.details, i.note && `Note: ${i.note}`].filter(Boolean);
    if (extra.length) out.push(`   ${extra.join(', ')}`);
  }
  out.push('', `Subtotal: ${formatTotals(order.subtotal)}`);
  if (order.type === 'delivery') out.push(`Delivery: ${order.deliveryFee == null ? 'to confirm' : formatPrice(order.deliveryFee)}`);
  out.push(`*Total: ${formatTotals(order.total)}*`, `Payment: ${paymentLabel(order)}`);
  if (order.payment === 'whish') out.push('I’ll send the Whish transfer screenshot here.');
  return out.join('\n');
}

export const orderWhatsAppLink = (order) => whatsappLink(orderMessage(order));

export async function submitOrder(order) {
  if (!restaurant.endpoints.order) return { sent: false };
  try {
    const res = await fetch(restaurant.endpoints.order, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(order),
    });
    return { sent: res.ok };
  } catch {
    return { sent: false };
  }
}
