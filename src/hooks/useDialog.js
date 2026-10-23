import { useEffect, useRef } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
let openDialogs = 0

/**
 * Modal behaviour for drawers and sheets: locks page scroll, traps focus,
 * closes on Escape and returns focus to the element that opened it.
 */
export function useDialog(isOpen, onClose) {
  const ref = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!isOpen) return
    const previouslyFocused = document.activeElement
    const node = ref.current

    openDialogs += 1
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.documentElement.style.setProperty('--scrollbar-gap', `${scrollbar}px`)
    document.documentElement.classList.add('is-locked')

    const focusFirst = () => {
      const preferred = node?.querySelector('[data-autofocus]') ?? node?.querySelector(FOCUSABLE)
      preferred?.focus({ preventScroll: true })
    }
    const raf = requestAnimationFrame(focusFirst)

    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onCloseRef.current?.()
        return
      }
      if (event.key !== 'Tab' || !node) return
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
    node?.addEventListener('keydown', onKey)

    return () => {
      cancelAnimationFrame(raf)
      node?.removeEventListener('keydown', onKey)
      openDialogs -= 1
      if (openDialogs === 0) document.documentElement.classList.remove('is-locked')
      if (previouslyFocused instanceof HTMLElement && document.contains(previouslyFocused)) {
        previouslyFocused.focus({ preventScroll: true })
      }
    }
  }, [isOpen])

  return ref
}
