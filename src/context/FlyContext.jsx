import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

/**
 * "Fly to cart": a copy of the product photo (or its background-free cutout)
 * travels along an arc from where it was added to whichever cart button is
 * visible, then the button reacts. Uses the Web Animations API — no library.
 */
const FlyContext = createContext(null)

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const isVisible = (el) => {
  if (!el?.isConnected) return false
  const r = el.getBoundingClientRect()
  return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'
}

export function FlyProvider({ children }) {
  const targets = useRef(new Set())
  const [arrivals, setArrivals] = useState(0)

  /** Ref callback for cart buttons: <button ref={cartTarget}> */
  const cartTarget = useCallback((el) => {
    if (el) targets.current.add(el)
    // React 19 runs the returned cleanup when the element unmounts
    return () => targets.current.delete(el)
  }, [])

  const fly = useCallback(({ from, src, cutout }) => {
    const arrive = () => setArrivals((n) => n + 1)
    const target = [...targets.current].find(isVisible)
    if (!from || !target || !src || prefersReducedMotion()) {
      arrive()
      return
    }

    const a = from.getBoundingClientRect()
    const b = target.getBoundingClientRect()
    const size = Math.max(64, Math.min(a.width, a.height, cutout ? 240 : 180))
    const ax = a.left + a.width / 2
    const ay = a.top + a.height / 2
    const dx = b.left + b.width / 2 - ax
    const dy = b.top + b.height / 2 - ay
    const distance = Math.hypot(dx, dy)
    const duration = Math.min(980, Math.max(620, distance * 0.85))
    const lift = Math.min(140, 50 + distance * 0.12)

    const outer = document.createElement('div')
    outer.className = 'fly-item'
    outer.style.cssText = `left:${ax - size / 2}px;top:${ay - size / 2}px;width:${size}px;height:${size}px`
    const img = document.createElement('img')
    img.src = src
    img.alt = ''
    img.className = cutout ? 'fly-item__img fly-item__img--cutout' : 'fly-item__img'
    outer.appendChild(img)
    document.body.appendChild(outer)

    // x travels steadily; y rises first then falls into the cart (gravity), so the path is an arc
    outer.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${dx}px)` }], {
      duration,
      easing: 'cubic-bezier(.4,0,.6,1)',
      fill: 'forwards',
    })
    const tilt = dx >= 0 ? 1 : -1
    const run = img.animate(
      [
        { transform: 'translateY(0) scale(1) rotate(0deg)', opacity: 1, easing: 'cubic-bezier(.2,.7,.35,1)' },
        { transform: `translateY(${-lift}px) scale(.62) rotate(${-6 * tilt}deg)`, opacity: 1, offset: 0.38, easing: 'cubic-bezier(.6,0,.9,.4)' },
        { transform: `translateY(${dy}px) scale(.1) rotate(${14 * tilt}deg)`, opacity: 0.85 },
      ],
      { duration, fill: 'forwards' },
    )
    run.onfinish = run.oncancel = () => {
      outer.remove()
      arrive()
    }
  }, [])

  const value = useMemo(() => ({ fly, cartTarget, arrivals }), [fly, cartTarget, arrivals])
  return <FlyContext.Provider value={value}>{children}</FlyContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFly = () => useContext(FlyContext)
