import { useEffect } from 'react';
import { useUI } from '../context/UIContext';
import Icon from './Icon';

export default function Toast() {
  const { toast, clearToast } = useUI();

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(clearToast, 2600);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast ? (
        <div className="toast" key={toast.id}>
          <Icon name="check" size={18} strokeWidth={2.2} />
          <span>{toast.message}</span>
        </div>
      ) : null}
    </div>
  );
}
