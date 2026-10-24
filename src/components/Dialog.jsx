import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './Dialog.css';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const EXIT_MS = 260;

let openCount = 0;
function lockScroll() {
  if (openCount++ === 0) {
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-gap', `${gap}px`);
    document.documentElement.classList.add('scroll-locked');
  }
}
function unlockScroll() {
  if (--openCount === 0) document.documentElement.classList.remove('scroll-locked');
}

/**
 * Accessible modal shell: portal, focus trap, Esc to close, scroll lock,
 * focus return, and enter/exit animation.
 * variant: "center" (sheet on phones, centred card on desktop) | "side" (drawer)
 */
export default function Dialog({ open, onClose, labelledBy, variant = 'center', className = '', children }) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef(null);
  const returnFocus = useRef(null);

  useEffect(() => {
    if (open) {
      returnFocus.current = document.activeElement;
      setMounted(true);
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!mounted) return undefined;
    lockScroll();
    return () => {
      unlockScroll();
      const el = returnFocus.current;
      if (el && typeof el.focus === 'function' && document.contains(el)) el.focus({ preventScroll: true });
    };
  }, [mounted]);

  useEffect(() => {
    if (!visible || !panelRef.current) return;
    const panel = panelRef.current;
    const first = panel.querySelector('[data-autofocus]') || panel.querySelector(FOCUSABLE) || panel;
    first.focus({ preventScroll: true });
  }, [visible]);

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== 'Tab') return;
    const nodes = [...panelRef.current.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className={`dialog dialog--${variant}`} data-state={visible ? 'open' : 'closed'} onKeyDown={onKeyDown}>
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
