import { useEffect } from 'react';

let locks = 0;

/** Locks page scroll while an overlay is open, without the layout jumping. */
export default function useBodyLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    const root = document.documentElement;
    if (locks === 0) {
      const scrollbar = window.innerWidth - root.clientWidth;
      root.style.setProperty('--scrollbar-gap', `${scrollbar}px`);
      root.classList.add('is-locked');
    }
    locks += 1;
    return () => {
      locks -= 1;
      if (locks === 0) {
        root.classList.remove('is-locked');
        root.style.removeProperty('--scrollbar-gap');
      }
    };
  }, [active]);
}
