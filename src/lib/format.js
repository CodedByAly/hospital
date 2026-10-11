import { site } from '../config/site.js';

// Prices are handled in cents internally to avoid floating point drift (1.35 + 1.7 ...).
export const toCents = (amount) => Math.round(amount * 100);

const moneyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: site.currency,
  minimumFractionDigits: 2,
});

export const formatCents = (cents) => moneyFormat.format(cents / 100);
export const formatPrice = (amount) => formatCents(toCents(amount));

// '+96171510106' -> '+961 71 510 106'
export function formatPhone(international) {
  const digits = international.replace(/\D/g, '');
  if (digits.startsWith('961')) {
    const local = digits.slice(3);
    // 7-digit numbers (03 xxx xxx, landlines) have a one-digit prefix; 8-digit mobiles have two.
    const cut = local.length === 7 ? 1 : 2;
    return `+961 ${local.slice(0, cut)} ${local.slice(cut, cut + 3)} ${local.slice(cut + 3)}`.trim();
  }
  return international;
}

export const telHref = (international) => `tel:${international.replace(/[^\d+]/g, '')}`;

export function whatsappHref(international, message) {
  const digits = international.replace(/\D/g, '');
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

export const mapsHref = (branch) =>
  branch.mapsUrl ||
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.legalName} ${branch.address}`)}`;

/*
 * Lebanese numbers: accepts 03 123 456, 71 123 456, +961 71 123 456, 00961...
 * Returns '+961XXXXXXXX' or null when the number doesn't look valid.
 */
export function normalizeLebanesePhone(input) {
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('00961')) digits = digits.slice(5);
  else if (digits.startsWith('961')) digits = digits.slice(3);
  if (digits.startsWith('0')) digits = digits.slice(1);
  if (!/^\d{7,8}$/.test(digits)) return null;
  return `+961${digits}`;
}

export function formatTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
