import { useId, useRef, useState } from 'react';
import { itemsById } from '../data/menu';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { useLanguage } from '../i18n/LanguageContext';
import { formatPrice, localized } from '../lib/format';
import { unitPrice } from '../lib/cart';
import { flyToCart } from '../lib/flyToCart';
import Sheet from './Sheet';
import FoodImage from './FoodImage';
import QtyStepper from './QtyStepper';
import Icon from './Icon';

function ItemForm({ item, line, onDone }) {
  const { t, lang } = useLanguage();
  const { add, replace } = useCart();
  const { notify } = useUI();
  const titleId = useId();
  const imgRef = useRef(null);

  const [extras, setExtras] = useState(line?.config.extras ?? []);
  const [removed, setRemoved] = useState(line?.config.removed ?? []);
  const [choice, setChoice] = useState(line?.config.choice ?? null);
  const [note, setNote] = useState(line?.config.note ?? '');
  const [qty, setQty] = useState(line?.qty ?? 1);
  const [choiceError, setChoiceError] = useState(false);

  const config = { extras, removed, choice, note: note.trim() };
  const total = unitPrice(item, config) * qty;
  const name = localized(item.name, lang);

  const toggle = (list, setList, id) =>
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const submit = (e) => {
    e.preventDefault();
    if (item.choices && !choice) {
      setChoiceError(true);
      document.getElementById(`${titleId}-choice`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (line) {
      replace(line.key, item.id, config, qty);
    } else {
      add(item.id, config, qty);
      flyToCart(imgRef.current, item.cutout);
      notify(t.cart.added(name));
    }
    onDone();
  };

  return (
    <form className="item-sheet" onSubmit={submit} noValidate>
      <button type="button" className="icon-button item-sheet__close" onClick={onDone} aria-label={t.common.close}>
        <Icon name="close" size={20} />
      </button>

      <div className="item-sheet__scroll">
        <FoodImage ref={imgRef} src={item.image} alt={name} eager className="item-sheet__img" />

        <div className="item-sheet__body">
          <h2 id={titleId} className="item-sheet__title">{name}</h2>
          <p className="item-sheet__price">{formatPrice(item.price, lang)}</p>
          {item.description ? <p className="item-sheet__desc">{localized(item.description, lang)}</p> : null}

          {item.choices ? (
            <fieldset
              className={`option-group ${choiceError ? 'has-error' : ''}`}
              id={`${titleId}-choice`}
              aria-describedby={choiceError ? `${titleId}-choice-err` : undefined}
            >
              <legend>
                {localized(item.choices.label, lang)}
                <span className="option-group__badge">{t.common.required}</span>
              </legend>
              {item.choices.options.map((o) => (
                <label key={o.id} className="option">
                  <input
                    type="radio"
                    name={`${titleId}-choice`}
                    value={o.id}
                    checked={choice === o.id}
                    onChange={() => {
                      setChoice(o.id);
                      setChoiceError(false);
                    }}
                  />
                  <span className="option__control option__control--radio" aria-hidden="true" />
                  <span className="option__name">{localized(o.name, lang)}</span>
                </label>
              ))}
              {choiceError ? (
                <p className="field-error" id={`${titleId}-choice-err`}>{t.item.chooseFirst}</p>
              ) : null}
            </fieldset>
          ) : null}

          {item.extras?.length ? (
            <fieldset className="option-group">
              <legend>
                {t.item.extras}
                <span className="option-group__badge option-group__badge--muted">{t.common.optional}</span>
              </legend>
              {item.extras.map((x) => (
                <label key={x.id} className="option">
                  <input type="checkbox" checked={extras.includes(x.id)} onChange={() => toggle(extras, setExtras, x.id)} />
                  <span className="option__control" aria-hidden="true">
                    <Icon name="check" size={14} strokeWidth={2.6} />
                  </span>
                  <span className="option__name">{localized(x.name, lang)}</span>
                  <span className="option__price">+{formatPrice(x.price, lang)}</span>
                </label>
              ))}
            </fieldset>
          ) : null}

          {item.removable?.length ? (
            <fieldset className="option-group">
              <legend>
                {t.item.remove}
                <span className="option-group__hint">{t.item.removeHint}</span>
              </legend>
              <div className="chips">
                {item.removable.map((r) => {
                  const off = removed.includes(r.id);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      className={`chip ${off ? 'is-off' : ''}`}
                      aria-pressed={off}
                      onClick={() => toggle(removed, setRemoved, r.id)}
                    >
                      {off ? <Icon name="close" size={14} strokeWidth={2.2} /> : null}
                      <span>{localized(r.name, lang)}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ) : null}

          <div className="option-group">
            <label className="field-label" htmlFor={`${titleId}-note`}>
              {t.item.notes}
              <span className="option-group__badge option-group__badge--muted">{t.common.optional}</span>
            </label>
            <textarea
              id={`${titleId}-note`}
              className="input"
              rows={2}
              maxLength={140}
              value={note}
              placeholder={t.item.notesPlaceholder}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="item-sheet__footer">
        <QtyStepper value={qty} onChange={setQty} />
        <button type="submit" className="btn btn--primary btn--block item-sheet__add">
          <span>{line ? t.item.update : t.item.addToCart}</span>
          <span className="btn__price">{formatPrice(total, lang)}</span>
        </button>
      </div>
    </form>
  );
}

/** Global item sheet, driven by UIContext. Keeps the last item mounted while closing. */
export default function ItemSheet() {
  const { itemSheet, closeItem } = useUI();
  const { lang } = useLanguage();
  const last = useRef(null);
  if (itemSheet) last.current = itemSheet;
  const current = itemSheet ?? last.current;
  const item = current ? itemsById[current.itemId] : null;

  return (
    <Sheet open={Boolean(itemSheet && item)} onClose={closeItem} label={item ? localized(item.name, lang) : undefined} className="overlay__panel--item">
      {item ? (
        <ItemForm key={`${item.id}-${current.line?.key ?? 'new'}`} item={item} line={current.line} onDone={closeItem} />
      ) : null}
    </Sheet>
  );
}
