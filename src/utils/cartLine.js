import { menuById, extraGroups } from '../data/menu'

// A cart line is { key, itemId, qty, options, removed, extras, note }.
// The key encodes the full configuration so identical picks merge.
export function lineKey({ itemId, options = {}, removed = [], extras = [], note = '' }) {
  const opts = Object.keys(options).sort().map((k) => `${k}:${options[k]}`).join(',')
  return [itemId, opts, [...removed].sort().join(','), [...extras].sort().join(','), note.trim()].join('|')
}

export function extraChoice(id) {
  for (const group of Object.values(extraGroups)) {
    const choice = group.choices.find((c) => c.id === id)
    if (choice) return choice
  }
  return null
}

export function unitPrice(line) {
  const item = menuById[line.itemId]
  if (!item) return 0
  const extras = (line.extras || []).reduce((sum, id) => sum + (extraChoice(id)?.price || 0), 0)
  return item.price + extras
}

export const lineTotal = (line) => unitPrice(line) * line.qty

// Human readable summary rows for a line, used by the cart, checkout,
// confirmation and the WhatsApp message.
export function lineDetails(line) {
  const item = menuById[line.itemId]
  if (!item) return []
  const rows = []
  for (const opt of item.options || []) {
    const choice = opt.choices.find((c) => c.id === line.options?.[opt.id])
    if (choice) rows.push(choice.label)
  }
  for (const id of line.extras || []) {
    const c = extraChoice(id)
    if (c) rows.push(`+ ${c.label}`)
  }
  for (const r of line.removed || []) rows.push(`No ${r.toLowerCase()}`)
  if (line.note?.trim()) rows.push(`Note: ${line.note.trim()}`)
  return rows
}
