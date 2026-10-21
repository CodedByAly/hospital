import { useEffect, useRef } from 'react'

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

let openCount = 0

// Focus trap, Escape to close, scroll lock and focus restore for modal surfaces.
export function useDialog(open, onClose) {
  const ref = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement
    const el = ref.current
    openCount += 1
    document.documentElement.classList.add('scroll-locked')

    const first = el?.querySelector('[data-autofocus]') ?? el?.querySelector(FOCUSABLE)
    requestAnimationFrame(() => first?.focus({ preventScroll: true }))

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        closeRef.current()
      } else if (e.key === 'Tab' && el) {
        const items = [...el.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null)
        if (!items.length) return
        const [start, end] = [items[0], items[items.length - 1]]
        if (e.shiftKey && document.activeElement === start) {
          e.preventDefault()
          end.focus()
        } else if (!e.shiftKey && document.activeElement === end) {
          e.preventDefault()
          start.focus()
        }
      }
    }
    el?.addEventListener('keydown', onKey)
    return () => {
      el?.removeEventListener('keydown', onKey)
      openCount -= 1
      if (openCount === 0) document.documentElement.classList.remove('scroll-locked')
      if (previous instanceof HTMLElement) previous.focus({ preventScroll: true })
    }
  }, [open])

  return ref
}
