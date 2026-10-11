import { createPortal } from 'react-dom';
import { useDialog } from '../hooks/useDialog';
import { usePresence } from '../hooks/usePresence';

/**
 * Accessible overlay container.
 *  variant="modal"  – centred dialog on desktop, bottom sheet on phones
 *  variant="drawer" – full-height panel from the inline-end edge
 */
export default function Sheet({ open, onClose, labelledBy, label, variant = 'modal', className = '', children }) {
  const [mounted, state] = usePresence(open, 280);
  const ref = useDialog(open, onClose);

  if (!mounted) return null;

  return createPortal(
    <div className={`overlay overlay--${variant}`} data-state={state}>
      <div className="overlay__backdrop" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : label}
        tabIndex={-1}
        className={`overlay__panel ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
