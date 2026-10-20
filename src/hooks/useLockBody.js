import { useEffect } from 'react'

let locks = 0

// Stops the page behind a modal from scrolling. Counted so stacked
// overlays (sheet opened from the cart) unlock correctly.
export default function useLockBody(active) {
  useEffect(() => {
    if (!active) return
    locks += 1
    const { body, documentElement } = document
    const gap = window.innerWidth - documentElement.clientWidth
    if (locks === 1) {
      body.style.overflow = 'hidden'
      if (gap > 0) body.style.paddingRight = `${gap}px`
    }
    return () => {
      locks -= 1
      if (locks === 0) {
        body.style.overflow = ''
        body.style.paddingRight = ''
      }
    }
  }, [active])
}
