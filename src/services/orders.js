import { restaurant } from '../config/restaurant';
import { describeSelection } from '../lib/cart';
import { formatPrice, formatTime } from '../lib/format';
import { readJSON, writeJSON } from '../lib/storage';
import { whatsappLink } from '../lib/whatsapp';

const ORDERS_KEY = 'lk.orders';

export function createOrderId(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // no 0/O, 1/I
  let code = '';
  for (let i = 0; i < 4; i += 1) code += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `LK-${dd}${mm}-${code}`;
}

/** Snapshot of the cart, so the confirmation page never depends on the live cart. */
export function snapshotLines(lines) {
  return lines.map((line) => ({
    itemId: line.itemId,
    name: line.item.name,
    qty: line.qty,
    unit: line.unit,
    total: line.total,
    details: { en: describeSelection(line.item, line.selection, 'en'), ar: describeSelection(line.item, line.selection, 'ar') },
  }));
}

export function pickupLabel(slot, lang = 'en') {
  if (!slot || slot === 'asap') return lang === 'ar' ? 'أول ما يجهز' : 'As soon as it is ready';
  const [inDays, time] = slot.split('|');
  const day = inDays === '0' ? (lang === 'ar' ? 'اليوم' : 'Today') : lang === 'ar' ? 'بكرا' : 'Tomorrow';
  return `${day} ${formatTime(time, lang)}`;
}

/** Plain-text order for the kitchen (always in English so staff read one format). */
export function orderMessage(order) {
  const rows = [];
  rows.push(`New order ${order.id}`);
  rows.push(order.type === 'pickup' ? `PICKUP: ${pickupLabel(order.pickupSlot)}` : 'DELIVERY');
  rows.push('');
  rows.push(`Name: ${order.customer.name}`);
  rows.push(`Phone: ${order.customer.phone}`);
  if (order.type === 'delivery') {
    rows.push(`Area: ${order.delivery.area}`);
    rows.push(`Address: ${order.delivery.address}`);
    if (order.delivery.building) rows.push(`Building/floor: ${order.delivery.building}`);
  }
  rows.push('');
  order.lines.forEach((line) => {
    const d = line.details.en;
    rows.push(`${line.qty} x ${line.name.en}  ${formatPrice(line.total)}`);
    d.options.forEach((o) => rows.push(`   - ${o}`));
    d.addons.forEach((a) => rows.push(`   + ${a.name} (${formatPrice(a.price)})`));
    if (d.removed.length) rows.push(`   No: ${d.removed.join(', ')}`);
    if (d.note) rows.push(`   Note: ${d.note}`);
  });
  rows.push('');
  rows.push(`Subtotal: ${formatPrice(order.subtotal)}`);
  if (order.type === 'delivery') {
    rows.push(`Delivery: ${order.deliveryFee == null ? 'to be confirmed' : formatPrice(order.deliveryFee)}`);
  }
  rows.push(`Total: ${formatPrice(order.total)}${order.type === 'delivery' && order.deliveryFee == null ? ' + delivery' : ''}`);
  const cash = order.type === 'pickup' ? 'Cash at pickup' : 'Cash on delivery';
  rows.push(`Payment: ${order.payment === 'whish' ? 'Whish Money' : cash}`);
  if (order.payment === 'whish' && order.whishRef) rows.push(`Whish sender/ref: ${order.whishRef}`);
  if (order.notes) {
    rows.push('');
    rows.push(`Notes: ${order.notes}`);
  }
  return rows.join('\n');
}

export function orderWhatsappUrl(order) {
  return whatsappLink(orderMessage(order));
}

export function usesEndpoint() {
  return Boolean(restaurant.endpoints.orders);
}

/**
 * Sends the order. With an endpoint configured, POSTs JSON and throws on failure.
 * Otherwise the caller opens WhatsApp (it must happen inside the click handler,
 * so browsers don't block it).
 */
export async function sendOrderToEndpoint(order) {
  const response = await fetch(restaurant.endpoints.orders, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ ...order, message: orderMessage(order) }),
  });
  if (!response.ok) throw new Error(`Order endpoint responded ${response.status}`);
}

export function saveOrder(order) {
  const orders = readJSON(ORDERS_KEY, []);
  writeJSON(ORDERS_KEY, [order, ...orders.filter((o) => o.id !== order.id)].slice(0, 10));
}

export function findOrder(id) {
  return readJSON(ORDERS_KEY, []).find((order) => order.id === id) || null;
}
