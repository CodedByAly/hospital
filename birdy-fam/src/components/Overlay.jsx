import { useEffect, useRef, useState } from 'react'
import { useFocusTrap } from '../hooks/useFocusTrap.js'
import { useScrollLock } from '../hooks/useScrollLock.js'

const EXIT_MS = 240

/**
 * Shared shell for the item dialog and the bag drawer: backdrop, enter/exit
 * animation, focus trap, Escape to close and body scroll lock.
 * variant: 'dialog' (bottom sheet on phones, centred on desktop) | 'drawer' (side panel).
 */
export default function Overlay({ open, onClose, variant = 'dialog', labelledBy, children, className = '' }) {
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)
  const panel = useRef(null)

  useEffect(() => {
    if (open) {
      setMounted(true)
      setClosing(false)
    } else if (mounted) {
      setClosing(true)
      const t = setTimeout(() => {
        setMounted(false)
        setClosing(false)
      }, EXIT_MS)
      return () => clearTimeout(t)
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  useScrollLock(mounted)
  useFocusTrap(panel, mounted && !closing, onClose)

  if (!mounted) return null
  return (
    <div className={`overlay overlay--${variant} ${closing ? 'is-closing' : ''}`}>
      <div className="overlay__backdrop" onClick={onClose} aria-hidden="true" />
      <div ref={panel} className={`overlay__panel ${className}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        {children}
      </div>
    </div>
  )
}
