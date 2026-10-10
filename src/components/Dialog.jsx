import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useScrollLock } from '../hooks/useScrollLock'
import { useLanguage } from '../context/LanguageContext'
import Icon from './Icon'
import './Dialog.css'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Accessible modal. variant:
 *  - "sheet":  bottom sheet on phones, centred panel on larger screens
 *  - "drawer": slides in from the inline-end edge (left in Arabic)
 */
export default function Dialog({ open, onClose, label, variant = 'sheet', className = '', children, initialFocus }) {
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)
  const panel = useRef(null)
  const returnFocus = useRef(null)

  // mount immediately on open; on close, keep it around until the exit animation ends
  if (open && !mounted) setMounted(true)
  if (open && closing) setClosing(false)
  if (!open && mounted && !closing) setClosing(true)

  useScrollLock(mounted && !closing)

  useEffect(() => {
    if (!closing) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const id = setTimeout(() => {
      setMounted(false)
      setClosing(false)
    }, reduce ? 0 : 260)
    return () => clearTimeout(id)
  }, [closing])

  useEffect(() => {
    if (!mounted || closing) return
    returnFocus.current = document.activeElement
    const node = panel.current
    const first = (initialFocus && node.querySelector(initialFocus)) || node
    first.focus({ preventScroll: true })
    return () => {
      const el = returnFocus.current
      if (el && el.isConnected) el.focus({ preventScroll: true })
    }
  }, [mounted, closing, initialFocus])

  if (!mounted) return null

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onClose()
    } else if (e.key === 'Tab') {
      const items = [...panel.current.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null)
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  return createPortal(
    <div className={`dialog dialog--${variant}`} data-state={closing ? 'closing' : 'open'} onKeyDown={onKeyDown}>
      <div className="dialog__scrim" onClick={onClose} aria-hidden="true" />
      <div ref={panel} className={`dialog__panel ${className}`} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1}>
        <button type="button" className="dialog__close" onClick={onClose} aria-label={t('common.close')}>
          <Icon name="close" />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}
