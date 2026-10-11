import { useEffect, useRef, useState } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import { formatPrice } from '../lib/format.js';
import { flyToCart } from '../lib/flyToCart.js';
import { prefersReducedMotion } from '../lib/motion.js';
import Icon from './Icon.jsx';

/*
 * Small card on the hero photo that cycles through a few items.
 * Tap the card to open the item, or "+" to add it straight to the order.
 * Pauses while hovered or focused.
 */
export default function HeroPicks({ items }) {
  const { addLine, openItem } = useShop();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const imgRef = useRef(null);
  const item = items[index];

  useEffect(() => {
    if (paused || prefersReducedMotion() || items.length < 2) return undefined;
    const t = setTimeout(() => setIndex((i) => (i + 1) % items.length), 3200);
    return () => clearTimeout(t);
  }, [index, paused, items.length]);

  if (!item) return null;

  const add = () => {
    flyToCart(imgRef.current);
    addLine({ itemId: item.id, quantity: 1, options: {}, addons: [], removed: [], note: '' });
  };

  return (
    <div
      className="hero-pick"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <button type="button" key={item.id} className="hero-pick__item" onClick={() => openItem(item.id)}>
        <img ref={imgRef} src={item.image} alt="" width="224" height="224" />
        <span className="hero-pick__text">
          <span className="hero-pick__name">{item.name}</span>
          <span className="hero-pick__price">{formatPrice(item.price)}</span>
        </span>
      </button>
      <button type="button" className="hero-pick__add" onClick={add} aria-label={`Add ${item.name} to order`}>
        <Icon name="plus" size={20} strokeWidth={2.4} />
      </button>
      <span className="hero-pick__bar" key={`bar-${index}-${paused}`} aria-hidden="true" />
    </div>
  );
}
