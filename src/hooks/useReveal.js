import { useEffect, useRef } from 'react'

// Adds `is-visible` the first time the element scrolls into view. Styling lives in CSS ([data-reveal]).
export function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-visible')
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        // Also reveal if we jumped past it (e.g. an anchor link), so nothing stays hidden above the fold.
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          el.classList.add('is-visible')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}
