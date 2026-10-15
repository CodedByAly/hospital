import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './Dialog.css';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const EXIT_MS = 260;

/**
 * Accessible modal surface.
 * variant 'sheet'  - bottom sheet on phones, centered panel on larger screens
 * variant 'drawer' - slides in from the inline-end edge (right in English, left in Arabic)
 */
export default function Dialog({ open, onClose, labelledBy, variant = 'sheet', className = '', children, initialFocus }) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef(null);
  const returnFocusRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (open) {
      returnFocusRef.current = document.activeElement;
      setMounted(true);
      setClosing(false);
      return undefined;
    }
    if (!mounted) return undefined;
    setClosing(true);
    const timer = window.setTimeout(() => {
      setMounted(false);
      setClosing(false);
      const target = returnFocusRef.current;
      if (target && document.contains(target)) target.focus({ preventScroll: true });
    }, EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Body scroll lock (counted, so stacked dialogs don't unlock each other).
  useEffect(() => {
    if (!mounted) return undefined;
    const body = document.body;
    const count = Number(body.dataset.locks || 0) + 1;
    body.dataset.locks = String(count);
    body.classList.add('is-locked');
    return () => {
      const next = Number(body.dataset.locks || 1) - 1;
      body.dataset.locks = String(next);
      if (next <= 0) body.classList.remove('is-locked');
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted || closing) return undefined;
    const panel = panelRef.current;
    const first = (initialFocus && panel?.querySelector(initialFocus)) || panel;
    first?.focus({ preventScroll: true });

    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;
      const nodes = [...panel.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!nodes.length) return;
      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === firstNode) {
        event.preventDefault();
        lastNode.focus();
      } else if (!event.shiftKey && document.activeElement === lastNode) {
        event.preventDefault();
        firstNode.focus();
      }
    };
    panel?.addEventListener('keydown', onKey);
    return () => panel?.removeEventListener('keydown', onKey);
  }, [mounted, closing, initialFocus]);

  if (!mounted) return null;

  return createPortal(
    <div className={`dialog dialog--${variant} ${closing ? 'is-closing' : ''}`}>
      <div className="dialog__backdrop" onClick={() => onCloseRef.current?.()} aria-hidden="true" />
      <div
        ref={panelRef}
        className={`dialog__panel ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
