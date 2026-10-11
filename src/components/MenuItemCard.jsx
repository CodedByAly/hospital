import { useRef, useState } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import { formatPrice } from '../lib/format.js';
import { flyToCart } from '../lib/flyToCart.js';
import FoodImage from './FoodImage.jsx';
import Icon from './Icon.jsx';
import './MenuItemCard.css';

/*
 * The whole card opens the item; the round "+" adds one straight to the order
 * (with the flying-photo animation) for people who already know what they want.
 */
export default function MenuItemCard({ item, layout = 'row' }) {
  const { openItem, addLine } = useShop();
  const imgRef = useRef(null);
  const addRef = useRef(null);
  const [added, setAdded] = useState(false);
  const needsChoice = item.options.some((g) => g.required);

  const quickAdd = (event) => {
    event.stopPropagation();
    if (needsChoice) return openItem(item.id);
    flyToCart(item.image ? imgRef.current : null, { from: addRef.current, label: item.name });
    setAdded(true);
    clearTimeout(addRef.timer);
    addRef.timer = setTimeout(() => setAdded(false), 1100);
    addLine({ itemId: item.id, quantity: 1, options: {}, addons: [], removed: [], note: '' });
  };

  return (
    <article className={`menu-card menu-card--${layout} ${item.image ? '' : 'menu-card--noimg'} ${added ? 'is-flash' : ''}`}>
      <button type="button" className="menu-card__open" onClick={() => openItem(item.id)} aria-label={`${item.name}, ${formatPrice(item.price)}. View details`} />
      {item.image && <FoodImage ref={imgRef} src={item.image} alt={item.name} className="menu-card__img" />}
      <div className="menu-card__body">
        <h3 className="menu-card__name">{item.name}</h3>
        {item.pieces && <p className="menu-card__pieces">{item.pieces}</p>}
        {item.description && <p className="menu-card__desc">{item.description}</p>}
        <div className="menu-card__foot">
          <span className="menu-card__price">{formatPrice(item.price)}</span>
          <button ref={addRef} type="button" className={`menu-card__add ${added ? 'is-added' : ''}`} onClick={quickAdd} aria-label={`Add ${item.name} to order`}>
            <Icon name={added ? 'check' : 'plus'} size={18} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </article>
  );
}
