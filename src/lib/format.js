import { restaurant } from '../config/restaurant'

/** 150000 → "150,000 L.L." / "150,000 ل.ل." (Western digits, as printed on the menu). */
export function formatPrice(amount, lang = 'en') {
  const n = Math.round(amount).toLocaleString('en-US')
  return `${n} ${restaurant.currency.symbol[lang] ?? restaurant.currency.symbol.en}`
}

export function formatTime(date, lang = 'en') {
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-LB-u-nu-latn' : 'en-GB', { hour: '2-digit', minute: '2-digit' }).format(date)
}

export function formatDateTime(date, lang = 'en') {
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-LB-u-nu-latn' : 'en-GB', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  }).format(date)
}

/** Lebanese numbers: accepts 70123456, 03 123 456, +961 70 123 456, 00961… */
export function normalizeLebanesePhone(raw) {
  let d = String(raw).replace(/[^\d+]/g, '')
  if (d.startsWith('+')) d = d.slice(1)
  if (d.startsWith('00')) d = d.slice(2)
  if (d.startsWith('961')) d = d.slice(3)
  if (d.startsWith('0')) d = d.slice(1)
  return d
}

export function isValidPhone(raw) {
  const local = normalizeLebanesePhone(raw)
  // Lebanese mobile/landline numbers are 7–8 digits after the country code;
  // allow longer international numbers too.
  if (/^\d{7,8}$/.test(local)) return true
  return /^\+?\d{9,15}$/.test(String(raw).replace(/[\s-]/g, ''))
}
