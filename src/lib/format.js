const CURRENCY_LABEL = { LBP: 'ل.ل', USD: '$' }

const group = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })

/** 300000 LBP -> "300,000 ل.ل" · 25 USD -> "25$" */
export function formatPrice({ amount, currency }) {
  const value = group.format(amount)
  return currency === 'USD' ? `${value}$` : `${value} ${CURRENCY_LABEL[currency] ?? currency}`
}

/**
 * Totals are kept per currency because the menu mixes LBP and USD prices
 * and no exchange rate was provided. Returns e.g. [{amount, currency}, ...]
 */
export function sumByCurrency(lines) {
  const totals = {}
  for (const { amount, currency } of lines) {
    totals[currency] = (totals[currency] ?? 0) + amount
  }
  return ['LBP', 'USD']
    .filter((c) => totals[c])
    .map((currency) => ({ amount: totals[currency], currency }))
}

export function formatTotals(totals) {
  if (!totals.length) return formatPrice({ amount: 0, currency: 'LBP' })
  return totals.map(formatPrice).join(' + ')
}
