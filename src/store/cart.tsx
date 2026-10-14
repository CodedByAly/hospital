import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import type { MenuItem } from '../data/types'
import { findItem } from '../data/menu'
import { restaurant } from '../config/restaurant'
import { storage } from '../utils/storage'

/** groupId -> choiceId -> units */
export type Selections = Record<string, Record<string, number>>

export interface CartLine {
  key: string
  itemId: string
  qty: number
  selections: Selections
  /** English ingredient names (stable ids) the customer asked to leave out. */
  removed: string[]
  notes: string
}

type Action =
  | { type: 'add'; line: CartLine }
  | { type: 'replace'; line: CartLine }
  | { type: 'qty'; key: string; qty: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' }

const KEY = 'kuku.cart.v1'

const sameConfig = (a: CartLine, b: CartLine) =>
  a.itemId === b.itemId &&
  a.notes.trim() === b.notes.trim() &&
  JSON.stringify([...a.removed].sort()) === JSON.stringify([...b.removed].sort()) &&
  JSON.stringify(a.selections) === JSON.stringify(b.selections)

function reducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case 'add': {
      const match = state.find((l) => sameConfig(l, action.line))
      if (match) return state.map((l) => (l === match ? { ...l, qty: Math.min(99, l.qty + action.line.qty) } : l))
      return [...state, action.line]
    }
    case 'replace':
      return state.map((l) => (l.key === action.line.key ? action.line : l))
    case 'qty':
      return action.qty <= 0
        ? state.filter((l) => l.key !== action.key)
        : state.map((l) => (l.key === action.key ? { ...l, qty: Math.min(99, action.qty) } : l))
    case 'remove':
      return state.filter((l) => l.key !== action.key)
    case 'clear':
      return []
  }
}

/** Unit price = base price + priced choices. */
export const unitPrice = (item: MenuItem, selections: Selections) => {
  let total = item.price
  for (const group of item.options ?? []) {
    const picked = selections[group.id] ?? {}
    for (const choice of group.choices) {
      if (choice.price && picked[choice.id]) total += choice.price * picked[choice.id]
    }
  }
  return Math.round(total * 100) / 100
}

export const lineTotal = (line: CartLine) => {
  const item = findItem(line.itemId)
  return item ? unitPrice(item, line.selections) * line.qty : 0
}

/** Human-readable option summary, e.g. ["Dipped in: Nashville", "Sauces: 2× Ranch"]. */
export const describeLine = (line: CartLine) => {
  const item = findItem(line.itemId)
  if (!item) return []
  const out: string[] = []
  for (const group of item.options ?? []) {
    const picked = line.selections[group.id]
    if (!picked) continue
    const parts = group.choices
      .filter((c) => picked[c.id])
      .map((c) => (group.type === 'count' && picked[c.id] > 1 ? `${picked[c.id]}× ` : '') + c.label)
    if (parts.length) out.push(`${group.label}: ${parts.join(', ')}`)
  }
  return out
}

const load = (): CartLine[] => {
  const saved = storage.get<CartLine[]>(KEY)
  if (!Array.isArray(saved)) return []
  // Drop lines whose item no longer exists or is no longer orderable.
  return saved.filter((l) => {
    const item = findItem(l?.itemId)
    return item && item.price > 0 && Number.isFinite(l.qty) && l.qty > 0
  })
}

interface CartContextValue {
  lines: CartLine[]
  count: number
  subtotal: number
  deliveryFee: number | null
  add: (line: Omit<CartLine, 'key'>) => void
  replace: (line: CartLine) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
  isOpen: boolean
  open: () => void
  close: () => void
  /** Increments whenever an item is added — used to pulse the cart icon. */
  bump: number
}

const CartContext = createContext<CartContextValue | null>(null)

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, undefined, load)
  const [isOpen, setOpen] = useState(false)
  const [bump, setBump] = useState(0)

  useEffect(() => storage.set(KEY, lines), [lines])

  // Keep carts in sync across tabs.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY) return
      dispatch({ type: 'clear' })
      for (const l of load()) dispatch({ type: 'add', line: l })
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const add = useCallback((line: Omit<CartLine, 'key'>) => {
    dispatch({ type: 'add', line: { ...line, key: uid() } })
    setBump((b) => b + 1)
  }, [])

  const value = useMemo<CartContextValue>(() => {
    const subtotal = Math.round(lines.reduce((s, l) => s + lineTotal(l), 0) * 100) / 100
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal,
      deliveryFee: restaurant.ordering.deliveryFee,
      add,
      replace: (line) => dispatch({ type: 'replace', line }),
      setQty: (key, qty) => dispatch({ type: 'qty', key, qty }),
      remove: (key) => dispatch({ type: 'remove', key }),
      clear: () => dispatch({ type: 'clear' }),
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      bump,
    }
  }, [lines, add, isOpen, bump])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
