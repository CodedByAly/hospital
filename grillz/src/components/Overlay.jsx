import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useBodyLock from '../hooks/useBodyLock';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const EXIT_MS = 280;
const DISMISS_DISTANCE = 110;
const DISMISS_VELOCITY = 0.55; // px per ms

/**
 * Modal surface used for the item sheet and the cart.
 *  - variant "dialog": bottom sheet on phones, centred dialog on larger screens
 *  - variant "drawer": bottom sheet on phones, side panel (inline-end) on larger screens
 *
 * Handles focus trapping, Escape, backdrop clicks, scroll locking, exit
 * animations and swipe-down-to-dismiss on touch screens.
 */
export default function Overlay({ open, onClose, variant = 'dialog', labelledBy, className = '', children }) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef(null);
  const restoreFocus = useRef(null);
  const drag = useRef(null);

  useEffect(() => {
    if (open) {
      restoreFocus.current = document.activeElement;
      setMounted(true);
      setClosing(false);
      return undefined;
    }
    if (!mounted) return undefined;
    setClosing(true);
    const timer = window.setTimeout(() => {
      setMounted(false);
      setClosing(false);
      const el = restoreFocus.current;
      if (el && document.contains(el)) el.focus({ preventScroll: true });
    }, EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useBodyLock(mounted);

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (!open || !mounted) return;
    const panel = panelRef.current;
    if (!panel) return;
    const first = panel.querySelector('[data-autofocus]') || panel;
    first.focus({ preventScroll: true });
  }, [open, mounted]);

  const onKeyDown = useCallback(
    (e) => {
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
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  // Swipe down to dismiss (phones). Only engages when the inner scroller is at the top,
  // so normal scrolling inside the sheet keeps working.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !mounted) return undefined;
    const isSheet = () => window.matchMedia('(max-width: 767px)').matches;
    const scroller = () => panel.querySelector('[data-scroll]') || panel;

    const start = (e) => {
      if (!isSheet() || e.touches.length !== 1) return;
      if (e.target.closest('input, textarea, select')) return;
      drag.current = { y0: e.touches[0].clientY, x0: e.touches[0].clientX, dy: 0, t0: performance.now(), active: false, last: [] };
    };
    const move = (e) => {
      const d = drag.current;
      if (!d) return;
      const y = e.touches[0].clientY;
      const dy = y - d.y0;
      const dx = Math.abs(e.touches[0].clientX - d.x0);
      if (!d.active) {
        if (dy > 6 && dy > dx && scroller().scrollTop <= 0) {
          d.active = true;
          d.y0 = y;
          panel.classList.add('is-dragging');
        } else if (Math.abs(dy) > 6 || dx > 6) {
          drag.current = null;
          return;
        } else return;
      }
      e.preventDefault();
      d.dy = Math.max(0, y - d.y0);
      d.last.push({ y, t: performance.now() });
      if (d.last.length > 5) d.last.shift();
      // Slight resistance so the sheet feels attached to the finger, not weightless.
      panel.style.transform = `translate3d(0, ${d.dy * 0.92}px, 0)`;
    };
    const end = () => {
      const d = drag.current;
      drag.current = null;
      if (!d?.active) return;
      panel.classList.remove('is-dragging');
      const a = d.last[0];
      const b = d.last[d.last.length - 1];
      const velocity = a && b && b.t > a.t ? (b.y - a.y) / (b.t - a.t) : 0;
      if (d.dy > DISMISS_DISTANCE || velocity > DISMISS_VELOCITY) {
        panel.style.setProperty('--drag-from', `${d.dy * 0.92}px`);
        panel.style.transform = '';
        onClose();
      } else {
        panel.style.transform = '';
      }
    };

    panel.addEventListener('touchstart', start, { passive: true });
    panel.addEventListener('touchmove', move, { passive: false });
    panel.addEventListener('touchend', end);
    panel.addEventListener('touchcancel', end);
    return () => {
      panel.removeEventListener('touchstart', start);
      panel.removeEventListener('touchmove', move);
      panel.removeEventListener('touchend', end);
      panel.removeEventListener('touchcancel', end);
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className={`overlay overlay--${variant} ${closing ? 'is-closing' : 'is-open'}`} onKeyDown={onKeyDown}>
      <div className="overlay__backdrop" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        className={`overlay__panel ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
      >
        <div className="overlay__grip" aria-hidden="true" />
        {children}
      </div>
    </div>,
    document.body,
  );
}
