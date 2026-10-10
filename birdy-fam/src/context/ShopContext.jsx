import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { itemsById } from '../data/menu.js'
import { lineKey, lineTotal } from '../lib/cart.js'
import { load, save } from '../lib/storage.js'

const CART_KEY = 'birdyfam:cart'
const BRANCH_KEY = 'birdyfam:branch'

const ShopContext = createContext(null)

const uid = () => Math.random().toString(36).slice(2, 10)

function reducer(lines, action) {
  switch (action.type) {
    case 'add': {
      const key = lineKey(action.line)
      const existing = lines.find((l) => lineKey(l) === key)
      if (existing) return lines.map((l) => (l === existing ? { ...l, qty: l.qty + action.line.qty } : l))
      return [...lines, { ...action.line, uid: uid() }]
    }
    case 'replace': {
      // Editing a line: if the new configuration matches another line, merge them.
      const key = lineKey(action.line)
      const twin = lines.find((l) => l.uid !== action.uid && lineKey(l) === key)
      if (twin)
        return lines
          .filter((l) => l.uid !== action.uid)
          .map((l) => (l === twin ? { ...l, qty: l.qty + action.line.qty } : l))
      return lines.map((l) => (l.uid === action.uid ? { ...action.line, uid: l.uid } : l))
    }
    case 'qty':
      return lines.map((l) => (l.uid === action.uid ? { ...l, qty: action.qty } : l)).filter((l) => l.qty > 0)
    case 'remove':
      return lines.filter((l) => l.uid !== action.uid)
    case 'clear':
      return []
    default:
      return lines
  }
}

// Drop lines whose item no longer exists (e.g. after a menu edit).
const initialLines = () => load(CART_KEY, []).filter((l) => itemsById[l.itemId] && l.qty > 0)

export function ShopProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, undefined, initialLines)
  const [cartOpen, setCartOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(null) // { itemId, line? }
  const [branchId, setBranchIdState] = useState(() => load(BRANCH_KEY, null))

  useEffect(() => save(CART_KEY, lines), [lines])

  const setBranchId = useCallback((id) => {
    setBranchIdState(id)
    save(BRANCH_KEY, id)
  }, [])

  const value = useMemo(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0)
    const subtotal = lines.reduce((s, l) => s + lineTotal(l), 0)
    return {
      lines,
      count,
      subtotal,
      addLine: (line) => dispatch({ type: 'add', line }),
      replaceLine: (uid, line) => dispatch({ type: 'replace', uid, line }),
      setQty: (uid, qty) => dispatch({ type: 'qty', uid, qty }),
      removeLine: (uid) => dispatch({ type: 'remove', uid }),
      clearCart: () => dispatch({ type: 'clear' }),
      cartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      activeItem,
      openItem: (itemId, line = null) => setActiveItem({ itemId, line }),
      closeItem: () => setActiveItem(null),
      branchId,
      setBranchId,
    }
  }, [lines, cartOpen, activeItem, branchId, setBranchId])

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export const useShop = () => useContext(ShopContext)
