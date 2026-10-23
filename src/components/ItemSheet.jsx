import { useEffect, useId, useRef, useState } from 'react'
import { categories, getItem } from '../data/menu'
import { buildLine, useCart } from '../context/CartContext'
import { useDialog } from '../hooks/useDialog'
import { usePresence } from '../hooks/usePresence'
import { flyToCart } from '../lib/flyToCart'
import { formatPrice } from '../lib/format'
import FoodImage from './FoodImage'
import QuantityStepper from './QuantityStepper'
import { CloseIcon } from './Icons'

const NOTE_MAX = 140

function initialChoices(item, line) {
  return {
    quantity: line?.quantity ?? 1,
    options: line?.options?.map((o) => o.id) ?? (item.options ?? []).flatMap((g) => (g.required && !g.multiple ? [g.choices[0].id] : [])),
    addons: line?.addons?.map((a) => a.id) ?? [],
    removed: line?.removed ?? [],
    note: line?.note ?? '',
  }
}

export default function ItemSheet({ open, itemId, line, onClose }) {
  const [mounted, visible] = usePresence(open, 320)
  const dialogRef = useDialog(open, onClose)
  const item = itemId ? getItem(itemId) : null
  if (!mounted || !item) return null

  return (
    <div className={`sheet-layer ${visible ? 'is-open' : ''}`}>
      <div className="sheet-backdrop" onClick={onClose} aria-hidden="true" />
      <div ref={dialogRef} className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
        {/* key resets the form whenever a different item or line is opened */}
        <ItemForm key={`${item.id}:${line?.key ?? "new"}`} item={item} line={line} onDone={onClose} />
      </div>
    </div>
  )
}

function ItemForm({ item, line, onDone }) {
  const cart = useCart()
  const [state, setState] = useState(() => initialChoices(item, line))
  const [error, setError] = useState('')
  const mediaRef = useRef(null)
  const formId = useId()
  const category = categories.find((c) => c.id === item.category)

  const choiceList = (item.options ?? []).flatMap((g) => g.choices)
  const selectedOptions = choiceList.filter((c) => state.options.includes(c.id))
  const selectedAddons = (item.addons ?? []).filter((a) => state.addons.includes(a.id))
  const preview = buildLine(item, { ...state, options: selectedOptions, addons: selectedAddons })
  const total = { amount: preview.unitPrice * state.quantity, currency: item.price.currency }

  useEffect(() => setError(''), [state.options])

  const toggle = (field, id) =>
    setState((s) => ({ ...s, [field]: s[field].includes(id) ? s[field].filter((x) => x !== id) : [...s[field], id] }))

  const pickSingle = (group, id) =>
    setState((s) => ({ ...s, options: [...s.options.filter((x) => !group.choices.some((c) => c.id === x)), id] }))

  const submit = (event) => {
    event.preventDefault()
    const missing = (item.options ?? []).find((g) => g.required && !g.choices.some((c) => state.options.includes(c.id)))
    if (missing) {
      setError(`اختار ${missing.name}`)
      return
    }
    if (line) {
      cart.replace(line.key, preview)
      onDone()
      return
    }
    cart.add(preview)
    flyToCart(mediaRef.current).then(cart.bump)
    onDone()
  }

  return (
    <form className="sheet__inner" onSubmit={submit} aria-describedby={error ? `${formId}-error` : undefined}>
      <button type="button" className="sheet__close icon-btn" onClick={onDone} aria-label="إغلاق">
        <CloseIcon />
      </button>

      <FoodImage ref={mediaRef} item={item} className="sheet__media" eager />

      <div className="sheet__body">
        <div className="sheet__scroll">
          {category && <p className="eyebrow">{category.name}</p>}
          <h2 id="sheet-title" className="sheet__title">
            {item.name}
          </h2>
          <p className="sheet__price">{formatPrice(item.price)}</p>

          {item.description && <p className="sheet__desc">{item.description}</p>}

          {item.contents && (
            <div className="sheet__section">
              <h3 className="sheet__label">شو فيها</h3>
              <ul className="contents-list">
                {item.contents.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {(item.options ?? []).map((group) => (
            <fieldset key={group.id} className="sheet__section choice-group">
              <legend className="sheet__label">
                {group.name}
                {group.required && <span className="tag">مطلوب</span>}
              </legend>
              {group.choices.map((choice) => (
                <label key={choice.id} className="choice">
                  <input
                    type={group.multiple ? 'checkbox' : 'radio'}
                    name={`${formId}-${group.id}`}
                    checked={state.options.includes(choice.id)}
                    onChange={() => (group.multiple ? toggle('options', choice.id) : pickSingle(group, choice.id))}
                  />
                  <span className="choice__name">{choice.name}</span>
                  {choice.price ? <span className="choice__price">+{formatPrice({ amount: choice.price, currency: item.price.currency })}</span> : null}
                </label>
              ))}
            </fieldset>
          ))}

          {item.removable?.length > 0 && (
            <fieldset className="sheet__section choice-group">
              <legend className="sheet__label">بدون</legend>
              {item.removable.map((ingredient) => (
                <label key={ingredient} className="choice">
                  <input type="checkbox" checked={state.removed.includes(ingredient)} onChange={() => toggle('removed', ingredient)} />
                  <span className="choice__name">بدون {ingredient}</span>
                </label>
              ))}
            </fieldset>
          )}

          {item.addons?.length > 0 && (
            <fieldset className="sheet__section choice-group">
              <legend className="sheet__label">إضافات</legend>
              {item.addons.map((addon) => (
                <label key={addon.id} className="choice">
                  <input type="checkbox" checked={state.addons.includes(addon.id)} onChange={() => toggle('addons', addon.id)} />
                  <span className="choice__name">{addon.name}</span>
                  {addon.price ? <span className="choice__price">+{formatPrice({ amount: addon.price, currency: item.price.currency })}</span> : null}
                </label>
              ))}
            </fieldset>
          )}

          <div className="sheet__section">
            <label className="sheet__label" htmlFor={`${formId}-note`}>
              ملاحظة للمطبخ <span className="muted">(اختياري)</span>
            </label>
            <textarea
              id={`${formId}-note`}
              className="input"
              rows={2}
              maxLength={NOTE_MAX}
              placeholder="مثلاً: بلا كبيس…"
              value={state.note}
              onChange={(e) => setState((s) => ({ ...s, note: e.target.value }))}
            />
          </div>

          {error && (
            <p id={`${formId}-error`} className="form-error" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="sheet__footer">
          <QuantityStepper value={state.quantity} onChange={(quantity) => setState((s) => ({ ...s, quantity }))} />
          <button type="submit" className="btn btn--primary btn--block">
            <span>{line ? 'حفظ التعديل' : 'زيد عالسلة'}</span>
            <span className="btn__meta">{formatPrice(total)}</span>
          </button>
        </div>
      </div>
    </form>
  )
}
