import { useEffect, useState } from 'react';
import { useUI } from '../context/UIContext';
import Icon from './Icon';
import './Extras.css';

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 1400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`to-top ${show ? 'is-shown' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
    >
      <Icon name="arrowUp" size={20} />
    </button>
  );
}

export function Toast() {
  const { toast } = useUI();
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div className="toast" key={toast.id}>
          <Icon name="check" size={18} strokeWidth={2} />
          {toast.message}
        </div>
      )}
    </div>
  );
}
