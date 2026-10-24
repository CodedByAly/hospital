// Accent- and case-insensitive matching so "frappe" finds "Frappé".
export const normalize = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

export function filterMenu(categories, query) {
  const q = normalize(query)
  if (!q) return categories
  return categories
    .map((cat) => {
      if (normalize(cat.title).includes(q)) return cat
      const items = cat.items.filter((item) => normalize(item.name).includes(q))
      return items.length ? { ...cat, items, addons: null } : null
    })
    .filter(Boolean)
}
