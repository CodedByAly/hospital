import { restaurant, whatsappLink } from '../data/restaurant';
import { describeLine } from './cartLine';
import { money } from './format';
import { readJSON, writeJSON } from './storage';

const ORDERS_KEY = 'cb.orders';

export const PAYMENT_LABELS = {
  cash: { pickup: 'Cash at pickup', delivery: 'Cash on delivery' },
  whish: { pickup: 'Whish Money', delivery: 'Whish Money' },
};

export const paymentLabel = (payment, type) => PAYMENT_LABELS[payment]?.[type] ?? payment;

/** Short, readable reference the customer can quote on the phone. */
export function createOrderNumber(date = new Date()) {
  const day = `${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  const random = new Uint32Array(4);
  window.crypto.getRandomValues(random);
  for (const n of random) suffix += alphabet[n % alphabet.length];
  return `CB-${day}-${suffix}`;
}

export function saveOrder(order) {
  const orders = readJSON(ORDERS_KEY, []);
  writeJSON(ORDERS_KEY, [order, ...orders.filter((o) => o.number !== order.number)].slice(0, 10));
}

export function findOrder(number) {
  return readJSON(ORDERS_KEY, []).find((o) => o.number === number) || null;
}

function timeLabel(order) {
  if (order.type === 'pickup') return order.pickupTime === 'asap' ? 'As soon as possible' : order.pickupTime;
  return null;
}

/** Plain-text order the restaurant receives on WhatsApp. */
export function orderMessage(order) {
  const c = order.customer;
  const lines = [
    `New ${order.type === 'pickup' ? 'PICKUP' : 'DELIVERY'} order – ${order.number}`,
    '',
    ...order.lines.map((l) => {
      const extras = l.details.length ? `\n   ${l.details.join(', ')}` : '';
      const note = l.note ? `\n   Note: ${l.note}` : '';
      return `${l.qty} x ${l.name} – ${money(l.total)}${extras}${note}`;
    }),
    '',
    `Subtotal: ${money(order.subtotal)}`,
  ];
  if (order.type === 'delivery') {
    lines.push(order.deliveryFee == null ? 'Delivery fee: to be confirmed' : `Delivery fee: ${money(order.deliveryFee)}`);
  }
  lines.push(`Total: ${money(order.total)}${order.type === 'delivery' && order.deliveryFee == null ? ' + delivery' : ''}`);
  lines.push(`Payment: ${paymentLabel(order.payment, order.type)}`);
  lines.push('', `Name: ${c.name}`, `Phone: ${c.phone}`);
  if (order.type === 'pickup') {
    lines.push(`Pickup time: ${timeLabel(order)}`);
  } else {
    lines.push(`Area: ${c.area}`, `Address: ${c.address}`);
    if (c.building) lines.push(`Building / floor / apt: ${c.building}`);
  }
  if (c.notes) lines.push(`Notes: ${c.notes}`);
  if (order.payment === 'whish') {
    lines.push('', `I will send the Whish transfer to ${restaurant.whish.number} and share the receipt here.`);
  }
  return lines.join('\n');
}

export const orderWhatsappLink = (order) => whatsappLink(orderMessage(order));

/** Snapshot of the cart so the confirmation page still works if the menu changes later. */
export function buildOrder({ type, payment, customer, lines, subtotal }) {
  const deliveryFee = type === 'delivery' ? restaurant.ordering.deliveryFee : 0;
  return {
    number: createOrderNumber(),
    createdAt: new Date().toISOString(),
    type,
    payment,
    customer,
    pickupTime: type === 'pickup' ? customer.pickupTime : null,
    lines: lines.map((l) => ({
      name: l.item.name,
      qty: l.qty,
      unitPrice: l.unitPrice,
      total: l.total,
      details: describeLine(l),
      note: l.note || '',
    })),
    subtotal,
    deliveryFee,
    total: subtotal + (deliveryFee || 0),
  };
}

/**
 * Sends the order. With a backend configured it is POSTed as JSON;
 * otherwise the caller opens WhatsApp with the prepared message.
 */
export async function submitOrder(order) {
  const endpoint = restaurant.ordering.orderEndpoint;
  if (!endpoint) return { channel: 'whatsapp' };
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error(`Order failed (${res.status})`);
  return { channel: 'api' };
}
