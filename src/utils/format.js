import { restaurant } from '../config/restaurant'

const { currencySymbol } = restaurant.ordering

// Menu prices are whole dollars, so cents only show when needed.
export function money(value) {
  const n = Number(value) || 0
  const str = Number.isInteger(n) ? String(n) : n.toFixed(2)
  return `${str}${currencySymbol}`
}

export const itemTitle = (item) => item.fullName || item.name
