import { addOns, itemsById } from '../data/menu.js'

const addOnById = Object.fromEntries(addOns.map((a) => [a.id, a]))

/** Unit price of a configured line: base price + add-ons (option choices are free). */
export function unitPrice(line) {
  const base = itemsById[line.itemId]?.price ?? 0
  return base + (line.addOns || []).reduce((sum, id) => sum + (addOnById[id]?.price ?? 0), 0)
}

export const lineTotal = (line) => unitPrice(line) * line.qty

/** Two lines with the same configuration merge into one. */
export const lineKey = (line) =>
  [line.itemId, JSON.stringify(line.options || {}), [...(line.addOns || [])].sort().join(','), [...(line.removed || [])].sort().join(',')].join('|')

/** Human-readable modifiers: ["Flavor: Nutella", "+ 1 Cup Sauce", "No Pickles"]. */
export function lineDetails(line) {
  const item = itemsById[line.itemId]
  const out = []
  for (const group of item?.options || []) {
    const choice = group.choices.find((c) => c.id === line.options?.[group.id])
    if (choice) out.push(`${group.name.replace(/^Choose /, '')}: ${choice.name}`)
  }
  for (const id of line.addOns || []) if (addOnById[id]) out.push(`+ ${addOnById[id].name}`)
  for (const r of line.removed || []) out.push(`No ${r.toLowerCase()}`)
  return out
}

export { addOnById }
