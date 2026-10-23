import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { getItem } from '../data/menu'
import { load, save } from '../lib/storage'
import { sumByCurrency } from '../lib/format'

const STORAGE_KEY = 'almanqal.cart.v1'
const CartContext = createContext(null)

/** Lines with the same item + choices merge into one line. */
export function lineKey({ itemId, options = [], addons = [], removed = [], note = '' }) {
  return [itemId, options.map((o) => o.id).sort().join('.'), addons.map((a) => a.id).sort().join('.'), [...removed].sort().join('.'), note.trim()].join('|')
}

/** Rebuilds names and prices from the current menu so stale saved carts never show old prices. */
function hydrate(lines) {
  if (!Array.isArray(lines)) return []
  return lines.flatMap((line) => {
    const item = getItem(line.itemId)
    if (!item || !(line.quantity > 0)) return []
    const choices = (item.options ?? []).flatMap((g) => g.choices)
    const options = (line.options ?? []).map((o) => choices.find((c) => c.id === o.id)).filter(Boolean)
    const addons = (line.addons ?? []).map((a) => item.addons?.find((x) => x.id === a.id)).filter(Boolean)
    const removed = (line.removed ?? []).filter((r) => item.removable?.includes(r))
    return [buildLine(item, { quantity: Math.min(line.quantity, 99), options, addons, removed, note: line.note ?? '' })]
  })
}

export function buildLine(item, { quantity, options = [], addons = [], removed = [], note = '' }) {
  const extras = [...options, ...addons].reduce((sum, x) => sum + (x.price ?? 0), 0)
  const base = { itemId: item.id, options, addons, removed, note: note.trim() }
  return {
    ...base,
    key: lineKey(base),
    name: item.name,
    image: item.image ?? null,
    currency: item.price.currency,
    unitPrice: item.price.amount + extras,
    quantity,
  }
}

function reducer(lines, action) {
  switch (action.type) {
    case 'add': {
      const existing = lines.find((l) => l.key === action.line.key)
      if (existing) {
        return lines.map((l) => (l.key === existing.key ? { ...l, quantity: Math.min(l.quantity + action.line.quantity, 99) } : l))
      }
      return [...lines, action.line]
    }
    case 'replace': {
      // Editing a line may turn it into a line that already exists — merge them.
      const rest = lines.filter((l) => l.key !== action.key)
      const twin = rest.find((l) => l.key === action.line.key)
      if (twin) return rest.map((l) => (l.key === twin.key ? { ...l, quantity: Math.min(l.quantity + action.line.quantity, 99) } : l))
      const index = lines.findIndex((l) => l.key === action.key)
      const next = [...rest]
      next.splice(index < 0 ? next.length : index, 0, action.line)
      return next
    }
    case 'quantity':
      return lines
        .map((l) => (l.key === action.key ? { ...l, quantity: Math.min(action.quantity, 99) } : l))
        .filter((l) => l.quantity > 0)
    case 'remove':
      return lines.filter((l) => l.key !== action.key)
    case 'clear':
      return []
    default:
      return lines
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, null, () => hydrate(load(STORAGE_KEY, [])))
  const [isOpen, setOpen] = useState(false)
  const [pulse, setPulse] = useState(0)

  useEffect(() => {
    save(
      STORAGE_KEY,
      lines.map(({ itemId, quantity, options, addons, removed, note }) => ({
        itemId,
        quantity,
        options: options.map(({ id }) => ({ id })),
        addons: addons.map(({ id }) => ({ id })),
        removed,
        note,
      })),
    )
  }, [lines])

  const [announcement, setAnnouncement] = useState('')
  const add = useCallback((line) => {
    dispatch({ type: 'add', line })
    setAnnouncement(`انضاف ${line.name} عالسلة`)
  }, [])
  // Called when an added item "lands" in the cart icon.
  const bump = useCallback(() => setPulse((n) => n + 1), [])

  const value = useMemo(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0)
    const totals = sumByCurrency(lines.map((l) => ({ amount: l.unitPrice * l.quantity, currency: l.currency })))
    return {
      lines,
      count,
      totals,
      pulse,
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add,
      bump,
      replace: (key, line) => dispatch({ type: 'replace', key, line }),
      setQuantity: (key, quantity) => dispatch({ type: 'quantity', key, quantity }),
      remove: (key) => dispatch({ type: 'remove', key }),
      clear: () => dispatch({ type: 'clear' }),
    }
  }, [lines, pulse, isOpen, add, bump])

  return (
    <CartContext.Provider value={value}>
      {children}
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
