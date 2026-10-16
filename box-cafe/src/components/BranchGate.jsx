import { useEffect, useRef, useState } from 'react';
import { branches } from '../data/branches';
import { BoxCafeLogo } from './Logo';
import Icon from './Icon';
import './BranchGate.css';

// Opening scene built on Box Cafe's own cover photo. The photo slowly settles
// into focus while the logo fades in; the photo, the light and the logo sit on
// separate depth layers that shift with the pointer (or the phone's tilt).
// The branch list then slides up from the bottom.
export default function BranchGate({ open, intro, current, onPick, onClose }) {
  const [ready, setReady] = useState(!intro);
  const [picked, setPicked] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    setPicked(null);
    setLeaving(false);
    if (!intro) {
      setReady(true);
      return undefined;
    }
    setReady(false);
    const t = setTimeout(() => setReady(true), 1700);
    return () => clearTimeout(t);
  }, [open, intro]);

  useEffect(() => {
    if (!open) return undefined;
    const root = rootRef.current;
    document.documentElement.classList.add('is-locked');
    root?.focus({ preventScroll: true });

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;
    const onMove = (e) => {
      target = { x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 };
    };
    const onTilt = (e) => {
      if (e.gamma == null) return;
      target = { x: Math.max(-1, Math.min(1, e.gamma / 30)) * 0.5, y: Math.max(-1, Math.min(1, (e.beta - 45) / 30)) * 0.5 };
    };
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.05;
      cur.y += (target.y - cur.y) * 0.05;
      root?.style.setProperty('--px', cur.x.toFixed(4));
      root?.style.setProperty('--py', cur.y.toFixed(4));
      raf = requestAnimationFrame(tick);
    };
    if (!reduced) {
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('deviceorientation', onTilt, { passive: true });
      raf = requestAnimationFrame(tick);
    }
    const onKey = (e) => {
      if (e.key === 'Escape' && current && onClose) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('is-locked');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('deviceorientation', onTilt);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, current, onClose]);

  if (!open) return null;

  const choose = (b) => {
    if (picked) return;
    setPicked(b.id);
    setLeaving(true);
    window.setTimeout(() => onPick(b.id), 900);
  };

  return (
    <div
      className={`gate ${intro ? 'gate--intro' : ''} ${ready ? 'is-ready' : ''} ${leaving ? 'is-leaving' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      ref={rootRef}
      tabIndex={-1}
    >
      <div className="gate__photo" aria-hidden="true">
        <img src="photo/cover.webp" alt="" />
      </div>
      <div className="gate__glow" aria-hidden="true" />
      <div className="gate__shade" aria-hidden="true" />

      <div className="gate__inner">
        <div className="gate__brand">
          <BoxCafeLogo className="gate__logo" title="Box Cafe" />
          <p className="gate__slogan">For the love of coffee</p>
        </div>

        <div className="gate__sheet" aria-hidden={!ready}>
          <h1 id="gate-title" className="gate__title">
            Choose your branch
          </h1>
          <ul className="gate__list">
            {branches.map((b, i) => (
              <li key={b.id} style={{ '--i': i }} className={picked === b.id ? 'is-picked' : ''}>
                <button type="button" className="gate__row" onClick={() => choose(b)} tabIndex={ready ? 0 : -1}>
                  <span className="gate__name">{b.name}</span>
                  <span className="gate__hours">{b.hours ? b.hours.join(' · ') : 'Dine-in'}</span>
                  {current === b.id && <span className="gate__last">Last visit</span>}
                  <span className="gate__arrow" aria-hidden="true">
                    <Icon name="arrowRight" size={20} />
                  </span>
                </button>
                <a className="gate__map" href={b.mapsUrl} target="_blank" rel="noopener noreferrer" tabIndex={ready ? 0 : -1} aria-label={`Directions to Box Cafe ${b.name}`}>
                  <Icon name="pin" size={18} />
                </a>
              </li>
            ))}
          </ul>
          {current && onClose && (
            <button type="button" className="gate__cancel" onClick={onClose} tabIndex={ready ? 0 : -1}>
              Back to the menu
            </button>
          )}
          <p className="gate__by">By Société Last Exit</p>
        </div>
      </div>
    </div>
  );
}
