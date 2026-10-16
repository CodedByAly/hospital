import { restaurant } from '../data/restaurant';

// Matches the way Talia prints prices: "4.50 $"
export function formatPrice(value) {
  if (value == null) return '';
  return `${value.toFixed(2)} ${restaurant.currency}`;
}

export function pluralize(n, one, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}
