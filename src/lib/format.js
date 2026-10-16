import { restaurant } from '../data/restaurant';

// Matches the way Talia prints prices: "4.50 $"
export function formatPrice(value) {
  if (value == null) return '';
  return `${value.toFixed(2)} ${restaurant.currency}`;
}

export function makeOrderNumber(date = new Date()) {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const rand = Math.floor(Math.random() * 900 + 100);
  return `TL-${mm}${dd}-${rand}`;
}

export function pluralize(n, one, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}
