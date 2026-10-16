import { useEffect, useRef, useState } from 'react';
import { branches } from '../data/branches';
import CoffeeBox from './CoffeeBox';
import Icon from './Icon';
import './BranchGate.css';

// Opening scene: the Box Cafe box drops onto the counter, its flaps open and the
// logo card rises out. Under it, the branches are laid out as paper tickets.
// Choosing one stamps the ticket and opens that branch's menu.
const TIMELINE = [
  ['drop', 0],
  ['open', 950],
  ['rise', 1650],
  ['done', 2500],
];
const tilt = [-1.6, 1.1, -0.7];

export default function BranchGate({ open, intro, current, onPick, onClose }) {
  const [stage, setStage] = useState(intro ? 'drop' : 'done');
  const [picked, setPicked] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    setPicked(null);
    setLeaving(false);
    if (!intro) {
      setStage('done');
      return undefined;
    }
    const timers = TIMELINE.map(([s, t]) => setTimeout(() => setStage(s), t));
    return () => timers.forEach(clearTimeout);
  }, [open, intro]);

  useEffect(() => {
    if (!open) return undefined;
    document.documentElement.classList.add('is-locked');
    rootRef.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === 'Escape' && current && onClose) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.classList.remove('is-locked');
      window.removeEventListener('keydown', onKey);
    };
  }, [open, current, onClose]);

  if (!open) return null;

  const ready = stage === 'rise' || stage === 'done';

  const choose = (b) => {
    if (picked) return;
    setPicked(b.id);
    window.setTimeout(() => setLeaving(true), 650);
    window.setTimeout(() => onPick(b.id), 1150);
  };

  // tickets lean toward the pointer a little, like paper picked up off the counter
  const lean = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--lx', `${((e.clientX - r.left) / r.width - 0.5) * 10}deg`);
    el.style.setProperty('--ly', `${((e.clientY - r.top) / r.height - 0.5) * -12}deg`);
  };
  const unlean = (e) => {
    e.currentTarget.style.setProperty('--lx', '0deg');
    e.currentTarget.style.setProperty('--ly', '0deg');
  };

  return (
    <div
      className={`gate ${ready ? 'is-ready' : ''} ${leaving ? 'is-leaving' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      ref={rootRef}
      tabIndex={-1}
    >
      <div className="gate__counter" aria-hidden="true" />
      <div className="gate__inner">
        <div className="gate__scene">
          <CoffeeBox stage={stage} />
        </div>

        <div className="gate__pick" aria-hidden={!ready}>
          <h1 id="gate-title" className="gate__title">
            Where are you sitting today?
          </h1>
          <ul className="gate__tickets">
            {branches.map((b, i) => (
              <li key={b.id} style={{ '--i': i, '--tilt': `${tilt[i % tilt.length]}deg` }}>
                <div className={`ticket ${picked === b.id ? 'is-picked' : ''} ${picked && picked !== b.id ? 'is-dim' : ''}`} onPointerMove={lean} onPointerLeave={unlean}>
                  <button type="button" className="ticket__main" onClick={() => choose(b)} tabIndex={ready ? 0 : -1} aria-label={`${b.name}. Open the menu`}>
                    <span className="ticket__no">No. {String(i + 1).padStart(2, '0')}</span>
                    <span className="ticket__name">{b.name}</span>
                    <span className="ticket__hours">{b.hours ? b.hours.join(' / ') : 'Ask us for today’s hours'}</span>
                    {current === b.id && <span className="ticket__last">your last visit</span>}
                    <span className="ticket__stamp" aria-hidden="true">
                      Welcome
                    </span>
                  </button>
                  <a className="ticket__stub" href={b.mapsUrl} target="_blank" rel="noopener noreferrer" tabIndex={ready ? 0 : -1} aria-label={`Directions to Box Cafe ${b.name}`}>
                    <Icon name="pin" size={18} />
                    <span>Map</span>
                  </a>
                </div>
              </li>
            ))}
          </ul>
          {current && onClose && (
            <button type="button" className="gate__cancel" onClick={onClose} tabIndex={ready ? 0 : -1}>
              Back to the menu
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
