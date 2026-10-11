const nf = new Intl.NumberFormat('en-US');

/** 650000 → "650,000 L.L", 10 (USD) → "$10". */
export function formatPrice(amount, currency = 'LBP') {
  if (currency === 'USD') return `$${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
  return `${nf.format(amount)} L.L`;
}

/**
 * Totals are kept per currency: offers can be priced in dollars while the
 * menu is in L.L, and the site never invents an exchange rate.
 * { LBP: 1300000, USD: 10 } → "1,300,000 L.L + $10"
 */
export function formatTotals(totals) {
  const parts = [];
  if (totals.LBP) parts.push(formatPrice(totals.LBP, 'LBP'));
  if (totals.USD) parts.push(formatPrice(totals.USD, 'USD'));
  return parts.length ? parts.join(' + ') : formatPrice(0, 'LBP');
}

export const addTotals = (a, b) => ({ LBP: (a.LBP || 0) + (b.LBP || 0), USD: (a.USD || 0) + (b.USD || 0) });

export function normalize(text) {
  return String(text).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, '').trim();
}

export function isValidLebanesePhone(value) {
  let digits = String(value).replace(/[^\d]/g, '');
  if (digits.startsWith('00961')) digits = digits.slice(5);
  else if (digits.startsWith('961')) digits = digits.slice(3);
  return digits.length === 7 || digits.length === 8;
}

export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim());
