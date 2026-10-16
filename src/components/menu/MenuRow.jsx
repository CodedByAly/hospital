import { formatPrice } from '../../lib/format';
import DishImage from '../DishImage';

// Printed-menu style line for sections that are mostly without photos
// (drinks fridge, argili, sweets). Dishes that do have a photo show it small.
export default function MenuRow({ item, onOpen, showCategory = false }) {
  // In search results every row gets a thumbnail (or placeholder) so the list lines up.
  const withThumb = Boolean(item.image) || showCategory;
  const unavailable = item.price == null;

  return (
    <li className="menu-row">
      <button type="button" className="menu-row__open" onClick={() => onOpen(item)} aria-label={`${item.name}, ${unavailable ? 'price on request' : formatPrice(item.price)}. View details`}>
        {withThumb && (
          <span className="menu-row__thumb">
            <DishImage item={item} size="sm" sizes="64px" />
          </span>
        )}
        <span className="menu-row__text">
          {showCategory && <span className="menu-row__cat">{item.categoryName}</span>}
          <span className="menu-row__head">
            <span className="menu-row__name">{item.name}</span>
            <span className="menu-row__leader" aria-hidden="true" />
            <span className="menu-row__price">{unavailable ? 'Ask staff' : formatPrice(item.price)}</span>
          </span>
          {item.description && <span className="menu-row__desc">{item.description}</span>}
        </span>
      </button>
    </li>
  );
}
