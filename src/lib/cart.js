import { itemsById } from '../data/menu';

/** Unit price of a configured item (base + selected extras). */
export function unitPrice(item, config) {
  const extras = (item.extras ?? []).filter((e) => config.extras?.includes(e.id));
  return item.price + extras.reduce((sum, e) => sum + e.price, 0);
}

/** Lines with the same item and identical options merge into one. */
export function lineKey(itemId, config) {
  return [
    itemId,
    [...(config.extras ?? [])].sort().join(','),
    [...(config.removed ?? [])].sort().join(','),
    config.choice ?? '',
    (config.note ?? '').trim().toLowerCase(),
  ].join('|');
}

/** Resolve a stored cart line against the current menu (drops removed items). */
export function hydrateLine(line) {
  const item = itemsById[line.itemId];
  if (!item || item.promo) return null;
  const config = {
    extras: (line.config?.extras ?? []).filter((id) => item.extras?.some((e) => e.id === id)),
    removed: (line.config?.removed ?? []).filter((id) => item.removable?.some((r) => r.id === id)),
    choice: item.choices?.options.some((o) => o.id === line.config?.choice) ? line.config.choice : null,
    note: line.config?.note ?? '',
  };
  const qty = Math.min(99, Math.max(1, Number(line.qty) || 1));
  return { ...line, qty, config, item, unit: unitPrice(item, config) };
}

/** Human-readable option summary for a line: { extras, removed, choice, note } in one language. */
export function describeConfig(item, config, lang) {
  const pick = (v) => v[lang] ?? v.en;
  return {
    choice: item.choices?.options.find((o) => o.id === config.choice)?.name,
    extras: (item.extras ?? []).filter((e) => config.extras.includes(e.id)).map((e) => pick(e.name)),
    removed: (item.removable ?? []).filter((r) => config.removed.includes(r.id)).map((r) => pick(r.name)),
    note: config.note?.trim() ?? '',
  };
}
