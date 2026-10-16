import { useRef, useState } from 'react';
import { getItem } from '../../data/menu';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';
import { formatPrice } from '../../lib/format';
import { unitPrice } from '../../lib/pricing';
import { flyToCart } from '../../lib/flyToCart';
import Sheet from '../Sheet';
import DishImage from '../DishImage';
import Icon from '../Icon';
import './ItemSheet.css';

function OptionGroups({ item, selection, setSelection, showErrors }) {
  return (
    <>
      {(item.options ?? []).map((group) => {
        const chosen = selection.options?.[group.id];
        const missing = group.required && !chosen && showErrors;
        return (
          <fieldset key={group.id} className="item-sheet__group">
            <legend>
              {group.label}
              <span className={`item-sheet__req ${missing ? 'is-missing' : ''}`}>{group.required ? 'Required' : 'Optional'}</span>
            </legend>
            {group.choices.map((c) => (
              <label key={c.id} className="choice">
                <input
                  type="radio"
                  name={`opt-${group.id}`}
                  checked={chosen === c.id}
                  onChange={() => setSelection((s) => ({ ...s, options: { ...s.options, [group.id]: c.id } }))}
                />
                <span className="choice__label">{c.label}</span>
                {c.price ? <span className="choice__price">+{formatPrice(c.price)}</span> : null}
              </label>
            ))}
          </fieldset>
        );
      })}
      {item.addons?.length > 0 && (
        <fieldset className="item-sheet__group">
          <legend>
            Add-ons <span className="item-sheet__req">Optional</span>
          </legend>
          {item.addons.map((a) => {
            const on = selection.addons?.includes(a.id) ?? false;
            return (
              <label key={a.id} className="choice">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() =>
                    setSelection((s) => ({
                      ...s,
                      addons: on ? s.addons.filter((x) => x !== a.id) : [...(s.addons ?? []), a.id],
                    }))
                  }
                />
                <span className="choice__label">{a.label}</span>
                {a.price ? <span className="choice__price">+{formatPrice(a.price)}</span> : null}
              </label>
            );
          })}
        </fieldset>
      )}
    </>
  );
}

function ItemDetails({ item, line, onDone }) {
  const { add, replace } = useCart();
  const { showToast } = useUI();
  const [qty, setQty] = useState(line?.qty ?? 1);
  const [note, setNote] = useState(line?.note ?? '');
  const [selection, setSelection] = useState(line?.selection ?? { options: {}, addons: [] });
  const [showErrors, setShowErrors] = useState(false);
  const mediaRef = useRef(null);

  const unit = unitPrice(item, selection);
  const available = unit != null;
  const missingRequired = (item.options ?? []).some((g) => g.required && !selection.options?.[g.id]);
  const isFood = item.groupId === 'food' || item.groupId === 'sweets';

  const submit = (e) => {
    e.preventDefault();
    if (!available) return;
    if (missingRequired) {
      setShowErrors(true);
      return;
    }
    if (line) {
      replace(line.key, item.id, qty, selection, note);
      showToast('Order updated');
    } else {
      add(item.id, qty, selection, note);
      flyToCart(mediaRef.current);
      showToast(`${qty > 1 ? `${qty} × ` : ''}${item.name} added to your order`);
    }
    onDone();
  };

  return (
    <form className="item-sheet" onSubmit={submit}>
      <div className="item-sheet__media" ref={mediaRef}>
        <DishImage item={item} size="lg" eager sizes="(max-width: 899px) 100vw, 470px" />
      </div>

      <div className="item-sheet__content">
        <button type="button" className="item-sheet__close icon-btn" onClick={onDone} aria-label="Close">
          <Icon name="close" size={20} />
        </button>

        <div className="item-sheet__scroll">
          <p className="item-sheet__cat">{item.categoryName}</p>
          <h2 id="item-sheet-title" className="item-sheet__title">
            {item.name}
          </h2>
          {item.description && <p className="item-sheet__desc">{item.description}</p>}
          <p className="item-sheet__price">{available ? formatPrice(item.price) : 'Price available from our staff'}</p>

          <OptionGroups item={item} selection={selection} setSelection={setSelection} showErrors={showErrors} />

          {available && (
            <div className="field item-sheet__note">
              <label htmlFor="item-note">
                Requests <span className="optional">(optional)</span>
              </label>
              <textarea
                id="item-note"
                className="input"
                rows={2}
                maxLength={140}
                placeholder={isFood ? 'e.g. no tomatoes, no onions' : 'e.g. less sugar, no ice'}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          )}
        </div>

        {available ? (
          <div className="item-sheet__footer">
            <div className="stepper stepper--lg" role="group" aria-label="Quantity">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="One less">
                <Icon name="minus" size={18} />
              </button>
              <output aria-live="polite">{qty}</output>
              <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="One more">
                <Icon name="plus" size={18} />
              </button>
            </div>
            <button type="submit" className="btn btn--wine item-sheet__submit">
              <span>{line ? 'Update order' : 'Add to order'}</span>
              <span className="item-sheet__total">{formatPrice(unit * qty)}</span>
            </button>
          </div>
        ) : (
          <div className="item-sheet__footer">
            <p className="item-sheet__na">This item isn&rsquo;t available to order online yet. Ask our team at the counter.</p>
          </div>
        )}
      </div>
    </form>
  );
}

export default function ItemSheet() {
  const { itemView, closeItem } = useUI();
  const { lines } = useCart();
  // Keep the last item around so the sheet can animate out with its content.
  const last = useRef(null);
  if (itemView) last.current = itemView;
  const view = itemView ?? last.current;
  const item = view ? getItem(view.itemId) : null;
  const line = view?.lineKey ? lines.find((l) => l.key === view.lineKey) : null;

  return (
    <Sheet open={Boolean(itemView && item)} onClose={closeItem} labelledBy="item-sheet-title" className="sheet--item">
      {item && <ItemDetails key={`${item.id}-${view.lineKey ?? 'new'}`} item={item} line={line} onDone={closeItem} />}
    </Sheet>
  );
}
