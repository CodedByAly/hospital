import { useEffect, useRef } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

let openCount = 0

/**
 * Shared behaviour for modals and drawers: locks page scroll, closes on
 * Escape, keeps keyboard focus inside, and restores focus on close.
 */
export function useDialog(open, onClose) {
  const ref = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    openCount += 1
    document.body.style.overflow = 'hidden'
    document.body.style.paddingInlineEnd = scrollbar ? `${scrollbar}px` : ''

    const node = ref.current
    const focusFirst = requestAnimationFrame(() => {
      const target = node?.querySelector('[data-autofocus]') ?? node?.querySelector(FOCUSABLE)
      target?.focus({ preventScroll: true })
    })

    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onCloseRef.current?.()
      } else if (event.key === 'Tab' && node) {
        const items = [...node.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null)
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    node?.addEventListener('keydown', onKey)

    return () => {
      cancelAnimationFrame(focusFirst)
      node?.removeEventListener('keydown', onKey)
      openCount -= 1
      if (openCount === 0) {
        document.body.style.overflow = ''
        document.body.style.paddingInlineEnd = ''
      }
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus({ preventScroll: true })
    }
  }, [open])

  return ref
}
