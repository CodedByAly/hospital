import { useEffect, useState } from 'react';
import { ArrowUpIcon } from './Icons';

export default function BackToTop() {
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
      className={`back-to-top ${show ? 'is-shown' : ''}`}
      onClick={() => window.scrollTo({ top: 0 })}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
    >
      <ArrowUpIcon size={20} />
    </button>
  );
}
