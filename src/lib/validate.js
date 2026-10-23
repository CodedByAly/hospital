/** Lebanese numbers: 8 digits (e.g. 03 123 456, 81 810 409), with or without +961. */
export function normalizeLebanesePhone(value = '') {
  let digits = value.replace(/\D/g, '')
  if (digits.startsWith('00961')) digits = digits.slice(5)
  else if (digits.startsWith('961')) digits = digits.slice(3)
  if (digits.length === 7) digits = `0${digits}` // 3 123 456 -> 03 123 456
  return /^(0[1-9]|7[0-9]|8[1-9])\d{6}$/.test(digits) ? digits : null
}

export const isEmail = (value = '') => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
