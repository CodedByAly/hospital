import { useEffect, useRef, useState } from 'react';
import { formatCents } from '../lib/format.js';
import { prefersReducedMotion } from '../lib/motion.js';

// Money value that rolls to its new amount and gives a small bump when it changes.
export default function AnimatedPrice({ cents, className = '' }) {
  const [shown, setShown] = useState(cents);
  const [bump, setBump] = useState(0);
  const from = useRef(cents);

  useEffect(() => {
    const start = from.current;
    if (start === cents) return undefined;
    from.current = cents;
    setBump((b) => b + 1);
    if (prefersReducedMotion()) {
      setShown(cents);
      return undefined;
    }
    let frame;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / 380);
      const eased = 1 - (1 - p) ** 3;
      setShown(Math.round(start + (cents - start) * eased));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [cents]);

  return (
    <span key={bump} className={`price-roll ${bump ? 'is-bumped' : ''} ${className}`}>
      {formatCents(shown)}
    </span>
  );
}
