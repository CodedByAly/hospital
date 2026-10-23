import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { getItem } from '../data/menu'
import { load, save } from '../lib/storage'
import { unitPriceCents } from '../lib/price'
import { ordering } from '../config/restaurant'

const STORAGE_KEY = 'moods:cart'
const CartContext = createContext(null)

/** Stable key for an item + its chosen options, so identical lines merge. */
export function lineKey(itemId, selection = {}) {
  const normalized = Object.keys(selection)
    .sort()
    .map((group) => {
      const value = selection[group]
      return `${group}:${Array.isArray(value) ? [...value].sort().join(',') : value ?? ''}`
    })
    .join('|')
  return `${itemId}#${normalized}`
}

function addTo(lines, { itemId, selection, qty }) {
  const key = lineKey(itemId, selection)
  const existing = lines.find((l) => l.key === key)
  if (existing) return lines.map((l) => (l.key === key ? { ...l, qty: Math.min(l.qty + qty, 99) } : l))
  return [...lines, { key, itemId, selection, qty }]
}

function reducer(lines, action) {
  switch (action.type) {
    case 'add':
      return addTo(lines, action)
    case 'replace': {
      const index = lines.findIndex((l) => l.key === action.key)
      const rest = lines.filter((l) => l.key !== action.key)
      const next = addTo(rest, action)
      // Keep the edited line where it was in the list.
      if (index >= 0 && next.length > rest.length) {
        const edited = next[next.length - 1]
        next.splice(next.length - 1, 1)
        next.splice(index, 0, edited)
      }
      return next
    }
    case 'setQty':
      return action.qty <= 0
        ? lines.filter((l) => l.key !== action.key)
        : lines.map((l) => (l.key === action.key ? { ...l, qty: Math.min(action.qty, 99) } : l))
    case 'remove':
      return lines.filter((l) => l.key !== action.key)
    case 'clear':
      return []
    default:
      return lines
  }
}

function restore() {
  const stored = load(STORAGE_KEY, [])
  if (!Array.isArray(stored)) return []
  // Drop anything that no longer exists on the menu.
  return stored.filter((l) => l && getItem(l.itemId) && l.qty > 0)
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, undefined, restore)

  useEffect(() => save(STORAGE_KEY, lines), [lines])

  const value = useMemo(() => {
    // Prices are always read from the current menu, never from storage.
    const priced = lines.map((l) => {
      const item = getItem(l.itemId)
      const unitCents = unitPriceCents(item, l.selection)
      return { ...l, item, unitCents, totalCents: unitCents * l.qty }
    })
    const subtotalCents = priced.reduce((sum, l) => sum + l.totalCents, 0)
    const deliveryCents = ordering.deliveryFee == null ? null : Math.round(ordering.deliveryFee * 100)
    return {
      lines: priced,
      count: priced.reduce((sum, l) => sum + l.qty, 0),
      subtotalCents,
      deliveryCents,
      totalCents: subtotalCents + (deliveryCents ?? 0),
      add: (itemId, selection, qty = 1) => dispatch({ type: 'add', itemId, selection, qty }),
      replace: (key, itemId, selection, qty) => dispatch({ type: 'replace', key, itemId, selection, qty }),
      setQty: (key, qty) => dispatch({ type: 'setQty', key, qty }),
      remove: (key) => dispatch({ type: 'remove', key }),
      clear: () => dispatch({ type: 'clear' }),
    }
  }, [lines])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
