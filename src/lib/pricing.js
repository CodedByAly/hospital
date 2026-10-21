import { findItem } from '../data/menu.js'

// selections: { [groupId]: optionId | optionId[] }
export function unitPrice(item, selections = {}) {
  let base = item.price
  let extras = 0
  for (const group of item.groups ?? []) {
    const picked = selections[group.id]
    if (group.type === 'single') {
      const option = group.options.find((o) => o.id === picked)
      if (option?.price != null) base = option.price
      if (option?.add) extras += option.add
    } else {
      for (const option of group.options) {
        if (picked?.includes(option.id)) extras += option.add ?? 0
      }
    }
  }
  return base + extras
}

export function defaultSelections(item) {
  const selections = {}
  for (const group of item.groups ?? []) {
    // Sizes default to the first option; "choose your..." groups start empty so the customer picks.
    if (group.type === 'single') selections[group.id] = group.id === 'portion' ? group.options[0].id : null
    else selections[group.id] = []
  }
  return selections
}

export function missingGroups(item, selections) {
  return (item.groups ?? []).filter((g) => g.type === 'single' && !selections[g.id])
}

// Human-readable lines for the cart, checkout and WhatsApp message.
export function describeLine(line) {
  const item = findItem(line.itemId)
  if (!item) return { options: [], removed: [] }
  const parts = []
  for (const group of item.groups ?? []) {
    const picked = line.selections?.[group.id]
    if (group.type === 'single') {
      const option = group.options.find((o) => o.id === picked)
      if (option && !(group.id === 'portion' && option.id === 'full')) parts.push(option.label)
    } else {
      group.options.filter((o) => picked?.includes(o.id)).forEach((o) => parts.push(o.label))
    }
  }
  const removed = (line.removed ?? []).map((r) => `No ${r.toLowerCase()}`)
  return { options: parts, removed }
}

export function lineTotal(line) {
  const item = findItem(line.itemId)
  return item ? unitPrice(item, line.selections) * line.qty : 0
}
