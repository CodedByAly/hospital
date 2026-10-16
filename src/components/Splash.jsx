import { useEffect, useState } from 'react';
import { LOGO_BEANS, LOGO_LETTERS } from './Logo';
import './Splash.css';

const SEEN_KEY = 'talia.splash.seen';

function shouldShow() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return !window.sessionStorage.getItem(SEEN_KEY);
  } catch {
    return true;
  }
}

// Brief brand intro, once per visit. The page renders underneath it,
// so crawlers and screen readers get the real content straight away.
export default function Splash() {
  const [phase, setPhase] = useState(() => (shouldShow() ? 'in' : 'done'));

  useEffect(() => {
    if (phase === 'done') return undefined;
    try {
      window.sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* ignore */
    }
    const leave = setTimeout(() => setPhase('out'), 1500);
    const end = setTimeout(() => setPhase('done'), 2150);
    return () => {
      clearTimeout(leave);
      clearTimeout(end);
    };
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === 'done') return null;

  return (
    <div className={`splash splash--${phase}`} aria-hidden="true" onClick={() => setPhase('out')}>
      <div className="splash__stage">
        <div className="splash__mark">
          <svg className="splash__letters" viewBox="100 90 1160 640">
            <path d={LOGO_LETTERS} fill="currentColor" fillRule="evenodd" />
          </svg>
          <svg className="splash__beans" viewBox="100 90 1160 640">
            <path d={LOGO_BEANS} fill="currentColor" fillRule="evenodd" />
          </svg>
        </div>
        <span className="splash__line">Resto Cafe &middot; Saida</span>
      </div>
    </div>
  );
}
