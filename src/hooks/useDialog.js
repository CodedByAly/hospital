import { useEffect, useRef } from 'react'
import useLockBody from './useLockBody'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const stack = []

// Escape to close, focus trapped inside, focus returned on close.
export default function useDialog(open, onClose) {
  const ref = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useLockBody(open)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement
    const token = {}
    stack.push(token)
    // The panel mounts a frame after `open` flips (see Overlay), so wait.
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const node = ref.current
        const first = node?.querySelector('[data-autofocus]') || node?.querySelector('.overlay__panel ' + FOCUSABLE) || node?.querySelector(FOCUSABLE)
        first?.focus({ preventScroll: true })
      }),
    )

    function onKey(e) {
      const node = ref.current
      // Only the top-most dialog reacts (the item sheet can open over the cart).
      if (!node || stack[stack.length - 1] !== token) return
      if (e.key === 'Escape') {
        e.stopPropagation()
        closeRef.current()
        return
      }
      if (e.key !== 'Tab') return
      const items = [...node.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null)
      if (!items.length) return
      const firstEl = items[0]
      const lastEl = items[items.length - 1]
      if (!node.contains(document.activeElement)) {
        e.preventDefault()
        firstEl.focus()
      } else if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      stack.splice(stack.indexOf(token), 1)
      document.removeEventListener('keydown', onKey)
      if (previous && previous.focus && document.contains(previous)) previous.focus({ preventScroll: true })
    }
  }, [open])

  return ref
}
