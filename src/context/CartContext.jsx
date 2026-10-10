import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { restaurant } from '../config/restaurant'
import { missingOptions, resolveLine, signature } from '../lib/cart'
import { storage } from '../lib/storage'

const CartContext = createContext(null)
const KEY = 'adams:cart'
const MAX_QTY = 50

const newKey = () => Math.random().toString(36).slice(2, 10)

function reducer(lines, action) {
  switch (action.type) {
    case 'add': {
      const sig = signature(action.itemId, action.config)
      const existing = lines.find((l) => signature(l.itemId, l.config) === sig)
      if (existing) {
        return lines.map((l) => (l === existing ? { ...l, qty: Math.min(MAX_QTY, l.qty + action.qty) } : l))
      }
      return [...lines, { key: newKey(), itemId: action.itemId, config: action.config, qty: action.qty }]
    }
    case 'replace': {
      // editing a line: if the new config matches another line, merge them
      const sig = signature(action.itemId, action.config)
      const twin = lines.find((l) => l.key !== action.key && signature(l.itemId, l.config) === sig)
      if (twin) {
        return lines
          .filter((l) => l.key !== action.key)
          .map((l) => (l === twin ? { ...l, qty: Math.min(MAX_QTY, l.qty + action.qty) } : l))
      }
      return lines.map((l) => (l.key === action.key ? { ...l, config: action.config, qty: action.qty } : l))
    }
    case 'qty':
      return lines
        .map((l) => (l.key === action.key ? { ...l, qty: Math.min(MAX_QTY, Math.max(0, action.qty)) } : l))
        .filter((l) => l.qty > 0)
    case 'remove':
      return lines.filter((l) => l.key !== action.key)
    case 'restore': {
      const next = [...lines]
      next.splice(Math.min(action.index, next.length), 0, action.line)
      return next
    }
    case 'set':
      return action.lines
    case 'clear':
      return []
    default:
      return lines
  }
}

function loadLines() {
  const saved = storage.get(KEY, [])
  if (!Array.isArray(saved)) return []
  // drop anything that no longer matches the menu (renamed items, removed sizes, new required options)
  return saved.filter((line) => {
    const resolved = line && line.config && resolveLine(line)
    return resolved && line.qty > 0 && missingOptions(resolved.item, line.config).length === 0
  })
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, undefined, loadLines)
  const [isOpen, setOpen] = useState(false)
  const [lastRemoved, setLastRemoved] = useState(null)
  const undoTimer = useRef()

  useEffect(() => storage.set(KEY, lines), [lines])

  // keep carts in sync between tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY) dispatch({ type: 'set', lines: loadLines() })
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const resolved = useMemo(() => lines.map(resolveLine).filter(Boolean), [lines])
  const count = resolved.reduce((n, l) => n + l.qty, 0)
  const subtotal = resolved.reduce((n, l) => n + l.lineTotal, 0)

  const remove = useCallback(
    (key) => {
      const index = lines.findIndex((l) => l.key === key)
      if (index === -1) return
      setLastRemoved({ line: lines[index], index })
      clearTimeout(undoTimer.current)
      undoTimer.current = setTimeout(() => setLastRemoved(null), 5000)
      dispatch({ type: 'remove', key })
    },
    [lines],
  )

  const value = useMemo(
    () => ({
      lines: resolved,
      count,
      subtotal,
      deliveryFee: restaurant.ordering.deliveryFee,
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add: (itemId, config, qty = 1) => dispatch({ type: 'add', itemId, config, qty }),
      replace: (key, itemId, config, qty) => dispatch({ type: 'replace', key, itemId, config, qty }),
      setQty: (key, qty) => (qty <= 0 ? remove(key) : dispatch({ type: 'qty', key, qty })),
      remove,
      lastRemoved,
      undoRemove: () => {
        if (!lastRemoved) return
        dispatch({ type: 'restore', ...lastRemoved })
        setLastRemoved(null)
      },
      clear: () => dispatch({ type: 'clear' }),
    }),
    [resolved, count, subtotal, isOpen, remove, lastRemoved],
  )
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext)
