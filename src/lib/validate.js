// Lebanese numbers: 7–8 local digits (e.g. 70 346 913, 03 123 456), optionally prefixed with 961 / +961 / 00961.
export function isValidPhone(value) {
  let digits = value.replace(/\D/g, '')
  if (digits.startsWith('00961')) digits = digits.slice(5)
  else if (digits.startsWith('961')) digits = digits.slice(3)
  return digits.length >= 7 && digits.length <= 8
}

export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
