import { categories, menu, type MenuItem } from '../data/menu'

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim()

const catName = new Map(categories.map((c) => [c.id, c.name]))
// "sp mango" is how the restaurant writes "special mango", so both spellings match.
const index = menu.map((item) => ({
  item,
  text: norm(`${item.name} ${item.name.replace(/^Special /, 'sp ')} ${item.description ?? ''} ${catName.get(item.category) ?? ''}`),
}))

/** Every word of the query must appear somewhere in the item; names rank above descriptions. */
export function searchMenu(query: string): MenuItem[] {
  const words = norm(query).split(' ').filter(Boolean)
  if (!words.length) return []
  return index
    .filter(({ text }) => words.every((w) => text.includes(w)))
    .map(({ item, text }) => ({ item, score: words.reduce((n, w) => n + (norm(item.name).includes(w) ? 2 : 0) + (text.startsWith(w) ? 1 : 0), 0) }))
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item)
}
