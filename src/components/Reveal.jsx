import { useEffect, useRef } from 'react';

let observer;
function getObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return observer;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  return observer;
}

/** Fades content in once, the first time it scrolls into view. */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    const io = getObserver();
    if (!node) return undefined;
    if (!io) {
      node.classList.add('is-visible');
      return undefined;
    }
    io.observe(node);
    return () => io.unobserve(node);
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ '--reveal-delay': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}
