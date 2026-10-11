import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';

/*
 * Horizontal rail with arrow buttons and mouse drag-to-scroll (touch devices
 * already swipe natively).
 */
export default function OfferRail({ children, className = '', label }) {
  const ref = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    let down = null;
    const onDown = (e) => {
      if (e.pointerType !== 'mouse') return;
      down = { x: e.clientX, left: el.scrollLeft, moved: false };
      el.classList.add('is-dragging');
    };
    const onMove = (e) => {
      if (!down) return;
      const dx = e.clientX - down.x;
      if (Math.abs(dx) > 4) down.moved = true;
      el.scrollLeft = down.left - dx;
    };
    const onUp = () => {
      down = null;
      el.classList.remove('is-dragging');
    };
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  const scrollBy = (dir) => {
    const el = ref.current;
    el?.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div className="rail">
      <ul ref={ref} className={className} aria-label={label}>
        {children}
      </ul>
      <button type="button" className="rail__arrow rail__arrow--prev" onClick={() => scrollBy(-1)} disabled={edges.start} aria-label="Previous">
        <Icon name="arrowLeft" size={20} />
      </button>
      <button type="button" className="rail__arrow rail__arrow--next" onClick={() => scrollBy(1)} disabled={edges.end} aria-label="Next">
        <Icon name="arrowRight" size={20} />
      </button>
    </div>
  );
}
