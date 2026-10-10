import { getItem } from '../data/menu'
import { formatPrice } from './format'

/** Default configuration when an item is first opened. */
export function defaultConfig(item) {
  return {
    sizeId: item.sizes ? item.sizes[0].id : null,
    options: {},
    extras: [],
    removed: [],
    notes: '',
  }
}

export const extrasForSize = (item, sizeId) => (item.extras ?? []).filter((x) => !x.sizes || x.sizes.includes(sizeId))

export function missingOptions(item, config) {
  return (item.options ?? []).filter((group) => group.required && !config.options[group.id])
}

/** Unit price for an item with a given configuration. */
export function unitPrice(item, config) {
  const base = item.sizes ? (item.sizes.find((s) => s.id === config.sizeId) ?? item.sizes[0]).price : item.price
  const extras = extrasForSize(item, config.sizeId)
    .filter((x) => config.extras.includes(x.id))
    .reduce((sum, x) => sum + x.price, 0)
  return base + extras
}

/** Two lines with the same signature are merged into one. */
export function signature(itemId, config) {
  return JSON.stringify([
    itemId,
    config.sizeId,
    Object.keys(config.options).sort().map((k) => [k, config.options[k]]),
    [...config.extras].sort(),
    [...config.removed].sort(),
    config.notes.trim().toLowerCase(),
  ])
}

/** Expands a stored line into everything the UI needs. Returns null if the item no longer exists. */
export function resolveLine(line) {
  const item = getItem(line.itemId)
  if (!item) return null
  const config = line.config
  const size = item.sizes?.find((s) => s.id === config.sizeId) ?? null
  if (item.sizes && !size) return null
  const choices = (item.options ?? [])
    .map((group) => {
      const choice = group.choices.find((c) => c.id === config.options[group.id])
      return choice ? { group, choice } : null
    })
    .filter(Boolean)
  const extras = extrasForSize(item, config.sizeId).filter((x) => config.extras.includes(x.id))
  const removed = (item.removable ?? []).filter((r) => config.removed.includes(r.id))
  const price = unitPrice(item, config)
  return { ...line, item, size, choices, extras, removed, unitPrice: price, lineTotal: price * line.qty }
}

/** "Large · Mango · + Add syrup · Without onions · Note: …" for a resolved cart line. */
export function lineDetailParts(line, t, pick, lang) {
  const parts = []
  if (line.size) parts.push(pick(line.size.label))
  line.choices.forEach(({ choice }) => parts.push(pick(choice.label)))
  line.extras.forEach((x) => parts.push(`+ ${pick(x.label)} (${formatPrice(x.price, lang)})`))
  if (line.removed.length) parts.push(`${t('cart.without')}: ${line.removed.map((r) => pick(r.label)).join(', ')}`)
  return parts
}

