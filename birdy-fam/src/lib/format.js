const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export const formatPrice = (value) => usd.format(value)

/** Digits only, trims the +961 / 00961 prefix and leading zero. */
export function normalizeLebanesePhone(value) {
  let d = String(value).replace(/\D/g, '')
  if (d.startsWith('00961')) d = d.slice(5)
  else if (d.startsWith('961')) d = d.slice(3)
  if (d.startsWith('0')) d = d.slice(1)
  return d
}

/** Lebanese numbers are 7 digits (03 xx xx xx) or 8 digits (76 xxx xxx, 01 xxx xxx). */
export const isValidLebanesePhone = (value) => /^\d{7,8}$/.test(normalizeLebanesePhone(value))
