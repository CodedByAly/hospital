import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

// Keeps children mounted for the exit animation, then unmounts.
// `variant` picks the CSS motion: "sheet" (bottom sheet on phones,
// centred dialog on desktop) or "drawer" (slides from the side).
export default function Overlay({ open, onClose, variant = 'sheet', labelledBy, children, className = '', panelRef }) {
  const [mounted, setMounted] = useState(open)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
      return () => cancelAnimationFrame(id)
    }
    setVisible(false)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const t = setTimeout(() => setMounted(false), reduce ? 0 : 320)
    return () => clearTimeout(t)
  }, [open])

  if (!mounted) return null
  return createPortal(
    <div className={`overlay overlay--${variant} ${visible ? 'is-open' : ''} ${className}`}>
      <div className="overlay__scrim" onClick={onClose} aria-hidden="true" />
      <div className="overlay__panel" role="dialog" aria-modal="true" aria-labelledby={labelledBy} ref={panelRef}>
        {children}
      </div>
    </div>,
    document.body,
  )
}
