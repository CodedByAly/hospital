import { useEffect } from 'react';

const MIN_VISIBLE_MS = 1150;

/**
 * The splash markup lives in index.html so it paints before any JavaScript
 * loads. Once React has rendered the page underneath, this lifts it away.
 * It only plays on the first visit of a browsing session.
 */
export default function Splash() {
  useEffect(() => {
    const el = document.getElementById('splash');
    if (!el) return undefined;
    const started = Number(el.dataset.start) || performance.now();
    const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - started));
    let removeTimer;
    const hideTimer = window.setTimeout(() => {
      el.classList.add('is-leaving');
      document.documentElement.classList.remove('has-splash');
      removeTimer = window.setTimeout(() => el.remove(), 900);
    }, wait);
    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);
  return null;
}
