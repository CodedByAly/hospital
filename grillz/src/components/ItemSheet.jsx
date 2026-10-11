import { useEffect, useRef, useState } from 'react';
import { useUI } from '../context/UIContext';
import { useCart, unitPrice } from '../context/CartContext';
import { itemsById, categoriesById, ADDONS, currencyOf } from '../data/menu';
import { formatPrice } from '../lib/format';
import { flyToCart } from '../lib/flyToCart';
import Overlay from './Overlay';
import QuantityStepper from './QuantityStepper';
import ItemName from './ItemName';
import Icon from './Icon';

export default function ItemSheet() {
  const { itemSheet, closeItem } = useUI();
  const [current, setCurrent] = useState(itemSheet);
  useEffect(() => {
    if (itemSheet) setCurrent(itemSheet);
  }, [itemSheet]);
  const item = current && itemsById[current.itemId];
  return (
    <Overlay open={Boolean(itemSheet && item)} onClose={closeItem} variant="dialog" labelledBy="item-title" className="item-sheet">
      {item && <Body key={`${current.itemId}:${current.editKey || ''}`} item={item} editKey={current.editKey} />}
    </Overlay>
  );
}

function Body({ item, editKey }) {
  const { closeItem } = useUI();
  const { lines, add, replace, maxQty } = useCart();
  const editing = editKey ? lines.find((l) => l.key === editKey) : null;
  const [removed, setRemoved] = useState(editing?.removed ?? []);
  const [addons, setAddons] = useState(editing?.addons ?? []);
  const [note, setNote] = useState(editing?.note ?? '');
  const [qty, setQty] = useState(editing?.qty ?? 1);
  const headRef = useRef(null);
  const cur = currencyOf(item);
  const unit = unitPrice({ itemId: item.id, addons, removed: [] });
  const toggle = (setList) => (v) => setList((list) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]));

  const submit = () => {
    const line = { itemId: item.id, removed, addons, note, qty };
    if (editing) replace(editing.key, line);
    else {
      add(line);
      flyToCart(headRef.current?.querySelector('.item-sheet__flame')?.getBoundingClientRect(), null);
    }
    closeItem();
  };

  return (
    <>
      <div className="item-sheet__scroll" data-scroll>
        <header className="item-sheet__head" ref={headRef}>
          <span className="item-sheet__flame" aria-hidden="true"><Icon name="flame" size={22} /></span>
          <p className="item-sheet__category">{categoriesById[item.category].name}</p>
          <h2 id="item-title" className="item-sheet__title"><ItemName item={item} /></h2>
          {item.description && <p className="item-sheet__desc">{item.description}</p>}
          <div className="item-sheet__meta">
            <span className="item-sheet__price">{formatPrice(item.price, cur)}</span>
            {item.pieces && <span className="pcs">{item.pieces} pcs</span>}
            {item.spicy && <span className="tag tag--hot"><Icon name="flame" size={14} /> Spicy</span>}
          </div>
        </header>

        <div className="item-sheet__body">
          {item.remove?.length > 0 && (
            <fieldset className="opt-group">
              <legend className="opt-group__title">Remove ingredients</legend>
              <p className="opt-group__hint">Tap anything you’d like left out.</p>
              <div className="chips">
                {item.remove.map((r) => {
                  const off = removed.includes(r);
                  return (
                    <label key={r} className={`chip chip--remove ${off ? 'is-on' : ''}`}>
                      <input type="checkbox" checked={off} onChange={() => toggle(setRemoved)(r)} />
                      <span className="chip__label">{r}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {item.addons && (
            <fieldset className="opt-group">
              <legend className="opt-group__title">Add-ons</legend>
              <ul className="opt-list">
                {ADDONS.map((a) => {
                  const on = addons.includes(a.id);
                  return (
                    <li key={a.id}>
                      <label className={`opt-row ${on ? 'is-on' : ''}`}>
                        <input type="checkbox" checked={on} onChange={() => toggle(setAddons)(a.id)} />
                        <span className="opt-row__box" aria-hidden="true"><Icon name="check" size={14} strokeWidth={2.4} /></span>
                        <span className="opt-row__name">{a.name}</span>
                        <span className="opt-row__price">+{formatPrice(a.price)}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          )}

          <div className="opt-group">
            <label className="opt-group__title" htmlFor="item-note">Special request</label>
            <textarea id="item-note" className="field__input field__input--area" rows={2} maxLength={200} placeholder="Well done, sauce on the side, cut in half…" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="item-sheet__footer">
        <QuantityStepper value={qty} onChange={setQty} max={maxQty} />
        <button type="button" className="btn btn--primary btn--block item-sheet__add" onClick={submit} data-autofocus>
          <span>{editing ? 'Update item' : 'Add to cart'}</span>
          <span className="item-sheet__total">{formatPrice(unit * qty, cur)}</span>
        </button>
      </div>
      <button type="button" className="icon-btn item-sheet__close" onClick={closeItem} aria-label="Close"><Icon name="close" /></button>
    </>
  );
}
