import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import { menuById } from '../data/menu'
import { lineKey, lineTotal } from '../utils/cartLine'
import { readJSON, writeJSON } from '../utils/storage'

const STORAGE_KEY = 'chippy:cart'
const CartContext = createContext(null)

function normalise(config) {
  return {
    itemId: config.itemId,
    options: config.options || {},
    removed: config.removed || [],
    extras: config.extras || [],
    note: (config.note || '').trim(),
  }
}

function mergeLine(lines, config, qty) {
  const key = lineKey(config)
  const existing = lines.find((l) => l.key === key)
  if (existing) return lines.map((l) => (l.key === key ? { ...l, qty: Math.min(99, l.qty + qty) } : l))
  return [...lines, { key, ...config, qty }]
}

function reducer(lines, action) {
  switch (action.type) {
    case 'load':
      // Drop anything that is no longer on the menu.
      return action.lines.filter((l) => menuById[l.itemId] && l.qty > 0)
    case 'add':
      return mergeLine(lines, normalise(action.config), action.qty)
    case 'replace': {
      const rest = lines.filter((l) => l.key !== action.key)
      const index = lines.findIndex((l) => l.key === action.key)
      const merged = mergeLine(rest, normalise(action.config), action.qty)
      // Keep the edited line where it was when it didn't merge into another.
      if (merged.length > rest.length && index > -1) {
        const line = merged.pop()
        merged.splice(index, 0, line)
      }
      return merged
    }
    case 'qty':
      return lines
        .map((l) => (l.key === action.key ? { ...l, qty: Math.min(99, action.qty) } : l))
        .filter((l) => l.qty > 0)
    case 'remove':
      return lines.filter((l) => l.key !== action.key)
    case 'clear':
      return []
    default:
      return lines
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, [])
  const loaded = useRef(false)

  // Read after mount so the prerendered HTML and first client render match.
  useEffect(() => {
    dispatch({ type: 'load', lines: readJSON(STORAGE_KEY, []) })
    loaded.current = true
  }, [])

  useEffect(() => {
    if (loaded.current) writeJSON(STORAGE_KEY, lines)
  }, [lines])

  const add = useCallback((config, qty = 1) => dispatch({ type: 'add', config, qty }), [])
  const replace = useCallback((key, config, qty) => dispatch({ type: 'replace', key, config, qty }), [])
  const setQty = useCallback((key, qty) => dispatch({ type: 'qty', key, qty }), [])
  const remove = useCallback((key) => dispatch({ type: 'remove', key }), [])
  const clear = useCallback(() => dispatch({ type: 'clear' }), [])

  const value = useMemo(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0)
    const subtotal = lines.reduce((n, l) => n + lineTotal(l), 0)
    return { lines, count, subtotal, add, replace, setQty, remove, clear }
  }, [lines, add, replace, setQty, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
