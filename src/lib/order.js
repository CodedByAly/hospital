import restaurant from '../config/restaurant';
import strings from '../i18n/strings';
import { itemsById } from '../data/menu';
import { unitPrice, deliveryFeeFor } from '../context/CartContext';
import { formatPrice, tr } from './format';
import { readJSON, writeJSON } from './storage';
import { whatsappLink } from './links';

const ORDERS_KEY = 'qambri.orders.v1';
const CUSTOMER_KEY = 'qambri.customer.v1';

// No 0/O/1/I so the number is easy to read out over the phone.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function newOrderNumber() {
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  return `QB-${[...bytes].map((b) => ALPHABET[b % ALPHABET.length]).join('')}`;
}

/** Builds a self-contained order snapshot (prices frozen at the moment of ordering). */
export function createOrder({ form, lines, lang }) {
  const items = lines.map((l) => ({
    itemId: l.itemId,
    qty: l.qty,
    removed: l.removed,
    extras: l.extras,
    sauces: l.sauces,
    note: l.note,
    unit: unitPrice(l),
  }));
  const subtotal = items.reduce((s, i) => s + i.unit * i.qty, 0);
  const deliveryFee = deliveryFeeFor(form.type);
  return {
    id: newOrderNumber(),
    createdAt: new Date().toISOString(),
    lang,
    type: form.type,
    customer: {
      name: form.name.trim(),
      phone: form.phone.trim(),
    },
    pickupTime: form.type === 'pickup' && form.when === 'later' ? form.time : null,
    delivery:
      form.type === 'delivery'
        ? { area: form.area.trim(), address: form.address.trim(), building: form.building.trim() }
        : null,
    notes: form.notes.trim(),
    payment: form.payment,
    items,
    subtotal,
    deliveryFee,
    total: subtotal + (deliveryFee || 0),
  };
}

export function saveOrder(order) {
  const orders = readJSON(ORDERS_KEY, []).filter((o) => o.id !== order.id);
  writeJSON(ORDERS_KEY, [order, ...orders].slice(0, 10));
}

export function findOrder(id) {
  return readJSON(ORDERS_KEY, []).find((o) => o.id === id) || null;
}

export const loadCustomer = () => readJSON(CUSTOMER_KEY, {});
export function saveCustomer(form) {
  const { name, phone, area, address, building } = form;
  writeJSON(CUSTOMER_KEY, { name, phone, area, address, building });
}

/** Item line in plain text, e.g. "2× Fish Burger — no lettuce, extra Torator". */
export function describeItem(i, lang) {
  const t = strings[lang];
  const item = itemsById[i.itemId];
  const ing = Object.fromEntries((item.ingredients || []).map((x) => [x.en, x]));
  const sep = lang === 'ar' ? '، ' : ', ';
  const bits = [];
  if (i.sauces?.length) bits.push(`${t.cart.sauces}: ${i.sauces.map((id) => tr(itemsById[id].name, lang)).join(sep)}`);
  for (const r of i.removed || []) bits.push(`${t.cart.without} ${tr(ing[r], lang)}`);
  for (const id of i.extras || []) bits.push(`${t.cart.extra} ${tr(itemsById[id].name, lang)}`);
  if (i.note) bits.push(`${t.cart.note}: ${i.note}`);
  const name = tr(item.name, lang) + (item.note ? ` (${tr(item.note, lang)})` : '');
  return { name, details: bits.join(sep) };
}

export function paymentLabel(order, lang) {
  const t = strings[lang];
  if (order.payment === 'whish') return t.checkout.whish;
  return order.type === 'delivery' ? t.checkout.cashDelivery : t.checkout.cashPickup;
}

/** The WhatsApp message the customer sends to the restaurant. */
export function orderMessage(order) {
  const lang = order.lang;
  const t = strings[lang];
  const w = t.wa;
  const p = (n) => formatPrice(n, lang);
  const out = [w.hello, '', `*${w.order}: ${order.id}*`, `${w.type}: ${t.order[order.type]}`, `${w.name}: ${order.customer.name}`, `${w.phone}: ${order.customer.phone}`];

  if (order.type === 'pickup') out.push(`${w.pickupTime}: ${order.pickupTime || t.order.asap}`);
  if (order.delivery) {
    out.push(`${w.area}: ${order.delivery.area}`, `${w.address}: ${order.delivery.address}`);
    if (order.delivery.building) out.push(`${w.building}: ${order.delivery.building}`);
  }
  if (order.notes) out.push(`${w.notes}: ${order.notes}`);

  out.push('', `*${w.items}*`);
  for (const i of order.items) {
    const { name, details } = describeItem(i, lang);
    // Arabic orders also carry the English menu name so the kitchen can match it at a glance.
    const en = lang === 'ar' ? ` (${itemsById[i.itemId].name.en})` : '';
    out.push(`• ${i.qty}× ${name}${en} — ${p(i.unit * i.qty)}`);
    if (details) out.push(`   ${details}`);
  }

  out.push('', `${w.subtotal}: ${p(order.subtotal)}`);
  if (order.type === 'delivery') out.push(`${w.delivery}: ${order.deliveryFee == null ? t.cart.deliveryTbd : p(order.deliveryFee)}`);
  out.push(`*${w.total}: ${p(order.total)}*`, `${w.payment}: ${paymentLabel(order, lang)}`);
  if (order.payment === 'whish') out.push(w.whishNote);
  return out.join('\n');
}

export const orderWhatsAppLink = (order) => whatsappLink(orderMessage(order));

/**
 * Sends the order to a backend if one is configured (config.endpoints.order).
 * Without one, WhatsApp is the delivery channel. Never throws.
 */
export async function submitOrder(order) {
  const url = restaurant.endpoints.order;
  if (!url) return { sent: false };
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(order),
    });
    return { sent: res.ok };
  } catch {
    return { sent: false };
  }
}
