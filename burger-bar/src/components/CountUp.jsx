import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/motion.js';

// Number that counts up from `from` the first time it scrolls into view.
export default function CountUp({ to, from = 0, duration = 1200 }) {
  const ref = useRef(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !('IntersectionObserver' in window)) return undefined;
    setValue(from);
    let frame;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / duration);
        setValue(Math.round(from + (to - from) * (1 - (1 - p) ** 4)));
        if (p < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, from, duration]);

  return <span ref={ref}>{value}</span>;
}
