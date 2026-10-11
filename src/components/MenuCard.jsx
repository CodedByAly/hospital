import { useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { useLanguage } from '../i18n/LanguageContext';
import { formatPrice, localized } from '../lib/format';
import { flyToCart } from '../lib/flyToCart';
import FoodImage from './FoodImage';
import Icon from './Icon';

export function PromoCard({ item }) {
  const { t, lang } = useLanguage();
  return (
    <article className="promo-card">
      <FoodImage src={item.image} alt={localized(item.name, lang)} className="promo-card__img" />
      <div className="promo-card__body">
        <span className="tag tag--red">{t.menu.promo}</span>
        <h3 className="promo-card__title">{localized(item.name, lang)}</h3>
        <p className="promo-card__desc">{localized(item.description, lang)}</p>
        <p className="promo-card__note">{t.menu.promoNote}</p>
      </div>
    </article>
  );
}

/**
 * Menu item card. The whole card opens the item sheet; the "+" button adds
 * straight to the cart (or opens the sheet when a choice is required).
 */
export default function MenuCard({ item, layout = 'auto' }) {
  const { t, lang } = useLanguage();
  const { add } = useCart();
  const { openItem, notify } = useUI();
  const imgRef = useRef(null);
  const name = localized(item.name, lang);
  const customisable = Boolean(item.extras?.length || item.removable?.length || item.choices);

  const quickAdd = () => {
    if (item.choices) {
      openItem(item.id);
      return;
    }
    add(item.id, { extras: [], removed: [], choice: null, note: '' }, 1);
    flyToCart(imgRef.current);
    notify(t.cart.added(name));
  };

  return (
    <article className={`menu-card menu-card--${layout}`}>
      <FoodImage ref={imgRef} src={item.image} alt={name} className="menu-card__img" />
      <div className="menu-card__body">
        <h3 className="menu-card__title">
          <button type="button" className="menu-card__open" onClick={() => openItem(item.id)}>
            {name}
          </button>
        </h3>
        {item.description ? <p className="menu-card__desc">{localized(item.description, lang)}</p> : null}
        <div className="menu-card__foot">
          <p className="menu-card__price">{formatPrice(item.price, lang)}</p>
          {customisable ? <span className="menu-card__flag">{t.menu.customisable}</span> : null}
        </div>
      </div>
      <button type="button" className="menu-card__add" onClick={quickAdd} aria-label={t.menu.addNamed(name)}>
        <Icon name="plus" size={20} strokeWidth={2} />
      </button>
    </article>
  );
}
