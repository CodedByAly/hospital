import { useEffect, useMemo, useRef, useState } from 'react';
import { useUI } from '../context/UIContext';
import { useCart, unitPrice } from '../context/CartContext';
import { useLanguage } from '../i18n/LanguageContext';
import { itemsById, sauces, allowsExtras, categoriesById, SAUCE_PRICE } from '../data/menu';
import { formatPrice, tr } from '../lib/format';
import { flyToCart } from '../lib/flyToCart';
import Overlay from './Overlay';
import FoodImage, { foodSrc } from './FoodImage';
import QuantityStepper from './QuantityStepper';
import Price from './Price';
import Icon from './Icon';

export default function ItemSheet() {
  const { itemSheet, closeItem } = useUI();
  // Keep the last item rendered while the sheet animates out.
  const [current, setCurrent] = useState(itemSheet);
  useEffect(() => {
    if (itemSheet) setCurrent(itemSheet);
  }, [itemSheet]);

  const item = current && itemsById[current.itemId];

  return (
    <Overlay open={Boolean(itemSheet && item)} onClose={closeItem} variant="dialog" labelledBy="item-sheet-title" className="item-sheet">
      {item && <ItemSheetBody key={`${current.itemId}:${current.editKey || ''}`} item={item} editKey={current.editKey} />}
    </Overlay>
  );
}

function ItemSheetBody({ item, editKey }) {
  const { t, lang } = useLanguage();
  const { closeItem } = useUI();
  const { lines, add, replace, maxQty } = useCart();
  const mediaRef = useRef(null);

  const editing = editKey ? lines.find((l) => l.key === editKey) : null;
  const [qty, setQty] = useState(editing?.qty ?? 1);
  const [removed, setRemoved] = useState(editing?.removed ?? []);
  const [extras, setExtras] = useState(editing?.extras ?? []);
  const [picked, setPicked] = useState(editing?.sauces ?? []);
  const [note, setNote] = useState(editing?.note ?? '');

  const removable = (item.ingredients || []).filter((i) => i.removable);
  const canExtras = allowsExtras(item);
  const included = item.includedSauces || 0;
  const name = tr(item.name, lang);
  const category = categoriesById[item.category];

  const line = { itemId: item.id, qty, removed, extras, sauces: picked, note };
  const total = useMemo(() => unitPrice({ itemId: item.id, extras }) * qty, [item.id, extras, qty]);

  const toggle = (list, setList, value, limit) => {
    if (list.includes(value)) setList(list.filter((v) => v !== value));
    else if (!limit || list.length < limit) setList([...list, value]);
  };

  const submit = () => {
    if (editing) {
      replace(editing.key, line);
      closeItem();
      return;
    }
    add(line);
    const media = mediaRef.current;
    const rect = media?.getBoundingClientRect();
    flyToCart(rect, item.image ? foodSrc(item.image) : null);
    closeItem();
  };

  const description = item.ingredients || item.contents;

  return (
    <>
      <div className="item-sheet__scroll" data-scroll>
        <div className="item-sheet__media" ref={mediaRef}>
          <FoodImage name={item.image} alt={name} eager sizes="(min-width: 768px) 440px, 100vw" />
        </div>

        <div className="item-sheet__body">
          <p className="item-sheet__category">{tr(category.name, lang)}</p>
          <h2 id="item-sheet-title" className="item-sheet__title">
            {name}
            {item.note && <span className="item-sheet__note"> ({tr(item.note, lang)})</span>}
          </h2>
          <Price value={item.price} className="item-sheet__price" />

          {description && (
            <p className="item-sheet__desc">
              {description.map((d) => tr(d, lang)).join(lang === 'ar' ? '، ' : ', ')}
            </p>
          )}

          {included > 0 && (
            <fieldset className="opt-group">
              <legend className="opt-group__title">{t.item.pickSauces(included)}</legend>
              <p className="opt-group__hint">{t.item.pickSaucesHint(included, picked.length)}</p>
              <div className="chips">
                {sauces.map((s) => {
                  const on = picked.includes(s.id);
                  const full = !on && picked.length >= included;
                  return (
                    <label key={s.id} className={`chip ${on ? 'is-on' : ''} ${full ? 'is-muted' : ''}`}>
                      <input
                        type="checkbox"
                        checked={on}
                        disabled={full}
                        onChange={() => toggle(picked, setPicked, s.id, included)}
                      />
                      <span className="chip__tick" aria-hidden="true">
                        <Icon name="check" size={14} strokeWidth={2.4} />
                      </span>
                      {tr(s.name, lang)}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {removable.length > 0 && (
            <fieldset className="opt-group">
              <legend className="opt-group__title">{t.item.without}</legend>
              <p className="opt-group__hint">{t.item.withoutHint}</p>
              <div className="chips">
                {removable.map((ing) => {
                  const off = removed.includes(ing.en);
                  return (
                    <label key={ing.en} className={`chip chip--remove ${off ? 'is-on' : ''}`}>
                      <input type="checkbox" checked={off} onChange={() => toggle(removed, setRemoved, ing.en)} />
                      <span className="chip__label">{tr(ing, lang)}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {canExtras && (
            <fieldset className="opt-group">
              <legend className="opt-group__title">{t.item.extras}</legend>
              <p className="opt-group__hint">{t.item.extrasHint(formatPrice(SAUCE_PRICE, lang))}</p>
              <ul className="opt-list">
                {sauces.map((s) => {
                  const on = extras.includes(s.id);
                  return (
                    <li key={s.id}>
                      <label className={`opt-row ${on ? 'is-on' : ''}`}>
                        <input type="checkbox" checked={on} onChange={() => toggle(extras, setExtras, s.id)} />
                        <span className="opt-row__box" aria-hidden="true">
                          <Icon name="check" size={14} strokeWidth={2.4} />
                        </span>
                        <span className="opt-row__name">{tr(s.name, lang)}</span>
                        <span className="opt-row__price" dir="ltr">
                          +{formatPrice(SAUCE_PRICE, lang)}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          )}

          <div className="opt-group">
            <label className="opt-group__title" htmlFor="item-note">
              {t.item.note}
            </label>
            <textarea
              id="item-note"
              className="field__input field__input--area"
              rows={2}
              maxLength={200}
              placeholder={t.item.notePlaceholder}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="item-sheet__footer">
        <QuantityStepper value={qty} onChange={setQty} max={maxQty} />
        <button type="button" className="btn btn--primary btn--block item-sheet__add" onClick={submit} data-autofocus>
          <span>{editing ? t.item.update : t.item.addToCart}</span>
          <span className="item-sheet__total" dir="ltr">
            {formatPrice(total, lang)}
          </span>
        </button>
      </div>

      <button type="button" className="icon-btn item-sheet__close" onClick={closeItem} aria-label={t.common.close}>
        <Icon name="close" />
      </button>
    </>
  );
}
