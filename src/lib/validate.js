/** Accepts Lebanese numbers (7–8 digits, optional +961 / 00961) and international numbers. Arabic-Indic digits are allowed. */
export function isValidPhone(value) {
  const arabicToLatin = value.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
  const digits = arabicToLatin.replace(/[\s\-().]/g, '')
  if (/^(\+|00)961\d{7,8}$/.test(digits)) return true
  if (/^\d{7,8}$/.test(digits)) return true
  // International numbers for visitors from abroad
  return /^(\+|00)\d{8,15}$/.test(digits)
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}
