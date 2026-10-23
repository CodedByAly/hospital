import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { getItem } from '../data/menu'
import { useLang } from '../i18n/LanguageContext'
import { load, save } from '../lib/storage'

const STORAGE_KEY = 'laffet.cart.v1'
const CartContext = createContext(null)

const removedKey = (r) => r.en ?? r

/** Lines with the same item + choices merge into one line. */
export function lineKey({ itemId, options = [], addons = [], removed = [], note = '' }) {
  return [
    itemId,
    options.map((o) => o.id).sort().join('.'),
    addons.map((a) => a.id).sort().join('.'),
    removed.map(removedKey).sort().join('.'),
    note.trim(),
  ].join('|')
}

/** Rebuilds names and prices from the current menu so saved carts never show stale prices. */
function hydrate(lines) {
  if (!Array.isArray(lines)) return []
  return lines.flatMap((line) => {
    const item = getItem(line.itemId)
    if (!item || !(line.quantity > 0)) return []
    const choices = (item.options ?? []).flatMap((g) => g.choices)
    const options = (line.options ?? []).map((o) => choices.find((c) => c.id === o.id)).filter(Boolean)
    const addons = (line.addons ?? []).map((a) => item.addons?.find((x) => x.id === a.id)).filter(Boolean)
    const removed = (item.removable ?? []).filter((r) => (line.removed ?? []).includes(removedKey(r)))
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
    size: item.note ?? null,
    image: item.image ?? null,
    unitPrice: item.price + extras,
    quantity,
  }
}

const merge = (l, quantity) => ({ ...l, quantity: Math.min(l.quantity + quantity, 99) })

function reducer(lines, action) {
  switch (action.type) {
    case 'add': {
      const existing = lines.find((l) => l.key === action.line.key)
      if (existing) return lines.map((l) => (l.key === existing.key ? merge(l, action.line.quantity) : l))
      return [...lines, action.line]
    }
    case 'replace': {
      // Editing a line may turn it into a line that already exists — merge them.
      const rest = lines.filter((l) => l.key !== action.key)
      const twin = rest.find((l) => l.key === action.line.key)
      if (twin) return rest.map((l) => (l.key === twin.key ? merge(l, action.line.quantity) : l))
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
  const { t, pick } = useLang()
  const [lines, dispatch] = useReducer(reducer, null, () => hydrate(load(STORAGE_KEY, [])))
  const [isOpen, setOpen] = useState(false)
  const [pulse, setPulse] = useState(0)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    save(
      STORAGE_KEY,
      lines.map(({ itemId, quantity, options, addons, removed, note }) => ({
        itemId,
        quantity,
        options: options.map(({ id }) => ({ id })),
        addons: addons.map(({ id }) => ({ id })),
        removed: removed.map(removedKey),
        note,
      })),
    )
  }, [lines])

  const add = useCallback(
    (line) => {
      dispatch({ type: 'add', line })
      setAnnouncement(t('cart.added', { name: pick(line.name) }))
    },
    [t, pick],
  )
  // Called when an added item "lands" in the cart icon.
  const bump = useCallback(() => setPulse((n) => n + 1), [])

  const value = useMemo(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0)
    const total = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0)
    return {
      lines,
      count,
      total,
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
