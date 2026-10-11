import { useEffect, useMemo, useRef, useState } from 'react';
import { getItem, categories } from '../data/menu.js';
import { useShop, unitPriceCents } from '../context/ShopContext.jsx';
import { formatCents, formatPrice } from '../lib/format.js';
import { flyToCart } from '../lib/flyToCart.js';
import Dialog from './Dialog.jsx';
import FoodImage from './FoodImage.jsx';
import Icon from './Icon.jsx';
import QuantityStepper from './QuantityStepper.jsx';
import './ItemDialog.css';

function defaultSelection(item) {
  const options = {};
  for (const group of item.options) {
    if (group.required && group.choices[0]) options[group.id] = group.choices[0].id;
  }
  return { quantity: 1, options, addons: [], removed: [], note: '' };
}

export default function ItemDialog() {
  const { itemDialog, closeItem } = useShop();
  // Keep the last item around while the dialog animates closed.
  const [current, setCurrent] = useState(itemDialog);
  useEffect(() => {
    if (itemDialog) setCurrent(itemDialog);
  }, [itemDialog]);

  const item = current ? getItem(current.itemId) : null;

  return (
    <Dialog open={Boolean(itemDialog)} onClose={closeItem} labelledBy="item-dialog-title" className="item-dialog">
      {item && <ItemForm key={`${current.itemId}-${current.editKey ?? 'new'}`} item={item} editKey={current.editKey} />}
    </Dialog>
  );
}

function ItemForm({ item, editKey }) {
  const { lines, addLine, replaceLine, closeItem, openCart } = useShop();
  const editing = editKey ? lines.find((l) => l.key === editKey) : null;
  const [selection, setSelection] = useState(() =>
    editing
      ? { quantity: editing.quantity, options: { ...editing.options }, addons: [...editing.addons], removed: [...editing.removed], note: editing.note }
      : defaultSelection(item),
  );
  const imageRef = useRef(null);
  const category = categories.find((c) => c.id === item.category);

  const unit = useMemo(() => unitPriceCents(item, selection), [item, selection]);
  const total = unit * selection.quantity;

  const missingRequired = item.options.filter((g) => g.required && !selection.options[g.id]);

  const toggleRemoved = (ingredient) =>
    setSelection((s) => ({
      ...s,
      removed: s.removed.includes(ingredient) ? s.removed.filter((r) => r !== ingredient) : [...s.removed, ingredient],
    }));

  const toggleAddon = (id) =>
    setSelection((s) => ({ ...s, addons: s.addons.includes(id) ? s.addons.filter((a) => a !== id) : [...s.addons, id] }));

  const submit = (event) => {
    event.preventDefault();
    if (missingRequired.length) return;
    const line = {
      itemId: item.id,
      quantity: selection.quantity,
      options: selection.options,
      addons: selection.addons,
      removed: selection.removed,
      note: selection.note.trim(),
    };
    if (editing) {
      replaceLine(editing.key, line);
      closeItem();
      openCart();
    } else {
      flyToCart(imageRef.current);
      addLine(line);
      closeItem();
    }
  };

  return (
    <form className="item-form" onSubmit={submit}>
      <div className="item-form__media">
        <FoodImage ref={imageRef} src={item.image} alt={item.name} eager className="item-form__img" />
        <button type="button" className="icon-btn item-form__close" onClick={closeItem} aria-label="Close">
          <Icon name="close" />
        </button>
      </div>

      <div className="item-form__body">
        <div className="item-form__scroll">
          <p className="eyebrow">{category?.name}</p>
          <h2 id="item-dialog-title" className="item-form__title">{item.name}</h2>
          <p className="item-form__price">
            {formatPrice(item.price)}
            {item.pieces && <span className="item-form__pieces">{item.pieces}</span>}
          </p>
          {item.description && <p className="item-form__desc">{item.description}</p>}

          {item.options.map((group) => (
            <fieldset key={group.id} className="choice-group">
              <legend>
                {group.label}
                {group.required && <span className="choice-group__req">Required</span>}
              </legend>
              {group.choices.map((choice) => (
                <label key={choice.id} className="choice">
                  <input
                    type="radio"
                    name={`opt-${group.id}`}
                    checked={selection.options[group.id] === choice.id}
                    onChange={() => setSelection((s) => ({ ...s, options: { ...s.options, [group.id]: choice.id } }))}
                  />
                  <span className="choice__label">{choice.label}</span>
                  {choice.price > 0 && <span className="choice__price">+{formatPrice(choice.price)}</span>}
                </label>
              ))}
            </fieldset>
          ))}

          {item.addons.length > 0 && (
            <fieldset className="choice-group">
              <legend>Add extras</legend>
              {item.addons.map((addon) => (
                <label key={addon.id} className="choice">
                  <input type="checkbox" checked={selection.addons.includes(addon.id)} onChange={() => toggleAddon(addon.id)} />
                  <span className="choice__label">{addon.label}</span>
                  <span className="choice__price">+{formatPrice(addon.price)}</span>
                </label>
              ))}
            </fieldset>
          )}

          {item.removable.length > 0 && (
            <fieldset className="choice-group">
              <legend>
                Leave anything out?
                <span className="choice-group__hint">Tap to remove</span>
              </legend>
              <div className="chips">
                {item.removable.map((ingredient) => {
                  const removed = selection.removed.includes(ingredient);
                  return (
                    <button
                      type="button"
                      key={ingredient}
                      className={`chip ${removed ? 'is-removed' : ''}`}
                      aria-pressed={removed}
                      onClick={() => toggleRemoved(ingredient)}
                    >
                      {removed && <Icon name="close" size={14} strokeWidth={2.2} />}
                      {removed ? `No ${ingredient.toLowerCase()}` : ingredient}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          <label className="field item-form__note">
            <span className="field__label">
              Note for the kitchen <span className="field__optional">optional</span>
            </span>
            <textarea
              rows={2}
              maxLength={140}
              value={selection.note}
              placeholder={item.category === 'drinks' ? 'e.g. which soft drink you’d like' : 'e.g. extra crispy, sauce on the side'}
              onChange={(e) => setSelection((s) => ({ ...s, note: e.target.value }))}
            />
          </label>
        </div>

        <div className="item-form__footer">
          <QuantityStepper value={selection.quantity} onChange={(quantity) => setSelection((s) => ({ ...s, quantity }))} />
          <button type="submit" className="btn btn--primary btn--block" disabled={missingRequired.length > 0}>
            <span>{editing ? 'Update item' : 'Add to order'}</span>
            <span className="btn__price">{formatCents(total)}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
