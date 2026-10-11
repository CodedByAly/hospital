import { useEffect, useState } from 'react';

/**
 * Keeps an overlay mounted long enough to play its exit animation.
 * Returns [mounted, state] where state is 'open' | 'closing'.
 */
export function usePresence(open, duration = 260) {
  const [mounted, setMounted] = useState(open);
  useEffect(() => {
    if (open) {
      setMounted(true);
      return undefined;
    }
    const timer = setTimeout(() => setMounted(false), duration);
    return () => clearTimeout(timer);
  }, [open, duration]);
  return [mounted || open, open ? 'open' : 'closing'];
}
