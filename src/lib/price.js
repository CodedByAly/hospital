import { ordering } from '../config/restaurant'

// Work in cents to avoid floating point drift (1.2 + 1.2 + 1.2 ...).
export const toCents = (dollars = 0) => Math.round(dollars * 100)

export function formatPrice(cents) {
  const value = cents / 100
  const text = Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0$/, '')
  return `${text}${ordering.currency}`
}

/** Default selection for an item: first option of every required single-choice group. */
export function defaultSelection(item) {
  const selection = {}
  for (const group of item.groups ?? []) {
    if (group.type === 'single') {
      const plain = group.options.find((o) => o.plain)
      selection[group.id] = group.required && plain ? plain.id : null
    } else {
      selection[group.id] = []
    }
  }
  return selection
}

export function unitPriceCents(item, selection = {}) {
  let cents = toCents(item.price)
  for (const group of item.groups ?? []) {
    const picked = selection[group.id]
    const ids = Array.isArray(picked) ? picked : picked ? [picked] : []
    for (const option of group.options) {
      if (ids.includes(option.id) && group.type !== 'remove') cents += toCents(option.price)
    }
  }
  return cents
}

export function missingRequired(item, selection = {}) {
  return (item.groups ?? []).filter((g) => g.type === 'single' && g.required && !selection[g.id])
}

/**
 * Price variations printed under an item in the menu list, built from the
 * groups flagged `listed`. e.g. The Smasher -> Triple patty 11$, Combo 13$, ...
 */
export function listedVariants(item, lang) {
  const groups = (item.groups ?? []).filter((g) => g.listed)
  if (!groups.length) return []
  let combos = [{ labels: [], cents: toCents(item.price) }]
  for (const group of groups) {
    combos = combos.flatMap((c) =>
      group.options.map((o) => ({
        labels: o.plain ? c.labels : [...c.labels, o.name[lang]],
        cents: c.cents + toCents(o.price),
      })),
    )
  }
  return combos
    .filter((c) => c.labels.length)
    .sort((a, b) => a.cents - b.cents)
    .map((c) => ({ label: c.labels.join(' · '), cents: c.cents }))
}

/** Human-readable summary lines for a cart line's chosen options. */
export function describeSelection(item, selection = {}, lang = 'en') {
  const chosen = []
  const removed = []
  for (const group of item.groups ?? []) {
    const picked = selection[group.id]
    const ids = Array.isArray(picked) ? picked : picked ? [picked] : []
    for (const option of group.options) {
      if (!ids.includes(option.id)) continue
      if (group.type === 'remove') removed.push(option.name[lang])
      else if (!option.plain) chosen.push(option.name[lang])
    }
  }
  return { chosen, removed }
}
