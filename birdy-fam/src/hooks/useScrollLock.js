import { useEffect } from 'react'

let locks = 0

/** Locks body scroll while `active`; supports nested overlays (cart + item modal). */
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return
    if (locks++ === 0) {
      const gap = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = gap ? `${gap}px` : ''
    }
    return () => {
      if (--locks === 0) {
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''
      }
    }
  }, [active])
}
