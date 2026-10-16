import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDialog } from '../hooks/useDialog';
import './Sheet.css';

const EXIT_MS = 320;

// Modal surface: a bottom sheet on phones, a centred dialog or side drawer on larger screens.
// Keeps rendering during its exit animation, then unmounts.
export default function Sheet({ open, onClose, labelledBy, variant = 'dialog', className = '', children }) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef(null);
  const dragRef = useRef(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      return undefined;
    }
    if (!mounted) return undefined;
    setClosing(true);
    const t = setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, EXIT_MS);
    return () => clearTimeout(t);
  }, [open, mounted]);

  useDialog(open && mounted, onClose, panelRef);

  // Swipe down on the grab handle to dismiss (phones).
  const onHandleDown = (e) => {
    const panel = panelRef.current;
    if (!panel) return;
    dragRef.current = { y: e.clientY, dy: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
    panel.style.transition = 'none';
  };
  const onHandleMove = (e) => {
    if (!dragRef.current) return;
    const dy = Math.max(0, e.clientY - dragRef.current.y);
    dragRef.current.dy = dy;
    panelRef.current.style.transform = `translateY(${dy}px)`;
  };
  const onHandleUp = () => {
    const panel = panelRef.current;
    if (!dragRef.current || !panel) return;
    const { dy } = dragRef.current;
    dragRef.current = null;
    panel.style.transition = '';
    panel.style.transform = '';
    if (dy > 90) onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <div className={`sheet sheet--${variant} ${closing ? 'is-closing' : ''} ${className}`}>
      <div className="sheet__backdrop" onClick={onClose} aria-hidden="true" />
      <div className="sheet__panel" ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={labelledBy} tabIndex={-1}>
        <div
          className="sheet__handle"
          onPointerDown={onHandleDown}
          onPointerMove={onHandleMove}
          onPointerUp={onHandleUp}
          onPointerCancel={onHandleUp}
          aria-hidden="true"
        >
          <span />
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
