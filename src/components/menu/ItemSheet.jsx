import { useRef } from 'react';
import { getItem } from '../../data/menu';
import { useUI } from '../../context/UIContext';
import { formatPrice } from '../../lib/format';
import Sheet from '../Sheet';
import DishImage from '../DishImage';
import Icon from '../Icon';
import './ItemSheet.css';

// A closer look at one dish: photo, description and price.
export default function ItemSheet() {
  const { itemId, closeItem } = useUI();
  // Keep the last item around so the sheet can animate out with its content.
  const last = useRef(null);
  if (itemId) last.current = itemId;
  const item = getItem(itemId ?? last.current);

  return (
    <Sheet open={Boolean(itemId && item)} onClose={closeItem} labelledBy="item-sheet-title" className="sheet--item">
      {item && (
        <article className="item-sheet" key={item.id}>
          <div className="item-sheet__media">
            <DishImage item={item} size="lg" eager sizes="(max-width: 899px) 100vw, 470px" />
          </div>
          <div className="item-sheet__content">
            <button type="button" className="item-sheet__close icon-btn" onClick={closeItem} aria-label="Close">
              <Icon name="close" size={20} />
            </button>
            <div className="item-sheet__scroll">
              <p className="item-sheet__cat">{item.categoryName}</p>
              <h2 id="item-sheet-title" className="item-sheet__title">
                {item.name}
              </h2>
              {item.description && <p className="item-sheet__desc">{item.description}</p>}
              <p className="item-sheet__price">{item.price == null ? 'Ask our staff for the price' : formatPrice(item.price)}</p>
            </div>
          </div>
        </article>
      )}
    </Sheet>
  );
}
