import { useCallback, useEffect, useRef, useState } from 'react';
import { formatPrice } from '../lib/format';
import { useReducedMotion } from '../hooks/useMediaQuery';
import DishImage from './DishImage';
import Icon from './Icon';
import './Carousel3D.css';

const AUTO_SPEED = 7; // degrees per second
const FRICTION = 0.94;

// A ring of dishes standing on Talia's terrazzo table. Spins slowly on its own,
// can be dragged or flicked, and brings any focused dish to the front.
export default function Carousel3D({ items, onSelect }) {
  const reduced = useReducedMotion();
  const stageRef = useRef(null);
  const ringRef = useRef(null);
  const cardRefs = useRef([]);
  const state = useRef({ angle: 0, target: null, velocity: 0, dragging: false, moved: 0, lastX: 0, lastT: 0, visible: true, hover: false });
  const [radius, setRadius] = useState(320);
  const [front, setFront] = useState(0);
  const step = 360 / items.length;

  // Ring radius follows the card size set in CSS.
  useEffect(() => {
    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      const w = card.offsetWidth;
      setRadius(Math.round(w / 2 / Math.tan(Math.PI / items.length) + w * 0.3));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [items.length]);

  const paint = useCallback(() => {
    const s = state.current;
    if (ringRef.current) ringRef.current.style.transform = `translateZ(${-radius}px) rotateY(${s.angle}deg)`;
    let best = 0;
    let bestFace = -2;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const face = Math.cos(((i * step + s.angle) * Math.PI) / 180);
      card.style.setProperty('--face', face.toFixed(3));
      if (face > bestFace) {
        bestFace = face;
        best = i;
      }
    });
    setFront((f) => (f === best ? f : best));
  }, [radius, step]);

  // Animation loop: auto-rotation, inertia after a flick, and easing to a target.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      const s = state.current;
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

    const stage = stageRef.current;
    const io = new IntersectionObserver(([e]) => {
      state.current.visible = e.isIntersecting;
    });
    if (stage) io.observe(stage);
    const onVis = () => {
      state.current.visible = document.visibilityState === 'visible';
      last = performance.now();
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [paint, reduced]);

  const bringToFront = (i) => {
    const s = state.current;
    // shortest rotation to put card i at angle 0
    let target = -i * step;
    const turns = Math.round((s.angle - target) / 360);
    target += turns * 360;
    s.velocity = 0;
    s.target = target;
  };

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    const s = state.current;
    s.dragging = true;
    s.moved = 0;
    s.lastX = e.clientX;
    s.lastT = performance.now();
    s.velocity = 0;
    s.target = null;
  };
  const onPointerMove = (e) => {
    const s = state.current;
    const stage = stageRef.current;
    if (stage && e.pointerType === 'mouse') {
      const r = stage.getBoundingClientRect();
      const ny = (e.clientY - r.top) / r.height - 0.5;
      const nx = (e.clientX - r.left) / r.width - 0.5;
      stage.style.setProperty('--tilt-x', `${(-ny * 5).toFixed(2)}deg`);
      stage.style.setProperty('--tilt-y', `${(nx * 4).toFixed(2)}deg`);
    }
    if (!s.dragging) return;
    const dx = e.clientX - s.lastX;
    const now = performance.now();
    s.moved += Math.abs(dx);
    if (s.moved > 6 && !stage.hasPointerCapture?.(e.pointerId)) stage.setPointerCapture?.(e.pointerId);
    const deg = dx * 0.32;
    s.angle += deg;
    s.velocity = (deg / Math.max(1, now - s.lastT)) * 1000;
    s.lastX = e.clientX;
    s.lastT = now;
  };
  const endDrag = () => {
    const s = state.current;
    if (!s.dragging) return;
    s.dragging = false;
    s.velocity = Math.max(-420, Math.min(420, s.velocity));
  };

  const handleClick = (i, e) => {
    if (state.current.moved > 6) {
      e.preventDefault();
      return;
    }
    if (i !== front) {
      bringToFront(i);
      return;
    }
    onSelect(items[i]);
  };

  const current = items[front];

  return (
    <div className="carousel3d">
      <div
        className="carousel3d__stage"
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerEnter={() => (state.current.hover = true)}
        onPointerLeave={(e) => {
          state.current.hover = false;
          endDrag(e);
          stageRef.current?.style.setProperty('--tilt-x', '0deg');
          stageRef.current?.style.setProperty('--tilt-y', '0deg');
        }}
      >
        <div className="carousel3d__scene">
          <div className="carousel3d__ring" ref={ringRef} role="list" aria-label="Signature dishes">
            {items.map((item, i) => (
              <div
                key={item.id}
                role="listitem"
                className="carousel3d__card"
                ref={(el) => (cardRefs.current[i] = el)}
                style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)` }}
              >
                <button
                  type="button"
                  className="carousel3d__button"
                  onClick={(e) => handleClick(i, e)}
                  onFocus={() => bringToFront(i)}
                  tabIndex={i === front ? 0 : -1}
                  aria-label={`${item.name}, ${formatPrice(item.price)}. View dish`}
                  draggable="false"
                >
                  <DishImage item={item} size="sm" eager={i < 3} sizes="200px" />
                  <span className="carousel3d__gloss" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="carousel3d__shadow" aria-hidden="true" />
      </div>

      <div className="carousel3d__caption">
        <button type="button" className="carousel3d__nav" onClick={() => bringToFront((front - 1 + items.length) % items.length)} aria-label="Previous dish">
          <Icon name="arrowLeft" size={18} />
        </button>
        <button type="button" className="carousel3d__label" onClick={() => onSelect(current)} key={current.id}>
          <span className="carousel3d__name">{current.name}</span>
          <span className="carousel3d__price">{formatPrice(current.price)}</span>
        </button>
        <button type="button" className="carousel3d__nav" onClick={() => bringToFront((front + 1) % items.length)} aria-label="Next dish">
          <Icon name="arrowRight" size={18} />
        </button>
      </div>
    </div>
  );
}
