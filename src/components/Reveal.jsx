import { useEffect, useRef, useState } from 'react';

// Fades content up the first time it scrolls into view. Content is visible without JS/IO support.
export default function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const ref = useRef(null);
  const [state, setState] = useState('idle');

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) return undefined; // already on screen: no animation
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
