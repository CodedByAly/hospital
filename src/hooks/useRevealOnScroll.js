import { useEffect } from 'react';

// Adds `is-in` to every [data-reveal] element the first time it enters the viewport.
// A MutationObserver picks up elements rendered later (e.g. after a menu search).
export function useRevealOnScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observed = new WeakSet();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );

    const scan = () => {
      document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => {
        if (observed.has(el)) return;
        observed.add(el);
        if (reduce) el.classList.add('is-in');
        else io.observe(el);
      });
    };

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
