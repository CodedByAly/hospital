import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/motion.js';

/*
 * Scrolling strip of words. Drifts on its own, speeds up while the page is
 * scrolled and runs backwards when scrolling up.
 */
export default function Ticker({ words }) {
  const track = useRef(null);

  useEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return undefined;
    let x = 0;
    let dir = 1;
    let boost = 0;
    let lastY = window.scrollY;
    let last = performance.now();
    let frame;
    const onScroll = () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      if (dy !== 0) dir = dy > 0 ? 1 : -1;
      boost = Math.min(boost + Math.abs(dy) * 0.6, 900);
    };
    const tick = (now) => {
      const dt = Math.min(now - last, 50) / 1000;
      last = now;
      const half = el.scrollWidth / 2;
      x -= dir * (40 + boost) * dt;
      boost *= 0.92;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      el.style.transform = `translate3d(${x}px,0,0)`;
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track" ref={track}>
        {[0, 1].map((copy) => (
          <span key={copy} className="ticker__group">
            {words.map((word) => (
              <span key={word} className="ticker__word">
                {word}
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6L12 3Z" fill="currentColor" />
                </svg>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
