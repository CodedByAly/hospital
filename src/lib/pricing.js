// Price of one unit of an item with the chosen options and add-ons.
export function unitPrice(item, selection = {}) {
  if (item.price == null) return null;
  let total = item.price;
  for (const group of item.options ?? []) {
    const choice = group.choices.find((c) => c.id === selection.options?.[group.id]);
    if (choice?.price) total += choice.price;
  }
  for (const addon of item.addons ?? []) {
    if (selection.addons?.includes(addon.id)) total += addon.price ?? 0;
  }
  return Math.round(total * 100) / 100;
}

// Human-readable list of what was picked, e.g. ["Large", "+ Extra cheese"].
export function describeSelection(item, selection = {}) {
  const parts = [];
  for (const group of item.options ?? []) {
    const choice = group.choices.find((c) => c.id === selection.options?.[group.id]);
    if (choice) parts.push(choice.label);
  }
  for (const addon of item.addons ?? []) {
    if (selection.addons?.includes(addon.id)) parts.push(`+ ${addon.label}`);
  }
  return parts;
}

export function needsChoices(item) {
  return (item.options ?? []).some((g) => g.required);
}
