import { useRef } from 'react';
import { formatPrice } from '../../lib/format';
import { useFinePointer } from '../../hooks/useMediaQuery';
import DishImage from '../DishImage';
import Icon from '../Icon';

// Photo-led card. On desktop it tilts toward the cursor like a card picked up off the table.
export default function MenuCard({ item, onOpen, onAdd, index = 0 }) {
  const cardRef = useRef(null);
  const mediaRef = useRef(null);
  const fine = useFinePointer();

  const onMove = (e) => {
    if (!fine) return;
    const el = cardRef.current;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${((0.5 - y) * 7).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((x - 0.5) * 9).toFixed(2)}deg`);
    el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
    el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    const el = cardRef.current;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  const unavailable = item.price == null;

  return (
    <article
      className="menu-card"
      ref={cardRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ '--i': index }}
    >
      <button type="button" className="menu-card__open" onClick={() => onOpen(item)} aria-label={`${item.name}, ${unavailable ? 'price on request' : formatPrice(item.price)}. View details`}>
        <span className="menu-card__media" ref={mediaRef}>
          <DishImage item={item} size="sm" sizes="(max-width: 639px) 112px, (max-width: 1100px) 33vw, 290px" />
          <span className="menu-card__glare" aria-hidden="true" />
        </span>
        <span className="menu-card__body">
          <span className="menu-card__name">{item.name}</span>
          {item.description && <span className="menu-card__desc">{item.description}</span>}
          <span className="menu-card__price">{unavailable ? 'Ask our staff' : formatPrice(item.price)}</span>
        </span>
      </button>
      {!unavailable && (
        <button
          type="button"
          className="menu-card__add"
          onClick={() => onAdd(item, mediaRef.current)}
          aria-label={`Add ${item.name} to your order`}
        >
          <Icon name="plus" size={18} strokeWidth={2} />
        </button>
      )}
    </article>
  );
}
