import { useId, useRef, useState } from 'react'
import { categories, getItem } from '../data/menu'
import { buildLine, useCart } from '../context/CartContext'
import { useDialog } from '../hooks/useDialog'
import { usePresence } from '../hooks/usePresence'
import { useLang } from '../i18n/LanguageContext'
import { flyToCart } from '../lib/flyToCart'
import { formatPrice } from '../lib/format'
import FoodImage from './FoodImage'
import QuantityStepper from './QuantityStepper'
import { CloseIcon } from './Icons'

const NOTE_MAX = 140
const removedKey = (r) => r.en ?? r

function initialChoices(item, line) {
  return {
    quantity: line?.quantity ?? 1,
    options: line?.options?.map((o) => o.id) ?? [],
    addons: line?.addons?.map((a) => a.id) ?? [],
    removed: line?.removed?.map(removedKey) ?? [],
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
        <ItemForm key={`${item.id}:${line?.key ?? 'new'}`} item={item} line={line} onDone={onClose} />
      </div>
    </div>
  )
}

function ItemForm({ item, line, onDone }) {
  const cart = useCart()
  const { t, pick, lang } = useLang()
  const [state, setState] = useState(() => initialChoices(item, line))
  const [missingGroup, setMissingGroup] = useState(null)
  const mediaRef = useRef(null)
  const formId = useId()
  const category = categories.find((c) => c.id === item.category)

  const choiceList = (item.options ?? []).flatMap((g) => g.choices)
  const selectedOptions = choiceList.filter((c) => state.options.includes(c.id))
  const selectedAddons = (item.addons ?? []).filter((a) => state.addons.includes(a.id))
  const selectedRemoved = (item.removable ?? []).filter((r) => state.removed.includes(removedKey(r)))
  const preview = buildLine(item, { ...state, options: selectedOptions, addons: selectedAddons, removed: selectedRemoved })
  const total = preview.unitPrice * state.quantity

  const toggle = (field, id) =>
    setState((s) => ({ ...s, [field]: s[field].includes(id) ? s[field].filter((x) => x !== id) : [...s[field], id] }))

  const pickSingle = (group, id) => {
    setMissingGroup(null)
    setState((s) => ({ ...s, options: [...s.options.filter((x) => !group.choices.some((c) => c.id === x)), id] }))
  }

  const submit = (event) => {
    event.preventDefault()
    const missing = (item.options ?? []).find((g) => g.required && !g.choices.some((c) => state.options.includes(c.id)))
    if (missing) {
      setMissingGroup(missing.id)
      event.currentTarget.querySelector(`[data-group="${missing.id}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' })
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
    <form className="sheet__inner" onSubmit={submit} noValidate>
      <button type="button" className="sheet__close icon-btn" onClick={onDone} aria-label={t('item.close')}>
        <CloseIcon />
      </button>

      <FoodImage ref={mediaRef} item={item} className="sheet__media" eager />

      <div className="sheet__body">
        <div className="sheet__scroll">
          {category && <p className="eyebrow">{pick(category.name)}</p>}
          <h2 id="sheet-title" className="sheet__title">
            {pick(item.name)}
          </h2>
          {item.note && <p className="sheet__note">{pick(item.note)}</p>}
          <p className="sheet__price">{formatPrice(item.price, lang)}</p>

          {item.description && <p className="sheet__desc">{pick(item.description)}</p>}

          {item.contents && (
            <div className="sheet__section">
              <h3 className="sheet__label">{t('item.includes')}</h3>
              <ul className="contents-list">
                {item.contents.map((c) => (
                  <li key={c.en}>{pick(c)}</li>
                ))}
              </ul>
            </div>
          )}

          {(item.options ?? []).map((group) => (
            <fieldset
              key={group.id}
              className={`sheet__section choice-group ${missingGroup === group.id ? 'has-error' : ''}`}
              data-group={group.id}
              aria-describedby={missingGroup === group.id ? `${formId}-${group.id}-error` : undefined}
            >
              <legend className="sheet__label">
                {pick(group.name)}
                {group.required && <span className="tag">{t('item.required')}</span>}
              </legend>
              {missingGroup === group.id && (
                <p id={`${formId}-${group.id}-error`} className="choice-group__error" role="alert">
                  {t('item.choose', { name: pick(group.name) })}
                </p>
              )}
              {group.choices.map((choice) => (
                <label key={choice.id} className="choice">
                  <input
                    type={group.multiple ? 'checkbox' : 'radio'}
                    name={`${formId}-${group.id}`}
                    checked={state.options.includes(choice.id)}
                    onChange={() => (group.multiple ? toggle('options', choice.id) : pickSingle(group, choice.id))}
                  />
                  <span className="choice__name">{pick(choice.name)}</span>
                  {choice.price ? <span className="choice__price">+{formatPrice(choice.price, lang)}</span> : null}
                </label>
              ))}
            </fieldset>
          ))}

          {item.removable?.length > 0 && (
            <fieldset className="sheet__section choice-group">
              <legend className="sheet__label">{t('item.without')}</legend>
              {item.removable.map((ingredient) => (
                <label key={removedKey(ingredient)} className="choice">
                  <input type="checkbox" checked={state.removed.includes(removedKey(ingredient))} onChange={() => toggle('removed', removedKey(ingredient))} />
                  <span className="choice__name">{t('item.withoutX', { name: pick(ingredient) })}</span>
                </label>
              ))}
            </fieldset>
          )}

          {item.addons?.length > 0 && (
            <fieldset className="sheet__section choice-group">
              <legend className="sheet__label">{t('item.extras')}</legend>
              {item.addons.map((addon) => (
                <label key={addon.id} className="choice">
                  <input type="checkbox" checked={state.addons.includes(addon.id)} onChange={() => toggle('addons', addon.id)} />
                  <span className="choice__name">{pick(addon.name)}</span>
                  {addon.price ? <span className="choice__price">+{formatPrice(addon.price, lang)}</span> : null}
                </label>
              ))}
            </fieldset>
          )}

          <div className="sheet__section">
            <label className="sheet__label" htmlFor={`${formId}-note`}>
              {t('item.note')} <span className="muted">({t('item.optional')})</span>
            </label>
            <textarea
              id={`${formId}-note`}
              className="input"
              rows={2}
              maxLength={NOTE_MAX}
              placeholder={t('item.notePlaceholder')}
              value={state.note}
              onChange={(e) => setState((s) => ({ ...s, note: e.target.value }))}
            />
          </div>

        </div>

        <div className="sheet__footer">
          <QuantityStepper value={state.quantity} onChange={(quantity) => setState((s) => ({ ...s, quantity }))} />
          <button type="submit" className="btn btn--primary btn--block">
            <span>{line ? t('item.save') : t('item.add')}</span>
            <span className="btn__meta">{formatPrice(total, lang)}</span>
          </button>
        </div>
      </div>
    </form>
  )
}
