import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { findItem } from '../data/menu.js'
import { readJSON, writeJSON } from '../lib/storage.js'
import { cartSubtotal } from '../lib/order.js'

const STORAGE_KEY = 'jungs:cart:v1'
const CartContext = createContext(null)

const sameConfig = (a, b) =>
  a.itemId === b.itemId &&
  JSON.stringify(a.selections) === JSON.stringify(b.selections) &&
  JSON.stringify([...(a.removed ?? [])].sort()) === JSON.stringify([...(b.removed ?? [])].sort())

const newKey = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

function reducer(lines, action) {
  switch (action.type) {
    case 'add': {
      const match = lines.find((l) => sameConfig(l, action.line))
      if (match) return lines.map((l) => (l === match ? { ...l, qty: Math.min(l.qty + action.line.qty, 50) } : l))
      return [...lines, { ...action.line, key: newKey() }]
    }
    case 'replace':
      return lines.map((l) => (l.key === action.key ? { ...action.line, key: l.key } : l))
    case 'qty':
      return lines
        .map((l) => (l.key === action.key ? { ...l, qty: Math.min(action.qty, 50) } : l))
        .filter((l) => l.qty > 0)
    case 'remove':
      return lines.filter((l) => l.key !== action.key)
    case 'clear':
      return []
    default:
      return lines
  }
}

// Drop lines whose item no longer exists on the menu (e.g. after a menu update).
const loadLines = () => readJSON(STORAGE_KEY, []).filter((l) => l && findItem(l.itemId) && l.qty > 0)

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, undefined, loadLines)
  const [cartOpen, setCartOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(null) // { itemId, editKey? }

  useEffect(() => writeJSON(STORAGE_KEY, lines), [lines])

  const openItem = useCallback((itemId, editKey) => setActiveItem({ itemId, editKey }), [])
  const closeItem = useCallback(() => setActiveItem(null), [])

  const value = useMemo(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: cartSubtotal(lines),
      add: (line) => dispatch({ type: 'add', line }),
      replace: (key, line) => dispatch({ type: 'replace', key, line }),
      setQty: (key, qty) => dispatch({ type: 'qty', key, qty }),
      remove: (key) => dispatch({ type: 'remove', key }),
      clear: () => dispatch({ type: 'clear' }),
      cartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      activeItem,
      openItem,
      closeItem,
    }),
    [lines, cartOpen, activeItem, openItem, closeItem],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
