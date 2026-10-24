import { itemsById } from '../data/menu';
import { cents } from './format';

/** Two lines with the same key are the same configuration and get merged. */
export function lineKey({ itemId, optionId, removed = [], addons = [], note = '' }) {
  return [itemId, optionId || '', [...removed].sort().join('|'), [...addons].sort().join('|'), note.trim()].join('::');
}

/**
 * Resolves a stored cart line against the current menu.
 * Returns null when the item no longer exists (menu was edited since).
 */
export function resolveLine(line) {
  const item = itemsById.get(line.itemId);
  if (!item) return null;
  const option = item.options?.choices.find((c) => c.id === line.optionId) || null;
  if (item.options && !option) return null;
  const addons = (item.addons || []).filter((a) => line.addons?.includes(a.id));
  const unitPrice = cents((option ? option.price : item.price) + addons.reduce((sum, a) => sum + a.price, 0));
  return {
    ...line,
    item,
    option,
    addons,
    removed: (line.removed || []).filter((r) => item.removable?.includes(r)),
    unitPrice,
    total: cents(unitPrice * line.qty),
  };
}

/** One-line summary of choices, e.g. "Plate · No pickles". */
export function describeLine(line) {
  const parts = [];
  if (line.option) parts.push(line.option.name);
  for (const a of line.addons) parts.push(`+ ${a.name}`);
  for (const r of line.removed) parts.push(`No ${r.toLowerCase()}`);
  return parts;
}
