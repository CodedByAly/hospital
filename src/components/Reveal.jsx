import { useLayoutEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/motion.js';

// Fades content up the first time it scrolls into view (including on load). Visible without JS/IO support.
export default function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const ref = useRef(null);
  const [state, setState] = useState('idle');

  // Layout effect: hide before first paint so there's no flash of content.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    if (prefersReducedMotion()) return undefined;
    setState('hidden');
    const io = new IntersectionObserver(
      ([entry]) => {
        // Also reveal anything the visitor jumped past, so nothing stays hidden above the fold.
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          setState('shown');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal reveal--${state} ${className}`} style={delay ? { '--reveal-delay': `${delay}ms` } : undefined} {...rest}>
      {children}
    </Tag>
  );
}
