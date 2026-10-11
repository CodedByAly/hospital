import { useEffect, useRef, useState } from 'react';
import { useUI } from '../context/UIContext';
import { useCart } from '../context/CartContext';
import { itemsById, categoriesById, variantOf, priceOf } from '../data/menu';
import { formatPrice } from '../lib/format';
import { flyToCart } from '../lib/flyToCart';
import Overlay from './Overlay';
import FoodImage, { menuSrc } from './FoodImage';
import QuantityStepper from './QuantityStepper';
import Icon from './Icon';

export default function ItemSheet() {
  const { itemSheet, closeItem } = useUI();
  // Keep the last item on screen while the sheet animates out.
  const [current, setCurrent] = useState(itemSheet);
  useEffect(() => {
    if (itemSheet) setCurrent(itemSheet);
  }, [itemSheet]);
  const item = current && itemsById[current.itemId];

  return (
    <Overlay open={Boolean(itemSheet && item)} onClose={closeItem} variant="dialog" labelledBy="item-title" className="item-sheet">
      {item && <Body key={`${current.itemId}:${current.editKey || ''}:${current.variant || ''}`} item={item} editKey={current.editKey} startVariant={current.variant} />}
    </Overlay>
  );
}

function Body({ item, editKey, startVariant }) {
  const { closeItem } = useUI();
  const { lines, add, replace, maxQty } = useCart();
  const mediaRef = useRef(null);
  const editing = editKey ? lines.find((l) => l.key === editKey) : null;

  const [variant, setVariant] = useState(editing?.variant ?? startVariant ?? item.variants?.[0].id ?? null);
  const [choice, setChoice] = useState(editing?.choice ?? item.choice?.options[0] ?? null);
  const [removed, setRemoved] = useState(editing?.removed ?? []);
  const [note, setNote] = useState(editing?.note ?? '');
  const [qty, setQty] = useState(editing?.qty ?? 1);

  const v = variantOf(item, variant);
  const image = v?.image ?? item.image;
  const description = v?.description ?? item.description;
  const unit = priceOf(item, variant);
  const category = categoriesById[item.category];

  const toggleRemoved = (r) => setRemoved((list) => (list.includes(r) ? list.filter((x) => x !== r) : [...list, r]));

  const submit = () => {
    const line = { itemId: item.id, variant, choice, removed, note, qty };
    if (editing) {
      replace(editing.key, line);
    } else {
      add(line);
      flyToCart(mediaRef.current?.querySelector('img')?.getBoundingClientRect() ?? mediaRef.current?.getBoundingClientRect(), image ? menuSrc(image) : null);
    }
    closeItem();
  };

  return (
    <>
      <div className="item-sheet__scroll" data-scroll>
        <div className="item-sheet__media" ref={mediaRef}>
          <FoodImage key={image || 'none'} name={image} alt={v ? `${item.name}, ${v.label}` : item.name} eager className="item-sheet__food" />
        </div>

        <div className="item-sheet__body">
          <p className="item-sheet__category">{category.name}</p>
          <h2 id="item-title" className="item-sheet__title">
            <span>{item.name}</span>
          </h2>
          <p className="item-sheet__price" aria-live="polite">{formatPrice(unit)}</p>
          {description && <p className="item-sheet__desc">{description}</p>}

          {item.variants && (
            <fieldset className="opt-group">
              <legend className="opt-group__title">{item.id === 'shawarma-1kg' ? 'Chicken or beef' : 'Size'}</legend>
              <div className="variant-grid">
                {item.variants.map((opt) => (
                  <label key={opt.id} className={`variant ${variant === opt.id ? 'is-on' : ''}`}>
                    <input type="radio" name="variant" checked={variant === opt.id} onChange={() => setVariant(opt.id)} />
                    <span className="variant__label">{opt.label}</span>
                    <span className="variant__price">{formatPrice(opt.price)}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {item.choice && (
            <fieldset className="opt-group">
              <legend className="opt-group__title">
                {item.choice.label} <span className="opt-group__req">Required</span>
              </legend>
              <div className="chips">
                {item.choice.options.map((opt) => (
                  <label key={opt} className={`chip ${choice === opt ? 'is-on' : ''}`}>
                    <input type="radio" name="choice" checked={choice === opt} onChange={() => setChoice(opt)} />
                    <span className="chip__tick" aria-hidden="true">
                      <Icon name="check" size={14} strokeWidth={2.4} />
                    </span>
                    {opt}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {item.remove?.length > 0 && (
            <fieldset className="opt-group">
              <legend className="opt-group__title">Remove ingredients</legend>
              <p className="opt-group__hint">Tap anything you’d like left out.</p>
              <div className="chips">
                {item.remove.map((r) => {
                  const off = removed.includes(r);
                  return (
                    <label key={r} className={`chip chip--remove ${off ? 'is-on' : ''}`}>
                      <input type="checkbox" checked={off} onChange={() => toggleRemoved(r)} />
                      <span className="chip__label">{r}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          <div className="opt-group">
            <label className="opt-group__title" htmlFor="item-note">
              Special request
            </label>
            <textarea
              id="item-note"
              className="field__input field__input--area"
              rows={2}
              maxLength={200}
              placeholder="Well done, extra crispy, cut in half…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="item-sheet__footer">
        <QuantityStepper value={qty} onChange={setQty} max={maxQty} />
        <button type="button" className="btn btn--primary btn--block item-sheet__add" onClick={submit} data-autofocus>
          <span>{editing ? 'Update item' : 'Add to cart'}</span>
          <span className="item-sheet__total">{formatPrice(unit * qty)}</span>
        </button>
      </div>

      <button type="button" className="icon-btn item-sheet__close" onClick={closeItem} aria-label="Close">
        <Icon name="close" />
      </button>
    </>
  );
}
