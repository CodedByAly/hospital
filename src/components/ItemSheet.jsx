import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import { categoriesById, itemsById } from '../data/menu';
import { flyToCart } from '../lib/flyToCart';
import { cents, money } from '../lib/format';
import CategoryVisual from './CategoryVisual';
import Dialog from './Dialog';
import { CheckIcon, CloseIcon } from './Icons';
import QtyStepper from './QtyStepper';
import './ItemSheet.css';

const NOTE_MAX = 140;

function initialState(editLine) {
  if (editLine) {
    return {
      optionId: editLine.optionId || null,
      removed: editLine.removed || [],
      addons: editLine.addons?.map((a) => (typeof a === 'string' ? a : a.id)) || [],
      note: editLine.note || '',
      qty: editLine.qty,
    };
  }
  return {
    optionId: null,
    removed: [],
    addons: [],
    note: '',
    qty: 1,
  };
}

/** Item details + customisation. Opens from anywhere via useCart().openItem(id). */
export default function ItemSheet() {
  const { activeItem, closeItem, lines, add, replace } = useCart();
  const open = Boolean(activeItem);

  // Keep showing the last item while the sheet animates out.
  const [shown, setShown] = useState(activeItem);
  useEffect(() => {
    if (activeItem) setShown(activeItem);
  }, [activeItem]);

  const item = shown ? itemsById.get(shown.itemId) : null;
  const editLine = shown?.editKey ? lines.find((l) => l.key === shown.editKey) : null;

  return (
    <Dialog open={open && Boolean(item)} onClose={closeItem} labelledBy="item-sheet-title" className="item-sheet">
      {item && (
        <ItemForm
          key={`${shown.itemId}:${shown.editKey || ''}`}
          item={item}
          editLine={editLine}
          onClose={closeItem}
          onSubmit={(line, imgEl) => {
            if (editLine) {
              replace(editLine.key, line);
              closeItem();
            } else {
              add(line);
              closeItem();
              flyToCart(imgEl);
            }
          }}
        />
      )}
    </Dialog>
  );
}

function ItemForm({ item, editLine, onClose, onSubmit }) {
  const category = categoriesById.get(item.categoryId);
  const [state, setState] = useState(() => initialState(editLine));
  const [showError, setShowError] = useState(false);
  const imgRef = useRef(null);
  const visualRef = useRef(null);
  const ids = useId();

  const option = item.options?.choices.find((c) => c.id === state.optionId) || null;
  const addons = (item.addons || []).filter((a) => state.addons.includes(a.id));
  const unit = useMemo(() => {
    const base = item.options ? option?.price ?? Math.min(...item.options.choices.map((c) => c.price)) : item.price;
    return cents(base + addons.reduce((s, a) => s + a.price, 0));
  }, [item, option, addons]);
  const needsOption = Boolean(item.options) && !option;

  const toggle = (key, value) =>
    setState((s) => ({
      ...s,
      [key]: s[key].includes(value) ? s[key].filter((v) => v !== value) : [...s[key], value],
    }));

  const submit = (e) => {
    e.preventDefault();
    if (needsOption) {
      setShowError(true);
      document.getElementById(`${ids}-options`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    onSubmit(
      {
        itemId: item.id,
        optionId: option?.id || null,
        removed: state.removed,
        addons: state.addons,
        note: state.note.trim(),
        qty: state.qty,
      },
      imgRef.current || visualRef.current,
    );
  };

  return (
    <form className="item-sheet__inner" onSubmit={submit} noValidate>
      <button type="button" className="item-sheet__close icon-btn" onClick={onClose} aria-label="Close">
        <CloseIcon size={22} />
      </button>

      <div className="item-sheet__media" ref={visualRef}>
        <CategoryVisual category={category} imgRef={imgRef} eager />
      </div>

      <div className="item-sheet__body">
        <div className="item-sheet__scroll">
          <header className="item-sheet__head">
            <p className="item-sheet__cat">{category.name}</p>
            <h2 id="item-sheet-title" className="display item-sheet__title">
              {item.name}
            </h2>
            {item.description && <p className="item-sheet__desc">{item.description}</p>}
            <p className="item-sheet__price">
              <span className="price-tag">
                {item.options && !option && <small>FROM</small>}
                {money(unit)}
              </span>
            </p>
          </header>

          {item.options && (
            <fieldset className="opt-group" id={`${ids}-options`} aria-describedby={showError && needsOption ? `${ids}-opt-err` : undefined}>
              <legend className="opt-group__legend">
                {item.options.label}
                <span className={`opt-group__badge ${showError && needsOption ? 'is-error' : ''}`}>Required</span>
              </legend>
              <div className="opt-choices">
                {item.options.choices.map((choice) => (
                  <label key={choice.id} className={`opt-choice ${state.optionId === choice.id ? 'is-on' : ''}`}>
                    <input
                      type="radio"
                      name={`${ids}-option`}
                      value={choice.id}
                      checked={state.optionId === choice.id}
                      onChange={() => {
                        setState((s) => ({ ...s, optionId: choice.id }));
                        setShowError(false);
                      }}
                    />
                    <span className="opt-choice__dot" aria-hidden="true" />
                    <span className="opt-choice__name">{choice.name}</span>
                    <span className="opt-choice__price">{money(choice.price)}</span>
                  </label>
                ))}
              </div>
              {showError && needsOption && (
                <p className="field__error" id={`${ids}-opt-err`} role="alert">
                  Choose a size to continue.
                </p>
              )}
            </fieldset>
          )}

          {item.addons?.length > 0 && (
            <fieldset className="opt-group">
              <legend className="opt-group__legend">
                Add extras <span className="opt-group__badge">Optional</span>
              </legend>
              <div className="opt-choices">
                {item.addons.map((addon) => (
                  <label key={addon.id} className={`opt-choice ${state.addons.includes(addon.id) ? 'is-on' : ''}`}>
                    <input type="checkbox" checked={state.addons.includes(addon.id)} onChange={() => toggle('addons', addon.id)} />
                    <span className="opt-choice__box" aria-hidden="true">
                      <CheckIcon size={14} />
                    </span>
                    <span className="opt-choice__name">{addon.name}</span>
                    <span className="opt-choice__price">+{money(addon.price)}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {item.removable?.length > 0 && (
            <fieldset className="opt-group">
              <legend className="opt-group__legend">
                Leave anything out? <span className="opt-group__badge">Optional</span>
              </legend>
              <div className="chips">
                {item.removable.map((ing) => {
                  const off = state.removed.includes(ing);
                  return (
                    <label key={ing} className={`chip ${off ? 'is-off' : ''}`}>
                      <input type="checkbox" checked={off} onChange={() => toggle('removed', ing)} />
                      <span className="chip__mark" aria-hidden="true">
                        {off ? <CloseIcon size={13} /> : <CheckIcon size={13} />}
                      </span>
                      <span>{off ? `No ${ing.toLowerCase()}` : ing}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          <div className="opt-group">
            <label className="opt-group__legend" htmlFor={`${ids}-note`}>
              Note for the kitchen <span className="opt-group__badge">Optional</span>
            </label>
            <textarea
              id={`${ids}-note`}
              className="input item-sheet__note"
              rows={2}
              maxLength={NOTE_MAX}
              placeholder="Anything we should know?"
              value={state.note}
              onChange={(e) => setState((s) => ({ ...s, note: e.target.value }))}
            />
          </div>
        </div>

        <footer className="item-sheet__foot">
          <QtyStepper value={state.qty} onChange={(qty) => setState((s) => ({ ...s, qty }))} min={1} label={item.name} />
          <button type="submit" className="btn btn--primary btn--lg item-sheet__add">
            <span>{editLine ? 'Update' : 'Add to order'}</span>
            <span className="item-sheet__add-total">{money(cents(unit * state.qty))}</span>
          </button>
        </footer>
      </div>
    </form>
  );
}
