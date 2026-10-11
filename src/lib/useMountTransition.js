import { useEffect, useState } from 'react';
import { prefersReducedMotion } from './motion.js';

// Keeps a component mounted long enough to play its exit animation.
export function useMountTransition(isOpen, duration) {
  const [mounted, setMounted] = useState(isOpen);
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      return undefined;
    }
    const timeout = setTimeout(() => setMounted(false), prefersReducedMotion() ? 0 : duration);
    return () => clearTimeout(timeout);
  }, [isOpen, duration]);
  return mounted;
}
