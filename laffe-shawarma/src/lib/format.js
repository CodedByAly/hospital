const group = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

/** 600000 -> "600,000 LBP" / "600,000 ل.ل". All menu prices are in Lebanese pounds. */
export function formatPrice(amount, lang = 'en') {
  return `${group.format(amount)} ${lang === 'ar' ? 'ل.ل' : 'LBP'}`
}
