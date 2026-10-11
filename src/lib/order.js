import { restaurant } from '../config/restaurant';
import { readJSON, writeJSON } from './storage';
import { describeConfig } from './cart';
import { formatPrice } from './format';
import en from '../i18n/en';
import ar from '../i18n/ar';

const STORAGE_KEY = 'osnack.orders.v1';

export function createOrderNumber(date = new Date()) {
  const stamp = `${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `OS-${stamp}-${rand}`;
}

export function saveOrder(order) {
  const orders = readJSON(STORAGE_KEY, []);
  writeJSON(STORAGE_KEY, [order, ...orders.filter((o) => o.id !== order.id)].slice(0, 10));
}

export function getOrder(id) {
  return readJSON(STORAGE_KEY, []).find((o) => o.id === id) ?? null;
}

/** Snapshot cart lines so the order stays readable if the menu changes later. */
export function snapshotLines(lines) {
  return lines.map((l) => {
    const d = {
      en: describeConfig(l.item, l.config, 'en'),
      ar: describeConfig(l.item, l.config, 'ar'),
    };
    return {
      itemId: l.itemId,
      name: l.item.name,
      image: l.item.image,
      qty: l.qty,
      unit: l.unit,
      total: l.unit * l.qty,
      options: {
        en: { ...d.en, choice: d.en.choice?.en ?? null },
        ar: { ...d.ar, choice: d.ar.choice?.ar ?? null },
      },
    };
  });
}

export function paymentLabel(order, lang) {
  const t = (lang === 'ar' ? ar : en).checkout;
  if (order.payment === 'whish') return t.whish;
  return order.type === 'delivery' ? t.cashDelivery : t.cashPickup;
}

/** Plain-text order for WhatsApp, in the customer's language. */
export function orderMessage(order, lang) {
  const dict = lang === 'ar' ? ar : en;
  const m = dict.whatsappMsg;
  const sep = lang === 'ar' ? '، ' : ', ';
  const price = (n) => formatPrice(n, lang);
  const out = [];

  out.push(`*${m.order} — ${restaurant.name}*`);
  out.push(`#${order.id}`);
  out.push('');
  out.push(`${m.customer}: ${order.customer.name}`);
  out.push(`${m.phone}: ${order.customer.phone}`);
  out.push(`${m.type}: ${order.type === 'delivery' ? dict.checkout.delivery : dict.checkout.pickup}`);

  if (order.type === 'pickup') {
    out.push(`${m.pickupTime}: ${order.pickup.asap ? dict.checkout.asap : order.pickup.time}`);
  } else {
    out.push(`${m.area}: ${order.delivery.area}`);
    out.push(`${m.address}: ${order.delivery.address}`);
    if (order.delivery.floor) out.push(`${m.floor}: ${order.delivery.floor}`);
  }
  if (order.notes) out.push(`${m.notes}: ${order.notes}`);

  out.push('');
  out.push(`*${m.items}*`);
  order.lines.forEach((l) => {
    const o = l.options[lang];
    out.push(`${l.qty} × ${l.name[lang] ?? l.name.en} — ${price(l.total)}`);
    if (o.choice) out.push(`   ${m.option}: ${o.choice}`);
    if (o.extras.length) out.push(`   ${m.extras}: ${o.extras.join(sep)}`);
    if (o.removed.length) out.push(`   ${m.without}: ${o.removed.join(sep)}`);
    if (o.note) out.push(`   ${m.itemNote}: ${o.note}`);
  });

  out.push('');
  out.push(`${m.subtotal}: ${price(order.subtotal)}`);
  if (order.type === 'delivery') {
    out.push(`${m.deliveryFee}: ${order.deliveryFee == null ? dict.cart.deliveryTbc : price(order.deliveryFee)}`);
  }
  out.push(`*${m.total}: ${price(order.total)}${order.type === 'delivery' && order.deliveryFee == null ? ` ${dict.cart.totalPlusDelivery}` : ''}*`);
  out.push(`${m.payment}: ${paymentLabel(order, lang)}`);

  return out.join('\n');
}
