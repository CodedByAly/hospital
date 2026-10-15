import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { addonGroups, categories, ingredients, itemsById } from '../data/menu';
import { emptySelection, unitPrice } from '../lib/cart';
import { flyToCart } from '../lib/flyToCart';
import { formatPrice } from '../lib/format';
import Dialog from './Dialog';
import FoodImage from './FoodImage';
import Icon from './Icon';
import Price from './Price';
import QuantityStepper from './QuantityStepper';
import './ItemSheet.css';

function OptionGroup({ title, hint, children }) {
  return (
    <fieldset className="item-sheet__group">
      <legend className="item-sheet__group-head">
        <span className="item-sheet__group-title">{title}</span>
        {hint && <span className="item-sheet__group-hint">{hint}</span>}
      </legend>
      <div className="choice-list">{children}</div>
    </fieldset>
  );
}

function ItemSheetContent({ item, line, onDone }) {
  const { t, pick } = useI18n();
  const { add, replace } = useCart();
  const { announce } = useUI();
  const [selection, setSelection] = useState(() => (line ? structuredClone(line.selection) : emptySelection(item)));
  const [qty, setQty] = useState(line ? line.qty : 1);
  const [showError, setShowError] = useState(false);
  const imageRef = useRef(null);

  const unit = unitPrice(item, selection);
  const total = Math.round(unit * qty * 100) / 100;
  const missingChoice = Boolean(item.choices && !selection.choice);
  const category = categories.find((c) => c.id === item.category);
  const titleId = `item-title-${item.id}`;

  const toggleIn = (key, id) =>
    setSelection((s) => ({
      ...s,
      [key]: s[key].includes(id) ? s[key].filter((x) => x !== id) : [...s[key], id],
    }));

  const submit = () => {
    if (missingChoice) {
      setShowError(true);
      return;
    }
    const clean = { ...selection, note: selection.note.trim() };
    if (line) {
      replace(line.key, clean, qty);
    } else {
      add(item.id, clean, qty);
      flyToCart(imageRef.current, item.image);
      announce(t('cart.added', { name: pick(item.name) }));
    }
    onDone();
  };

  return (
    <>
      <button type="button" className="item-sheet__close" onClick={onDone} aria-label={t('common.close')}>
        <Icon name="close" size={22} />
      </button>

      <div className="item-sheet__scroll">
        <div className="item-sheet__media" ref={imageRef}>
          <FoodImage
            src={item.image}
            alt={pick(item.name)}
            ratio="4 / 3"
            eager
            label={pick(category?.name)}
          />
        </div>

        <div className="item-sheet__body">
          <header className="item-sheet__head">
            <h2 id={titleId} className="item-sheet__title">{pick(item.name)}</h2>
            <div className="item-sheet__meta">
              <Price value={item.variants ? item.variants.options[0].price : item.price} className="item-sheet__price" />
              {item.spicy && <span className="tag">{t('common.spicy')}</span>}
            </div>
            {item.description && <p className="item-sheet__desc">{pick(item.description)}</p>}
          </header>

          {item.variants && (
            <OptionGroup title={pick(item.variants.name)} hint={t('common.required')}>
              {item.variants.options.map((option) => (
                <label key={option.id} className="choice">
                  <input
                    type="radio"
                    name={`variant-${item.id}`}
                    checked={selection.variant === option.id}
                    onChange={() => setSelection((s) => ({ ...s, variant: option.id }))}
                  />
                  <span className="choice__control" />
                  <span className="choice__body"><span className="choice__title">{pick(option.name)}</span></span>
                  <Price value={option.price} className="choice__price" />
                </label>
              ))}
            </OptionGroup>
          )}

          {item.choices && (
            <OptionGroup title={pick(item.choices.name)} hint={t('item.choose')}>
              {item.choices.options.map((option) => (
                <label key={option.id} className="choice">
                  <input
                    type="radio"
                    name={`choice-${item.id}`}
                    checked={selection.choice === option.id}
                    onChange={() => {
                      setSelection((s) => ({ ...s, choice: option.id }));
                      setShowError(false);
                    }}
                  />
                  <span className="choice__control" />
                  <span className="choice__body"><span className="choice__title">{pick(option.name)}</span></span>
                </label>
              ))}
              {showError && missingChoice && (
                <p className="field__error" role="alert">{t('item.chooseFirst')}</p>
              )}
            </OptionGroup>
          )}

          {(item.addons || []).map((groupId) => {
            const group = addonGroups[groupId];
            return (
              <OptionGroup key={groupId} title={pick(group.name)} hint={t('common.optional')}>
                {group.options.map((option) => (
                  <label key={option.id} className="choice">
                    <input
                      type="checkbox"
                      checked={selection.addons.includes(option.id)}
                      onChange={() => toggleIn('addons', option.id)}
                    />
                    <span className="choice__control choice__control--box"><Icon name="check" size={14} strokeWidth={2.4} /></span>
                    <span className="choice__body"><span className="choice__title">{pick(option.name)}</span></span>
                    <span className="choice__price ltr">+{formatPrice(option.price)}</span>
                  </label>
                ))}
              </OptionGroup>
            );
          })}

          {item.removable?.length > 0 && (
            <OptionGroup title={t('item.remove')} hint={t('common.optional')}>
              <div className="item-sheet__chips">
                {item.removable.map((id) => {
                  const removed = selection.removed.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      className={`chip ${removed ? 'is-removed' : ''}`}
                      aria-pressed={removed}
                      onClick={() => toggleIn('removed', id)}
                    >
                      <Icon name={removed ? 'close' : 'check'} size={14} strokeWidth={2} />
                      {removed ? t('item.without', { name: pick(ingredients[id]) }) : pick(ingredients[id])}
                    </button>
                  );
                })}
              </div>
            </OptionGroup>
          )}

          <div className="item-sheet__group">
            <label className="field">
              <span className="item-sheet__group-title">{t('item.instructions')}</span>
              <textarea
                className="input"
                rows={2}
                maxLength={200}
                value={selection.note}
                onChange={(e) => setSelection((s) => ({ ...s, note: e.target.value }))}
                placeholder={item.noteHint ? pick(item.noteHint) : t('item.instructionsPlaceholder')}
              />
            </label>
          </div>
        </div>
      </div>

      <footer className="item-sheet__footer">
        <QuantityStepper value={qty} onChange={setQty} />
        <button type="button" className="btn item-sheet__add" onClick={submit} aria-disabled={missingChoice}>
          <span>{line ? t('item.updateItem') : t('item.addToOrder')}</span>
          <Price value={total} />
        </button>
      </footer>
    </>
  );
}

export default function ItemSheet() {
  const { itemSheet, closeItem } = useUI();
  const { lines } = useCart();
  const [current, setCurrent] = useState(null);

  // Keep the last item rendered during the closing animation.
  useEffect(() => {
    if (itemSheet) setCurrent(itemSheet);
  }, [itemSheet]);

  const item = current ? itemsById[current.itemId] : null;
  const line = useMemo(
    () => (current?.lineKey ? lines.find((l) => l.key === current.lineKey) : null),
    // Only look the line up when the sheet opens, not on every cart change.
    [current], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <Dialog
      open={Boolean(itemSheet && itemsById[itemSheet.itemId])}
      onClose={closeItem}
      labelledBy={item ? `item-title-${item.id}` : undefined}
      className="item-sheet"
    >
      {item && (
        <ItemSheetContent
          key={`${current.itemId}-${current.lineKey || 'new'}-${current.openedAt || ''}`}
          item={item}
          line={line}
          onDone={closeItem}
        />
      )}
    </Dialog>
  );
}
