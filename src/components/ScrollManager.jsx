import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scroll to top on page change, or to the #hash target when there is one.
// Lazily loaded pages render a moment later, so the target is retried briefly.
export default function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let timer;
    const attempt = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ block: 'start' });
        // Web fonts can shift the layout after the first jump; re-align once they're in.
        document.fonts?.ready.then(() => requestAnimationFrame(() => el.scrollIntoView({ block: 'start' })));
      }
      else if (tries++ < 20) timer = setTimeout(attempt, 50);
    };
    attempt();
    return () => clearTimeout(timer);
  }, [pathname, hash]);
  return null;
}
