import { getItem, type MenuItem, type Size } from '../data/menu'

export type CartLine = { key: string; itemId: string; sizeId: string | null; notes: string; qty: number }

export type ResolvedLine = CartLine & { item: MenuItem; size: Size | null; unitPrice: number; lineTotal: number }

export const unitPrice = (item: MenuItem, sizeId: string | null) =>
  item.sizes ? (item.sizes.find((s) => s.id === sizeId) ?? item.sizes[0]).price : (item.price ?? 0)

/** Lines with the same item, size and note are merged. */
export const lineKey = (itemId: string, sizeId: string | null, notes: string) =>
  [itemId, sizeId ?? '', notes.trim().toLowerCase()].join('|')

export function resolveLine(line: CartLine): ResolvedLine | null {
  const item = getItem(line.itemId)
  if (!item) return null
  const size = item.sizes?.find((s) => s.id === line.sizeId) ?? null
  if (item.sizes && !size) return null
  const price = unitPrice(item, line.sizeId)
  return { ...line, item, size, unitPrice: price, lineTotal: price * line.qty }
}

export const lineLabel = (line: ResolvedLine) => (line.size ? `${line.item.name} (${line.size.label})` : line.item.name)
