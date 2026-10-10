import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { lineKey, resolveLine, type CartLine, type ResolvedLine } from '../lib/cart'
import { load, save } from '../lib/storage'

const KEY = 'outlaw:cart'

type CartApi = {
  lines: ResolvedLine[]
  count: number
  subtotal: number
  add: (itemId: string, sizeId: string | null, qty: number, notes: string) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
  /** Cart buttons register here so the fly animation knows where to land. */
  cartTarget: (el: HTMLElement | null) => void
  fly: (from: HTMLElement | null, src?: string) => void
  bump: number
}

const CartContext = createContext<CartApi | null>(null)

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>(() => load<CartLine[]>(KEY, []))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [bump, setBump] = useState(0)
  const targets = useRef(new Set<HTMLElement>())

  useEffect(() => save(KEY, raw), [raw])

  const lines = useMemo(() => raw.map(resolveLine).filter((l): l is ResolvedLine => l !== null), [raw])
  const count = lines.reduce((n, l) => n + l.qty, 0)
  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0)

  const add = useCallback((itemId: string, sizeId: string | null, qty: number, notes: string) => {
    const key = lineKey(itemId, sizeId, notes)
    setRaw((prev) => {
      const hit = prev.find((l) => l.key === key)
      if (hit) return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(99, l.qty + qty) } : l))
      return [...prev, { key, itemId, sizeId, notes: notes.trim(), qty }]
    })
  }, [])
  const setQty = useCallback((key: string, qty: number) => {
    setRaw((prev) => (qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(99, qty) } : l))))
  }, [])
  const remove = useCallback((key: string) => setRaw((prev) => prev.filter((l) => l.key !== key)), [])
  const clear = useCallback(() => setRaw([]), [])

  const cartTarget = useCallback((el: HTMLElement | null) => {
    if (el) targets.current.add(el)
  }, [])

  /** A copy of the photo arcs from where it was added to the visible cart button. */
  const fly = useCallback((from: HTMLElement | null, src?: string) => {
    const arrive = () => setBump((n) => n + 1)
    for (const el of targets.current) if (!el.isConnected) targets.current.delete(el)
    const target = [...targets.current].find((el) => {
      const r = el.getBoundingClientRect()
      return r.width > 0 && getComputedStyle(el).visibility !== 'hidden'
    })
    if (!from || !target || !src || reducedMotion()) return arrive()
    const a = from.getBoundingClientRect()
    const b = target.getBoundingClientRect()
    const size = Math.max(56, Math.min(a.width, a.height, 160))
    const img = document.createElement('img')
    img.src = src
    img.alt = ''
    Object.assign(img.style, {
      position: 'fixed', left: `${a.left + a.width / 2 - size / 2}px`, top: `${a.top + a.height / 2 - size / 2}px`,
      width: `${size}px`, height: `${size}px`, objectFit: 'cover', borderRadius: '50%', zIndex: '9999', pointerEvents: 'none',
      boxShadow: '0 18px 40px rgba(0,0,0,.45)',
    })
    document.body.appendChild(img)
    const dx = b.left + b.width / 2 - (a.left + a.width / 2)
    const dy = b.top + b.height / 2 - (a.top + a.height / 2)
    const anim = img.animate(
      [
        { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
        { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 120}px) scale(.7) rotate(-12deg)`, opacity: 1, offset: 0.55 },
        { transform: `translate(${dx}px, ${dy}px) scale(.18) rotate(-24deg)`, opacity: 0.4 },
      ],
      { duration: 720, easing: 'cubic-bezier(.45,0,.25,1)' },
    )
    anim.onfinish = () => {
      img.remove()
      arrive()
    }
  }, [])

  const value = useMemo(
    () => ({ lines, count, subtotal, add, setQty, remove, clear, drawerOpen, setDrawerOpen, cartTarget, fly, bump }),
    [lines, count, subtotal, add, setQty, remove, clear, drawerOpen, cartTarget, fly, bump],
  )
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
