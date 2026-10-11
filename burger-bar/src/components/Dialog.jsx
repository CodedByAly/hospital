import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useMountTransition } from '../lib/useMountTransition.js';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let openCount = 0;
function lockScroll() {
  if (openCount++ === 0) {
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.setProperty('--scrollbar-gap', `${scrollbar}px`);
    document.body.classList.add('scroll-locked');
  }
}
function unlockScroll() {
  if (--openCount === 0) document.body.classList.remove('scroll-locked');
}

/*
 * Accessible modal: portal, focus trap, Escape to close, focus restored to the
 * trigger on close, background scroll locked. `variant` controls the layout:
 * 'center' (desktop dialog / mobile bottom sheet) or 'side' (drawer).
 */
export default function Dialog({ open, onClose, labelledBy, variant = 'center', className = '', children, initialFocusRef }) {
  const mounted = useMountTransition(open, 260);
  const panelRef = useRef(null);
  const returnFocusRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    returnFocusRef.current = document.activeElement;
    lockScroll();

    const frame = requestAnimationFrame(() => {
      const target = initialFocusRef?.current || panelRef.current?.querySelector(FOCUSABLE) || panelRef.current;
      target?.focus({ preventScroll: true });
    });

    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current();
      } else if (event.key === 'Tab' && panelRef.current) {
        const nodes = [...panelRef.current.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKey);
      unlockScroll();
      const back = returnFocusRef.current;
      if (back && document.contains(back)) back.focus({ preventScroll: true });
    };
  }, [open, initialFocusRef]);

  if (!mounted) return null;

  return createPortal(
    <div className={`dialog dialog--${variant}`} data-state={open ? 'open' : 'closed'}>
      <div className="dialog__backdrop" onClick={onClose} aria-hidden="true" />
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
