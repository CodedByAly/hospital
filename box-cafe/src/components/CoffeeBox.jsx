import { useEffect, useRef } from 'react';
import { BoxCafeLogo } from './Logo';
import './CoffeeBox.css';

// A kraft cardboard box built from real 3D faces: four walls (outside and inside),
// a floor and four hinged flaps. `stage` drives the story:
//   'drop'  the closed box falls onto the table
//   'open'  the flaps swing open
//   'rise'  the Box Cafe card rises out of the box
//   'done'  resting, open, card up
export default function CoffeeBox({ stage = 'done', interactive = true }) {
  const rootRef = useRef(null);

  // The box turns a little toward the pointer, and keeps a gentle idle sway.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !interactive) return undefined;
    let raf = 0;
    let target = { x: 0, y: 0 };
    let cur = { x: 0, y: 0 };
    const start = performance.now();
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const onMove = (e) => {
      const p = e.touches ? e.touches[0] : e;
      target = { x: p.clientX / window.innerWidth - 0.5, y: p.clientY / window.innerHeight - 0.5 };
    };
    const tick = (now) => {
      const t = (now - start) / 1000;
      const sway = reduced ? 0 : Math.sin(t * 0.6) * 6;
      cur.x += (target.x - cur.x) * 0.06;
      cur.y += (target.y - cur.y) * 0.06;
      el.style.setProperty('--ry', `${-28 + sway + cur.x * 30}deg`);
      el.style.setProperty('--rx', `${-20 + cur.y * -10}deg`);
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('touchmove', onMove);
    };
  }, [interactive]);

  return (
    <div className={`cbox cbox--${stage}`} ref={rootRef} aria-hidden="true">
      <div className="cbox__drop">
        <div className="cbox__body">
          <div className="cbox__shadow" />

          {/* walls: outside faces */}
          <div className="cbox__face cbox__front">
            <span className="cbox__print">
              <BoxCafeLogo decorative />
            </span>
            <span className="cbox__label">By Société Last Exit</span>
          </div>
          <div className="cbox__face cbox__back" />
          <div className="cbox__face cbox__side cbox__right">
            <span className="cbox__arrows">&#8593;&#8593;</span>
          </div>
          <div className="cbox__face cbox__side cbox__left" />

          {/* walls: inside faces, darker */}
          <div className="cbox__face cbox__in cbox__in-front" />
          <div className="cbox__face cbox__in cbox__in-back" />
          <div className="cbox__face cbox__side cbox__in cbox__in-right" />
          <div className="cbox__face cbox__side cbox__in cbox__in-left" />
          <div className="cbox__floor" />

          {/* the card that rises out */}
          <div className="cbox__card">
            <BoxCafeLogo decorative />
            <span>For the love of coffee...</span>
          </div>

          {/* flaps */}
          <div className="cbox__flap cbox__flap--front">
            <i className="cbox__tape" />
          </div>
          <div className="cbox__flap cbox__flap--back">
            <i className="cbox__tape" />
          </div>
          <div className="cbox__flap cbox__flap--side cbox__flap--right" />
          <div className="cbox__flap cbox__flap--side cbox__flap--left" />
        </div>
      </div>
    </div>
  );
}
