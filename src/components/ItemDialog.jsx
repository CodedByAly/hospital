import { useId, useRef, useState } from 'react'
import { categories, cutoutUrl, getItem, imageUrl } from '../data/menu'
import { defaultConfig, extrasForSize, missingOptions, unitPrice } from '../lib/cart'
import { formatPrice } from '../lib/format'
import { useCart } from '../context/CartContext'
import { useFly } from '../context/FlyContext'
import { useLanguage } from '../context/LanguageContext'
import Dialog from './Dialog'
import FoodImage from './FoodImage'
import QtyStepper from './QtyStepper'
import './ItemDialog.css'

export default function ItemDialog({ open, itemId, lineKey, preset, nonce, onClose }) {
  const { pick } = useLanguage()
  const item = itemId ? getItem(itemId) : null
  if (!item) return null
  return (
    <Dialog open={open} onClose={onClose} label={pick(item.name)} className="item-dialog" initialFocus=".item-dialog__title">
      <ItemBody key={`${itemId}:${lineKey}:${nonce}`} item={item} lineKey={lineKey} preset={preset} onDone={onClose} />
    </Dialog>
  )
}

function ItemBody({ item, lineKey, preset, onDone }) {
  const { t, pick, lang } = useLanguage()
  const cart = useCart()
  const { fly } = useFly()
  const editing = lineKey ? cart.lines.find((l) => l.key === lineKey) : null

  const [config, setConfig] = useState(() => {
    if (editing) return structuredClone(editing.config)
    const base = defaultConfig(item)
    return preset ? { ...base, ...preset, options: { ...base.options, ...preset.options } } : base
  })
  const [qty, setQty] = useState(editing?.qty ?? 1)
  const [showErrors, setShowErrors] = useState(false)
  const imgRef = useRef(null)
  const bodyRef = useRef(null)
  const uid = useId()

  const category = categories.find((c) => c.id === item.category)
  const extras = extrasForSize(item, config.sizeId)
  const missing = missingOptions(item, config)
  const price = unitPrice(item, config)

  const update = (patch) => setConfig((c) => ({ ...c, ...patch }))
  const toggleIn = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])

  const submit = () => {
    if (missing.length) {
      setShowErrors(true)
      bodyRef.current?.querySelector(`[data-group="${missing[0].id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    // keep only extras valid for the chosen size
    const clean = { ...config, extras: config.extras.filter((id) => extras.some((x) => x.id === id)), notes: config.notes.trim() }
    if (editing) {
      cart.replace(editing.key, item.id, clean, qty)
    } else {
      const cut = cutoutUrl(item.image)
      fly({ from: imgRef.current, src: cut ?? imageUrl(item.image), cutout: Boolean(cut) })
      cart.add(item.id, clean, qty)
    }
    onDone()
  }

  return (
    <>
      <div className="item-dialog__media">
        <FoodImage
          src={imageUrl(item.image)}
          alt={pick(item.name)}
          ratio="4 / 3"
          eager
          imgRef={imgRef}
          className="item-dialog__img"
        />
      </div>

      <div className="item-dialog__body" ref={bodyRef}>
        <header className="item-dialog__head">
          {category && <p className="eyebrow">{pick(category.name)}</p>}
          <h2 className="item-dialog__title" tabIndex={-1}>{pick(item.name)}</h2>
          {item.description && <p className="item-dialog__desc">{pick(item.description)}</p>}
          <p className="item-dialog__price">
            {item.sizes ? `${t('common.from')} ${formatPrice(Math.min(...item.sizes.map((s) => s.price)), lang)}` : formatPrice(item.price, lang)}
          </p>
        </header>

        {item.sizes && (
          <fieldset className="choice-group">
            <legend>
              <span>{t('item.size')}</span>
              <span className="badge">{t('common.required')}</span>
            </legend>
            <div className="size-grid">
              {item.sizes.map((size) => (
                <label key={size.id} className="size-card">
                  <input
                    type="radio"
                    name={`${uid}-size`}
                    checked={config.sizeId === size.id}
                    onChange={() => update({ sizeId: size.id })}
                  />
                  <span className="size-card__label">{pick(size.label)}</span>
                  <span className="size-card__price">{formatPrice(size.price, lang)}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {item.options?.map((group) => {
          const invalid = showErrors && !config.options[group.id]
          return (
            <fieldset key={group.id} className="choice-group" data-group={group.id} aria-invalid={invalid || undefined}>
              <legend>
                <span>{pick(group.label)}</span>
                <span className={`badge ${invalid ? 'badge--error' : ''}`}>{group.required ? t('common.required') : t('common.optional')}</span>
              </legend>
              <div className="chip-row">
                {group.choices.map((choice) => (
                  <label key={choice.id} className="chip">
                    <input
                      type="radio"
                      name={`${uid}-${group.id}`}
                      checked={config.options[group.id] === choice.id}
                      onChange={() => update({ options: { ...config.options, [group.id]: choice.id } })}
                    />
                    <span>{pick(choice.label)}</span>
                  </label>
                ))}
              </div>
              {invalid && <p className="field-error" role="alert">{t('item.missing', { label: pick(group.label) })}</p>}
            </fieldset>
          )
        })}

        {extras.length > 0 && (
          <fieldset className="choice-group">
            <legend>
              <span>{t('item.extras')}</span>
              <span className="badge">{t('common.optional')}</span>
            </legend>
            <div className="extra-list">
              {extras.map((extra) => (
                <label key={extra.id} className="extra-row">
                  <input
                    type="checkbox"
                    checked={config.extras.includes(extra.id)}
                    onChange={() => update({ extras: toggleIn(config.extras, extra.id) })}
                  />
                  <span className="extra-row__box" aria-hidden="true" />
                  <span className="extra-row__label">{pick(extra.label)}</span>
                  <span className="extra-row__price">+{formatPrice(extra.price, lang)}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {item.removable?.length > 0 && (
          <fieldset className="choice-group">
            <legend>
              <span>{t('item.without')}</span>
              <span className="badge">{t('common.optional')}</span>
            </legend>
            <div className="chip-row">
              {item.removable.map((ing) => (
                <label key={ing.id} className="chip chip--remove">
                  <input
                    type="checkbox"
                    checked={config.removed.includes(ing.id)}
                    onChange={() => update({ removed: toggleIn(config.removed, ing.id) })}
                  />
                  <span>{pick(ing.label)}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <div className="choice-group">
          <label className="field-label" htmlFor={`${uid}-notes`}>
            {t('item.notes')} <span className="muted">({t('common.optional')})</span>
          </label>
          <textarea
            id={`${uid}-notes`}
            className="input"
            rows={2}
            maxLength={140}
            value={config.notes}
            placeholder={t('item.notesPlaceholder')}
            onChange={(e) => update({ notes: e.target.value })}
          />
        </div>
      </div>

      <footer className="item-dialog__foot">
        <QtyStepper value={qty} onChange={setQty} />
        <button type="button" className="btn btn--primary btn--block" onClick={submit}>
          <span>{editing ? t('common.update') : t('common.addToCart')}</span>
          <span className="btn__price">{formatPrice(price * qty, lang)}</span>
        </button>
      </footer>
    </>
  )
}
