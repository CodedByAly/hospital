import { useEffect, useRef, useState } from 'react';
import { branches } from '../data/branches';
import { BoxCafeLogo } from './Logo';
import Icon from './Icon';
import './BranchGate.css';

// Opening screen: the logo lands, rises, and the branches appear under it.
// Picking one opens that branch's menu. `intro` plays the logo animation
// (first visit of the session); reopening from the header skips it.
export default function BranchGate({ open, intro, current, onPick, onClose }) {
  const [phase, setPhase] = useState(intro ? 'logo' : 'pick');
  const [leaving, setLeaving] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    setLeaving(false);
    if (!intro) {
      setPhase('pick');
      return undefined;
    }
    setPhase('logo');
    const t = setTimeout(() => setPhase('pick'), 1150);
    return () => clearTimeout(t);
  }, [open, intro]);

  useEffect(() => {
    if (!open) return undefined;
    document.documentElement.classList.add('is-locked');
    const onKey = (e) => {
      if (e.key === 'Escape' && current && onClose) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.classList.remove('is-locked');
      window.removeEventListener('keydown', onKey);
    };
  }, [open, current, onClose]);

  useEffect(() => {
    if (phase === 'pick') panelRef.current?.focus({ preventScroll: true });
  }, [phase]);

  if (!open) return null;

  const choose = (branch) => {
    setLeaving(true);
    window.setTimeout(() => onPick(branch.id), 520);
  };

  return (
    <div
      className={`gate gate--${phase} ${leaving ? 'is-leaving' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      ref={panelRef}
      tabIndex={-1}
    >
      <div className="gate__inner">
        <div className="gate__logo">
          <BoxCafeLogo title="Box Cafe" />
        </div>

        <div className="gate__pick" aria-hidden={phase !== 'pick'}>
          <p className="gate__slogan">For the love of coffee...</p>
          <h1 id="gate-title" className="gate__title">
            Choose your branch
          </h1>
          <ul className="gate__list">
            {branches.map((b, i) => (
              <li key={b.id} style={{ '--i': i }}>
                <button
                  type="button"
                  className={`gate__branch ${current === b.id ? 'is-current' : ''}`}
                  onClick={() => choose(b)}
                  tabIndex={phase === 'pick' ? 0 : -1}
                >
                  <span className="gate__name">{b.name}</span>
                  <span className="gate__hours">{b.hours ? b.hours.join(' · ') : 'Dine-in menu'}</span>
                  <span className="gate__go" aria-hidden="true">
                    <Icon name="arrowRight" size={20} />
                  </span>
                </button>
                <a className="gate__map" href={b.mapsUrl} target="_blank" rel="noopener noreferrer" tabIndex={phase === 'pick' ? 0 : -1}>
                  <Icon name="pin" size={15} /> Directions to {b.name}
                </a>
              </li>
            ))}
          </ul>
          {current && onClose && (
            <button type="button" className="gate__cancel" onClick={onClose} tabIndex={phase === 'pick' ? 0 : -1}>
              Keep the current branch
            </button>
          )}
          <p className="gate__by">By Société Last Exit</p>
        </div>
      </div>
    </div>
  );
}
