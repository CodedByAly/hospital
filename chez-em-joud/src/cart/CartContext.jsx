import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { itemsById } from '../data/menu'

const STORAGE_KEY = 'cej:cart'
const CartContext = createContext(null)

// Two lines with the same item and the same choices are merged into one.
export const lineKey = ({ id, removed = [], flavor = '', note = '' }) =>
  [id, [...removed].sort().join('|'), flavor.trim().toLowerCase(), note.trim().toLowerCase()].join('::')

function reducer(lines, action) {
  switch (action.type) {
    case 'hydrate':
      return action.lines
    case 'add': {
      const key = lineKey(action.line)
      const existing = lines.find((l) => l.key === key)
      if (existing) return lines.map((l) => (l.key === key ? { ...l, qty: Math.min(99, l.qty + action.line.qty) } : l))
      return [...lines, { ...action.line, key }]
    }
    case 'replace': {
      // Editing a line: swap it in place, merging if it now matches another line.
      const key = lineKey(action.line)
      const others = lines.filter((l) => l.key !== action.key)
      const twin = others.find((l) => l.key === key)
      if (twin) return others.map((l) => (l.key === key ? { ...l, qty: Math.min(99, l.qty + action.line.qty) } : l))
      return lines.map((l) => (l.key === action.key ? { ...action.line, key } : l))
    }
    case 'qty':
      return action.qty <= 0
        ? lines.filter((l) => l.key !== action.key)
        : lines.map((l) => (l.key === action.key ? { ...l, qty: Math.min(99, action.qty) } : l))
    case 'remove':
      return lines.filter((l) => l.key !== action.key)
    case 'clear':
      return []
    default:
      return lines
  }
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    // Drop anything that is no longer on the menu.
    return Array.isArray(saved) ? saved.filter((l) => itemsById[l.id] && l.qty > 0) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, [])
  const [hydrated, setHydrated] = useState(false)

  // UI state shared across the page
  const [cartOpen, setCartOpen] = useState(false)
  const [sheet, setSheet] = useState(null) // { item, editKey? }
  const [order, setOrder] = useState(null) // the confirmation being shown

  useEffect(() => {
    dispatch({ type: 'hydrate', lines: load() })
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      /* storage full or blocked — the cart still works for this visit */
    }
  }, [lines, hydrated])

  const add = useCallback((line) => dispatch({ type: 'add', line }), [])
  const replace = useCallback((key, line) => dispatch({ type: 'replace', key, line }), [])
  const setQty = useCallback((key, qty) => dispatch({ type: 'qty', key, qty }), [])
  const remove = useCallback((key) => dispatch({ type: 'remove', key }), [])
  const clear = useCallback(() => dispatch({ type: 'clear' }), [])

  const value = useMemo(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0)
    const subtotal = lines.reduce((sum, l) => sum + itemsById[l.id].price * l.qty, 0)
    return {
      lines,
      count,
      subtotal,
      add,
      replace,
      setQty,
      remove,
      clear,
      cartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      sheet,
      openItem: (item, editKey) => setSheet({ item, editKey }),
      closeItem: () => setSheet(null),
      order,
      showOrder: setOrder,
    }
  }, [lines, add, replace, setQty, remove, clear, cartOpen, sheet, order])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
