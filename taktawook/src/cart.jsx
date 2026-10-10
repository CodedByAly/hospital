import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { gsap } from 'gsap'

const CartContext = createContext(null)
const KEY = 'taktawook-cart-v1'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// A line is unique per item + options, so "Tawook Large" and
// "Tawook Medium + Meal Booster" sit on separate lines.
function reducer(lines, action) {
  switch (action.type) {
    case 'add': {
      const found = lines.find((l) => l.key === action.line.key)
      if (found) return lines.map((l) => (l.key === found.key ? { ...l, qty: l.qty + 1 } : l))
      return [...lines, { ...action.line, qty: 1 }]
    }
    case 'qty':
      return lines
        .map((l) => (l.key === action.key ? { ...l, qty: l.qty + action.delta } : l))
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
  const [lines, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines))
    } catch {
      /* storage unavailable: cart just won't persist */
    }
  }, [lines])

  const value = useMemo(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0)
    const total = lines.reduce((n, l) => n + l.qty * l.unit, 0)
    return { lines, count, total, dispatch }
  }, [lines])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)

// Clones the dish photo (or icon) and throws it in an arc into the bag button.
export function flyToCart(fromEl) {
  const target = document.getElementById('cart-button')
  if (!fromEl || !target) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.fromTo(target, { scale: 1.15 }, { scale: 1, duration: 0.3 })
    return
  }
  const a = fromEl.getBoundingClientRect()
  const b = target.getBoundingClientRect()
  const ghost = fromEl.cloneNode(true)
  ghost.removeAttribute('id')
  ghost.setAttribute('aria-hidden', 'true')
  Object.assign(ghost.style, {
    position: 'fixed', left: `${a.left}px`, top: `${a.top}px`,
    width: `${a.width}px`, height: `${a.height}px`, margin: 0,
    zIndex: 9999, pointerEvents: 'none', borderRadius: '24px', objectFit: 'cover',
  })
  document.body.appendChild(ghost)

  const dx = b.left + b.width / 2 - (a.left + a.width / 2)
  const dy = b.top + b.height / 2 - (a.top + a.height / 2)
  const tl = gsap.timeline({ onComplete: () => ghost.remove() })
  tl.to(ghost, { x: dx, duration: 0.8, ease: 'power1.inOut' }, 0)
    .to(ghost, { y: dy - 140, duration: 0.35, ease: 'power2.out' }, 0)
    .to(ghost, { y: dy, duration: 0.45, ease: 'power2.in' }, 0.35)
    .to(ghost, { scale: 0.12, rotation: 340, borderRadius: '50%', duration: 0.8, ease: 'power2.in' }, 0)
    .to(ghost, { opacity: 0, duration: 0.15 }, 0.68)
    .fromTo(target, { scale: 1 }, { scale: 1.25, duration: 0.14, yoyo: true, repeat: 1, ease: 'power2.out' }, 0.75)
}
