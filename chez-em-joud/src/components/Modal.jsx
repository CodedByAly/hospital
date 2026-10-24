import { useEffect, useRef, useState } from 'react'
import { CloseIcon } from './Icons'
import './Modal.css'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])'
let openCount = 0

// Accessible dialog with enter/exit animation.
// variant: "sheet" (centred card; bottom sheet on phones), "drawer" (slides from the right),
// "page" (full screen).
export default function Modal({ open, onClose, label, variant = 'sheet', children, closeLabel = 'Close' }) {
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)
  const panelRef = useRef(null)
  const returnFocus = useRef(null)

  useEffect(() => {
    if (open) {
      returnFocus.current = document.activeElement
      setMounted(true)
      setClosing(false)
    } else if (mounted) {
      setClosing(true)
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const t = setTimeout(() => {
        setMounted(false)
        setClosing(false)
        // Hand focus back to whatever opened us, if it's still on the page.
        if (returnFocus.current?.isConnected) returnFocus.current.focus({ preventScroll: true })
      }, reduced ? 0 : 280)
      return () => clearTimeout(t)
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!mounted) return
    openCount += 1
    document.body.classList.add('is-locked')
    const panel = panelRef.current
    const first = panel?.querySelector('[data-autofocus]') || panel?.querySelector(FOCUSABLE)
    first?.focus({ preventScroll: true })

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
      if (e.key === 'Tab' && panel) {
        const items = [...panel.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null)
        if (!items.length) return
        const [a, b] = [items[0], items[items.length - 1]]
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault()
          b.focus()
        } else if (!e.shiftKey && document.activeElement === b) {
          e.preventDefault()
          a.focus()
        }
      }
    }
    panel?.addEventListener('keydown', onKey)
    return () => {
      panel?.removeEventListener('keydown', onKey)
      openCount -= 1
      if (openCount === 0) document.body.classList.remove('is-locked')
    }
  }, [mounted]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) return null

  return (
    <div className={`modal modal--${variant}${closing ? ' is-closing' : ''}`}>
      <div className="modal__scrim" onClick={onClose} aria-hidden="true" />
      <div className="modal__panel" role="dialog" aria-modal="true" aria-label={label} ref={panelRef}>
        <button type="button" className="modal__close" onClick={onClose} aria-label={closeLabel}>
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>
  )
}
