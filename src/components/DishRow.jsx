import { useRef } from 'react';
import { useI18n } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { needsChoice } from '../data/menu';
import { emptySelection } from '../lib/cart';
import { flyToCart } from '../lib/flyToCart';
import FoodImage from './FoodImage';
import Icon from './Icon';
import Price from './Price';
import './DishRow.css';

export default function DishRow({ item, headingLevel = 3 }) {
  const { t, pick } = useI18n();
  const { add } = useCart();
  const { openItem, announce } = useUI();
  const addRef = useRef(null);
  const thumbRef = useRef(null);
  const Heading = `h${headingLevel}`;
  const name = pick(item.name);
  const price = item.variants ? item.variants.options[0].price : item.price;
  const hasHalf = item.variants?.options.some((o) => o.id === 'half');

  const quickAdd = () => {
    if (needsChoice(item) && !item.variants) {
      openItem(item.id);
      return;
    }
    add(item.id, emptySelection(item));
    flyToCart(thumbRef.current || addRef.current, item.image);
    announce(t('cart.added', { name }));
  };

  return (
    <article className={`dish ${item.image ? 'dish--has-image' : ''}`}>
      <div className="dish__text">
        <Heading className="dish__name">
          <button type="button" className="dish__open" onClick={() => openItem(item.id)}>
            {name}
          </button>
        </Heading>
        {item.description && <p className="dish__desc">{pick(item.description)}</p>}
        <div className="dish__meta">
          <Price value={price} className="dish__price" />
          {hasHalf && (
            <span className="dish__variant">
              {pick(item.variants.options[1].name)} <Price value={item.variants.options[1].price} />
            </span>
          )}
          {item.spicy && <span className="tag">{t('common.spicy')}</span>}
        </div>
      </div>

      {item.image && (
        <div className="dish__thumb" ref={thumbRef}>
          <FoodImage src={item.image} alt={name} ratio="1 / 1" />
        </div>
      )}

      <button
        ref={addRef}
        type="button"
        className="dish__add"
        onClick={quickAdd}
        aria-label={t('common.addNamed', { name })}
      >
        <Icon name="plus" size={20} strokeWidth={1.8} />
      </button>
    </article>
  );
}
