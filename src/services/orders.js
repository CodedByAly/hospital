import { branches, site } from '../config/site.js';
import { formatCents, formatPhone, formatTime } from '../lib/format.js';
import { readJSON, writeJSON } from '../lib/storage.js';

const ORDERS_KEY = 'zahers.orders.v1';

/*
 * There is no ordering backend yet: an order is saved in the browser and the
 * customer sends it to the branch (WhatsApp when the branch has it, otherwise a
 * phone call). To connect a real backend or POS later, POST `order` from
 * `placeOrder` and use the id it returns — the rest of the flow stays the same.
 */

function makeOrderNumber() {
  const now = new Date();
  const day = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `ZH-${day}-${random}`;
}

export function placeOrder(draft) {
  const order = { ...draft, number: makeOrderNumber(), createdAt: new Date().toISOString() };
  const orders = readJSON(ORDERS_KEY, []);
  writeJSON(ORDERS_KEY, [order, ...orders].slice(0, 10));
  return order;
}

export function getOrder(number) {
  return readJSON(ORDERS_KEY, []).find((o) => o.number === number) ?? null;
}

export const getBranch = (id) => branches.find((b) => b.id === id);

export const paymentLabel = (order) =>
  order.payment === 'whish' ? 'Whish Money transfer' : order.type === 'delivery' ? 'Cash on delivery' : 'Cash at pickup';

export const timingLabel = (order) => {
  if (order.type === 'pickup') return order.pickupTime === 'asap' ? 'As soon as possible' : `At ${formatTime(order.pickupTime)}`;
  return 'The branch will confirm the delivery time';
};

// Plain-text version of the order, used for WhatsApp and copy-to-clipboard.
export function orderMessage(order) {
  const branch = getBranch(order.branchId);
  const lines = [
    `New order ${order.number} (${site.name} ${branch?.name ?? ''})`,
    '',
    ...order.lines.map((l) => {
      const extras = [...l.details, ...l.removed.map((r) => `no ${r.toLowerCase()}`)];
      return `${l.quantity} x ${l.name} — ${formatCents(l.totalCents)}${extras.length ? `\n   ${extras.join(', ')}` : ''}${l.note ? `\n   Note: ${l.note}` : ''}`;
    }),
    '',
    `Subtotal: ${formatCents(order.subtotalCents)}`,
    order.type === 'delivery' && order.deliveryFeeCents == null ? 'Delivery fee: to be confirmed' : null,
    order.type === 'delivery' && order.deliveryFeeCents != null ? `Delivery: ${formatCents(order.deliveryFeeCents)}` : null,
    `Total: ${formatCents(order.totalCents)}`,
    '',
    `${order.type === 'pickup' ? 'PICKUP' : 'DELIVERY'} · ${timingLabel(order)}`,
    `Name: ${order.customer.name}`,
    `Phone: ${formatPhone(order.customer.phone)}`,
    order.type === 'delivery' ? `Area: ${order.customer.area}` : null,
    order.type === 'delivery' ? `Address: ${order.customer.address}` : null,
    order.type === 'delivery' && order.customer.building ? `Building / floor / apt: ${order.customer.building}` : null,
    order.customer.notes ? `Notes: ${order.customer.notes}` : null,
    `Payment: ${paymentLabel(order)}`,
  ];
  return lines.filter((l) => l !== null).join('\n');
}
