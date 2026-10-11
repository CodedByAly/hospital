import { useEffect } from 'react';
import Logo from './Logo.jsx';

// Logo is drawn in with a soft wipe, then the curtain lifts onto the page.
// The page itself renders underneath from the start, so content and SEO are unaffected.
const LIFT_AT = 1500;
const DONE_AT = 2250;

export default function Splash({ onReveal, onDone }) {
  useEffect(() => {
    document.documentElement.classList.add('is-locked');
    const lift = setTimeout(() => {
      document.documentElement.classList.remove('is-locked');
      onReveal();
    }, LIFT_AT);
    const done = setTimeout(onDone, DONE_AT);
    return () => {
      clearTimeout(lift);
      clearTimeout(done);
      document.documentElement.classList.remove('is-locked');
    };
  }, [onReveal, onDone]);

  return (
    <div className="splash" aria-hidden="true">
      <div className="splash__inner">
        <Logo className="splash__logo" />
        <span className="splash__rule" />
        <span className="splash__place">Azmi Street &middot; Tripoli</span>
      </div>
    </div>
  );
}
