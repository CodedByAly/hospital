import restaurant from '../config/restaurant';

const numberFormat = new Intl.NumberFormat('en-US');

/** 550000 → "550,000 L.L" (or "550,000 ل.ل" in Arabic). Lebanese menus use Western digits. */
export function formatPrice(amount, lang = 'en') {
  return `${numberFormat.format(amount)} ${restaurant.currency[lang] || restaurant.currency.en}`;
}

/** Picks the right language from a { en, ar } object, falling back to English. */
export function tr(value, lang) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[lang] ?? value.en ?? '';
}

/** Strips accents and Arabic diacritics so search is forgiving. */
export function normalize(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ًͯ-ٰٟ]/g, '')
    .replace(/[إأآا]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .trim();
}

/** Lebanese phone numbers: 7–8 local digits, with or without +961 / 00961. */
export function isValidLebanesePhone(value) {
  let digits = String(value).replace(/[^\d]/g, '');
  if (digits.startsWith('00961')) digits = digits.slice(5);
  else if (digits.startsWith('961')) digits = digits.slice(3);
  return digits.length === 7 || digits.length === 8;
}

export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim());
