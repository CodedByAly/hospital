import { addonGroups, ingredients, itemsById } from '../data/menu';

/**
 * A cart line stores only ids. Prices are always recomputed from the menu data,
 * so a price change in data/menu.js is reflected in carts that were saved earlier.
 *
 * selection: { variant?: string, choice?: string, addons: string[], removed: string[], note: string }
 */

export function emptySelection(item) {
  return {
    variant: item.variants ? item.variants.options[0].id : undefined,
    choice: undefined,
    addons: [],
    removed: [],
    note: '',
  };
}

export function addonOptions(item) {
  return (item.addons || []).flatMap((groupId) =>
    addonGroups[groupId].options.map((option) => ({ ...option, groupId })),
  );
}

export function unitPrice(item, selection) {
  let price = item.price;
  if (item.variants && selection.variant) {
    const variant = item.variants.options.find((o) => o.id === selection.variant);
    if (variant) price = variant.price;
  }
  const addons = addonOptions(item);
  (selection.addons || []).forEach((id) => {
    const addon = addons.find((o) => o.id === id);
    if (addon) price += addon.price;
  });
  return Math.round(price * 100) / 100;
}

/** Same item + same choices = same line, so quantities merge instead of duplicating. */
export function lineSignature(itemId, selection) {
  return JSON.stringify([
    itemId,
    selection.variant || '',
    selection.choice || '',
    [...(selection.addons || [])].sort(),
    [...(selection.removed || [])].sort(),
    (selection.note || '').trim(),
  ]);
}

/** Human-readable modifiers for a line, in the given language. */
export function describeSelection(item, selection, lang) {
  const pick = (value) => (value ? value[lang] || value.en : '');
  const parts = { options: [], addons: [], removed: [], note: (selection.note || '').trim() };

  if (item.variants && selection.variant) {
    const variant = item.variants.options.find((o) => o.id === selection.variant);
    // The default (first) variant is implied, only show the alternative.
    if (variant && variant.id !== item.variants.options[0].id) parts.options.push(pick(variant.name));
  }
  if (item.choices && selection.choice) {
    const choice = item.choices.options.find((o) => o.id === selection.choice);
    if (choice) parts.options.push(pick(choice.name));
  }
  const addons = addonOptions(item);
  (selection.addons || []).forEach((id) => {
    const addon = addons.find((o) => o.id === id);
    if (addon) parts.addons.push({ name: pick(addon.name), price: addon.price });
  });
  (selection.removed || []).forEach((id) => {
    if (ingredients[id]) parts.removed.push(pick(ingredients[id]));
  });
  return parts;
}

/** Drops lines whose item no longer exists, fixes invalid selections. */
export function sanitizeLines(lines) {
  if (!Array.isArray(lines)) return [];
  return lines.filter((line) => {
    const item = itemsById[line?.itemId];
    if (!item || !Number.isInteger(line.qty) || line.qty < 1) return false;
    if (item.choices && !item.choices.options.some((o) => o.id === line.selection?.choice)) return false;
    return true;
  });
}
