import { useEffect, useMemo, useRef, useState } from 'react';
import { getItem, categories } from '../data/menu.js';
import { useShop, unitPriceCents } from '../context/ShopContext.jsx';
import { formatPrice, whatsappHref } from '../lib/format.js';
import { site } from '../config/site.js';
import { flyToCart } from '../lib/flyToCart.js';
import Dialog from './Dialog.jsx';
import FoodImage from './FoodImage.jsx';
import Icon from './Icon.jsx';
import QuantityStepper from './QuantityStepper.jsx';
import AnimatedPrice from './AnimatedPrice.jsx';
import './ItemDialog.css';

function defaultSelection(item) {
  // Required choices start empty so the customer picks deliberately.
  return { quantity: 1, options: {}, addons: [], removed: [], note: '' };
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
  const addBtnRef = useRef(null);
  const category = categories.find((c) => c.id === item.category);

  const orderable = item.price != null;
  const unit = useMemo(() => (orderable ? unitPriceCents(item, selection) : 0), [item, selection, orderable]);
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
    if (missingRequired.length || !orderable) return;
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
      flyToCart(item.image ? imageRef.current : null, { from: addBtnRef.current, label: item.name, quantity: selection.quantity });
      addLine(line);
      closeItem();
    }
  };

  return (
    <form className={`item-form ${item.image ? '' : 'item-form--noimg'}`} onSubmit={submit}>
      {item.image && (
        <div className="item-form__media">
          <FoodImage ref={imageRef} src={item.image} alt={item.name} eager className="item-form__img" />
        </div>
      )}
      <button type="button" className={`icon-btn item-form__close ${item.image ? '' : 'item-form__close--plain'}`} onClick={closeItem} aria-label="Close">
        <Icon name="close" />
      </button>

      <div className="item-form__body">
        <div className="item-form__scroll">
          <p className="eyebrow">{category?.name}</p>
          <h2 id="item-dialog-title" className="item-form__title">{item.name}</h2>
          <p className="item-form__price">
            {orderable ? formatPrice(item.price) : 'Ask for price'}
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
                Remove ingredients
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
              Notes <span className="field__optional">optional</span>
            </span>
            <textarea
              rows={2}
              maxLength={140}
              value={selection.note}
              placeholder={item.category === 'drinks' ? 'e.g. Pepsi' : 'e.g. well done'}
              onChange={(e) => setSelection((s) => ({ ...s, note: e.target.value }))}
            />
          </label>
        </div>

        <div className="item-form__footer">
          {orderable ? (
            <>
              <QuantityStepper value={selection.quantity} onChange={(quantity) => setSelection((s) => ({ ...s, quantity }))} />
              <button ref={addBtnRef} type="submit" className="btn btn--primary btn--block" disabled={missingRequired.length > 0}>
                <span>{missingRequired.length ? `Choose ${missingRequired[0].label.replace(/^Choose your /i, '').toLowerCase()}` : editing ? 'Update item' : 'Add to order'}</span>
                <AnimatedPrice className="btn__price" cents={total} />
              </button>
            </>
          ) : (
            <a className="btn btn--primary btn--block" href={whatsappHref(site.whatsapp, `Hi Burger Bar, how much is the ${item.name}?`)} target="_blank" rel="noopener noreferrer">
              Ask the price on WhatsApp
            </a>
          )}
        </div>
      </div>
    </form>
  );
}
