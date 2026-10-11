import { useEffect } from 'react';

// Calls `onProgress(p)` with how far the element has travelled through the viewport.
// mode "pin": 0 when its top hits the viewport top, 1 when its bottom hits the viewport bottom.
// mode "pass": 0 when its top enters from below, 1 when its bottom leaves at the top.
export function useScrollProgress(ref, onProgress, mode = 'pass') {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p =
        mode === 'pin'
          ? -rect.top / Math.max(1, rect.height - vh)
          : (vh - rect.top) / (vh + rect.height);
      onProgress(Math.min(1, Math.max(0, p)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ref, onProgress, mode]);
}
