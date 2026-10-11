/** 8 → "$8.00" — the menu prints every price with cents. */
export function formatPrice(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

/** Lower-cases and strips accents so "jalapeno" finds "jalapeño". */
export function normalize(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, '')
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
