import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useMediaQuery';
import Icon from './Icon';
import './PhotoFlow.css';

// Real studio photos standing in 3D: the one in front faces you, the others turn
// away into depth. Swipe, drag, use the arrows or the keyboard. It advances slowly
// on its own until the guest touches it. Tapping the front photo opens its section.
export default function PhotoFlow({ items, onSelect }) {
  const reduced = useReducedMotion();
  const [pos, setPos] = useState(0); // fractional index while dragging
  const [dragging, setDragging] = useState(false);
  const drag = useRef(null);
  const lastMoved = useRef(0);
  const touched = useRef(false);
  const stageRef = useRef(null);
  const n = items.length;
  const active = ((Math.round(pos) % n) + n) % n;

  useEffect(() => {
    if (reduced) return undefined;
    const t = setInterval(() => {
      if (!touched.current && document.visibilityState === 'visible') setPos((p) => Math.round(p) + 1);
    }, 3600);
    return () => clearInterval(t);
  }, [reduced]);

  const go = (d) => {
    touched.current = true;
    setPos((p) => Math.round(p) + d);
  };

  const onDown = (e) => {
    touched.current = true;
    lastMoved.current = 0;
    drag.current = { x: e.clientX, start: pos, moved: 0 };
    setDragging(true);
  };
  const onMove = (e) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    drag.current.moved = Math.abs(dx);
    if (drag.current.moved > 6) stageRef.current?.setPointerCapture?.(e.pointerId);
    const w = stageRef.current?.offsetWidth ?? 400;
    setPos(drag.current.start - dx / (w * 0.32));
  };
  const onUp = () => {
    if (!drag.current) return;
    lastMoved.current = drag.current.moved;
    setDragging(false);
    setPos((p) => Math.round(p));
    drag.current = null;
  };

  return (
    <div className="flow" onKeyDown={(e) => (e.key === 'ArrowRight' ? go(1) : e.key === 'ArrowLeft' ? go(-1) : null)}>
      <div
        className={`flow__stage ${dragging ? 'is-dragging' : ''}`}
        ref={stageRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        role="group"
        aria-roledescription="gallery"
        aria-label="Box Cafe photos"
      >
        {items.map((item, i) => {
          // signed distance from the front, wrapped around the loop
          let d = i - pos;
          d = ((((d + n / 2) % n) + n) % n) - n / 2;
          const a = Math.abs(d);
          const style = {
            '--d': d.toFixed(3),
            '--a': Math.min(a, 3).toFixed(3),
            zIndex: 100 - Math.round(a * 10),
            opacity: a > 2.6 ? 0 : 1,
          };
          const front = Math.round(a * 100) === 0;
          return (
            <button
              key={item.src}
              type="button"
              className={`flow__card ${front ? 'is-front' : ''}`}
              style={style}
              tabIndex={front ? 0 : -1}
              aria-hidden={a > 0.5}
              aria-label={`${item.label}. Show on the menu`}
              onClick={(e) => {
                if (lastMoved.current > 6) return;
                if (front) onSelect(item);
                else {
                  touched.current = true;
                  setPos((p) => Math.round(p) + Math.round(d));
                }
                e.currentTarget.blur();
              }}
            >
              <img src={item.src} alt={item.label} draggable="false" loading={a < 1.5 ? 'eager' : 'lazy'} />
              <span className="flow__sheen" aria-hidden="true" />
            </button>
          );
        })}
      </div>
      <div className="flow__bar">
        <button type="button" className="flow__arrow" onClick={() => go(-1)} aria-label="Previous photo">
          <Icon name="arrowLeft" size={18} />
        </button>
        <button type="button" className="flow__label" onClick={() => onSelect(items[active])} key={active}>
          <span>{items[active].label}</span>
          <small>See on the menu</small>
        </button>
        <button type="button" className="flow__arrow" onClick={() => go(1)} aria-label="Next photo">
          <Icon name="arrowRight" size={18} />
        </button>
      </div>
    </div>
  );
}
