import { useCallback, useEffect, useRef, useState } from 'react';
import { img } from '../data/menu';
import { useReducedMotion } from '../hooks/useMediaQuery';
import Icon from './Icon';
import './Shelf3D.css';

const AUTO_SPEED = 9; // degrees per second
const FRICTION = 0.94;

// Box Cafe products standing in a slowly turning ring. Drag or flick to spin;
// tapping the front product jumps to its section of the menu.
export default function Shelf3D({ items, onSelect }) {
  const reduced = useReducedMotion();
  const stageRef = useRef(null);
  const ringRef = useRef(null);
  const woodRef = useRef(null);
  const cardRefs = useRef([]);
  const st = useRef({ angle: 0, target: null, velocity: 0, dragging: false, moved: 0, lastX: 0, lastT: 0, visible: true, hover: false });
  const [radius, setRadius] = useState(300);
  const [front, setFront] = useState(0);
  const step = 360 / items.length;

  useEffect(() => {
    const measure = () => {
      const w = cardRefs.current[0]?.offsetWidth ?? 150;
      setRadius(Math.round(w / 2 / Math.tan(Math.PI / items.length) + w * 0.18));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [items.length]);

  const paint = useCallback(() => {
    const s = st.current;
    if (ringRef.current) ringRef.current.style.transform = `translateZ(${-radius}px) rotateY(${s.angle}deg)`;
    if (woodRef.current) woodRef.current.style.transform = `rotate(${-s.angle}deg)`;
    let best = 0;
    let bestFace = -2;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const face = Math.cos(((i * step + s.angle) * Math.PI) / 180);
      card.style.setProperty('--face', face.toFixed(3));
      // stand each product upright facing the guest, like real items on a turning tray
      card.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px) rotateY(${-(i * step + s.angle)}deg)`;
      if (face > bestFace) {
        bestFace = face;
        best = i;
      }
    });
    setFront((f) => (f === best ? f : best));
  }, [radius, step]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      const s = st.current;
      if (!s.dragging) {
        if (s.target != null) {
          const diff = s.target - s.angle;
          s.angle += diff * Math.min(1, dt * 7);
          if (Math.abs(diff) < 0.05) {
            s.angle = s.target;
            s.target = null;
          }
        } else if (Math.abs(s.velocity) > 0.5) {
          s.angle += s.velocity * dt;
          s.velocity *= Math.pow(FRICTION, dt * 60);
        } else if (!reduced && s.visible && !s.hover) {
          s.angle -= AUTO_SPEED * dt;
        }
      }
      paint();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const io = new IntersectionObserver(([e]) => {
      st.current.visible = e.isIntersecting;
    });
    if (stageRef.current) io.observe(stageRef.current);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [paint, reduced]);

  const bringToFront = (i) => {
    const s = st.current;
    let target = -i * step;
    target += Math.round((s.angle - target) / 360) * 360;
    s.velocity = 0;
    s.target = target;
  };

  const onDown = (e) => {
    const s = st.current;
    s.dragging = true;
    s.moved = 0;
    s.lastX = e.clientX;
    s.lastT = performance.now();
    s.velocity = 0;
    s.target = null;
  };
  const onMove = (e) => {
    const s = st.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.lastX;
    const now = performance.now();
    s.moved += Math.abs(dx);
    if (s.moved > 6) stageRef.current?.setPointerCapture?.(e.pointerId);
    const deg = dx * 0.35;
    s.angle += deg;
    s.velocity = (deg / Math.max(1, now - s.lastT)) * 1000;
    s.lastX = e.clientX;
    s.lastT = now;
  };
  const onUp = () => {
    const s = st.current;
    if (!s.dragging) return;
    s.dragging = false;
    s.velocity = Math.max(-420, Math.min(420, s.velocity));
  };

  const click = (i, e) => {
    if (st.current.moved > 6) {
      e.preventDefault();
      return;
    }
    if (i !== front) bringToFront(i);
    else onSelect(items[i]);
  };

  const current = items[front];

  return (
    <div className="shelf">
      <div
        className="shelf__stage"
        ref={stageRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerEnter={() => (st.current.hover = true)}
        onPointerLeave={() => {
          st.current.hover = false;
          onUp();
        }}
      >
        <div className="shelf__tray" style={{ '--r': `${Math.round(radius * 0.92)}px` }} aria-hidden="true">
          <div className="shelf__wood" ref={woodRef} />
        </div>
        <div className="shelf__scene">
          <div className="shelf__ring" ref={ringRef}>
            {items.map((item, i) => (
              <div
                key={item.image}
                className="shelf__item"
                ref={(el) => (cardRefs.current[i] = el)}
              >
                <button
                  type="button"
                  className="shelf__button"
                  onClick={(e) => click(i, e)}
                  onFocus={() => bringToFront(i)}
                  tabIndex={i === front ? 0 : -1}
                  aria-label={`${item.label}. Go to this section`}
                  draggable="false"
                >
                  <img src={img(item.image)} alt="" draggable="false" loading={i < 4 ? 'eager' : 'lazy'} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="shelf__floor" aria-hidden="true" />
      </div>
      <div className="shelf__caption">
        <button type="button" className="shelf__nav" onClick={() => bringToFront((front - 1 + items.length) % items.length)} aria-label="Previous">
          <Icon name="arrowLeft" size={18} />
        </button>
        <button type="button" className="shelf__label" onClick={() => onSelect(current)} key={current.image}>
          {current.label}
          <Icon name="arrowRight" size={16} />
        </button>
        <button type="button" className="shelf__nav" onClick={() => bringToFront((front + 1) % items.length)} aria-label="Next">
          <Icon name="arrowRight" size={18} />
        </button>
      </div>
    </div>
  );
}
