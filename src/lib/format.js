import { restaurant } from '../config/restaurant';

export const numberFormat = new Intl.NumberFormat('en-US');

export function formatPrice(amount, lang) {
  return `${numberFormat.format(amount)} ${restaurant.currency[lang] ?? restaurant.currency.en}`;
}

export function formatDateTime(iso, lang) {
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-LB-u-nu-latn' : 'en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export const localized = (value, lang) => (value ? value[lang] ?? value.en : '');
