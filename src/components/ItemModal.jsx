import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { getItem } from '../data/menu'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import { t } from '../content/text'
import { defaultSelection, formatPrice, listedVariants, missingRequired, toCents, unitPriceCents } from '../lib/price'
import { flyToCart } from '../lib/flyToCart'
import { useDialog } from '../hooks/useDialog'
import { usePresence } from '../hooks/usePresence'
import FoodImage from './FoodImage'
import QtyStepper from './QtyStepper'
import Icon from './Icon'
import './ItemModal.css'

export default function ItemModal() {
  const { activeItem, closeItem } = useUI()
  // Keep the last item around while the panel animates out.
  const [shown, setShown] = useState(activeItem)
  useEffect(() => {
    if (activeItem) setShown(activeItem)
  }, [activeItem])

  const [mounted, visible] = usePresence(Boolean(activeItem), 320)
  const item = shown && getItem(shown.id)
  if (!mounted || !item) return null

  return <ItemPanel key={`${shown.id}-${shown.lineKey ?? ''}`} item={item} lineKey={shown.lineKey} visible={visible} onClose={closeItem} />
}

function ItemPanel({ item, lineKey, visible, onClose }) {
  const cart = useCart()
  const { canOrder } = useUI()
  const titleId = useId()
  const editing = lineKey ? cart.lines.find((l) => l.key === lineKey) : null

  const [selection, setSelection] = useState(() => editing?.selection ?? defaultSelection(item))
  const [qty, setQty] = useState(editing?.qty ?? 1)
  const [attempted, setAttempted] = useState(false)
  const imgRef = useRef(null)
  const bodyRef = useRef(null)
  const dialogRef = useDialog(visible, onClose)

  const missing = missingRequired(item, selection)
  const unitCents = unitPriceCents(item, selection)
  const variants = useMemo(() => listedVariants(item), [item])

  const setSingle = (groupId, optionId) => setSelection((s) => ({ ...s, [groupId]: optionId }))
  const toggleMulti = (groupId, optionId) =>
    setSelection((s) => {
      const current = s[groupId] ?? []
      return {
        ...s,
        [groupId]: current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId],
      }
    })

  const submit = () => {
    if (missing.length) {
      setAttempted(true)
      const first = bodyRef.current?.querySelector(`[data-group="${missing[0].id}"]`)
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      first?.querySelector('input')?.focus({ preventScroll: true })
      return
    }
    if (editing) {
      cart.replace(lineKey, item.id, selection, qty)
      onClose()
      return
    }
    cart.add(item.id, selection, qty)
    flyToCart(imgRef.current, item.image)
    onClose()
  }

  return (
    <div className={`item-modal ${visible ? 'is-open' : ''}`}>
      <div className="item-modal__backdrop" onClick={onClose} aria-hidden="true" />
      <div className="item-modal__panel" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={dialogRef}>
        <button type="button" className="item-modal__close" onClick={onClose} aria-label={t('item.close')}>
          <Icon name="close" size={20} />
        </button>

        <div className="item-modal__media">
          <FoodImage item={item} eager imgRef={imgRef} sizes="(max-width: 860px) 100vw, 520px" />
        </div>

        <div className="item-modal__content">
          <div className="item-modal__scroll" ref={bodyRef}>
            <header className="item-modal__head">
              <h2 id={titleId}>{item.name}</h2>
              <p className="item-modal__price num">{formatPrice(toCents(item.price))}</p>
              {item.description && <p className="item-modal__desc">{item.description}</p>}
              {variants.length > 0 && (
                <ul className="item-modal__variants">
                  {variants.map((v) => (
                    <li key={v.label}>
                      {v.label} <span className="num">{formatPrice(v.cents)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </header>

            {(item.groups ?? []).filter((group) => canOrder || group.type !== 'remove').map((group) => (
              <OptionGroup
                key={group.id}
                group={group}
                value={selection[group.id]}
                invalid={attempted && missing.includes(group)}
                readOnly={!canOrder}
                onSingle={(id) => setSingle(group.id, id)}
                onToggle={(id) => toggleMulti(group.id, id)}
              />
            ))}

            {!canOrder && <p className="item-modal__dinein">{t('item.dineInHint')}</p>}
          </div>

          {canOrder && (
            <footer className="item-modal__footer">
              <QtyStepper value={qty} onChange={setQty} />
              <button type="button" className="btn btn--primary btn--lg item-modal__add" onClick={submit}>
                <span>{missing.length && attempted ? t('item.chooseFirst', { group: missing[0].name.toLowerCase() }) : editing ? t('item.update') : t('item.add')}</span>
                <span className="item-modal__total num">{formatPrice(unitCents * qty)}</span>
              </button>
            </footer>
          )}
        </div>
      </div>
    </div>
  )
}

function OptionGroup({ group, value, invalid, readOnly, onSingle, onToggle }) {
  const name = useId()
  const selected = Array.isArray(value) ? value : value ? [value] : []
  const required = group.type === 'single' && group.required

  return (
    <fieldset className={`opt-group ${invalid ? 'is-invalid' : ''}`} data-group={group.id} disabled={readOnly}>
      <legend className="opt-group__legend">
        <span>{group.name}</span>
        {!readOnly && (
          <span className={`opt-group__badge ${required ? 'is-required' : ''}`}>
            {required ? t('item.required') : group.type === 'remove' ? t('item.removeHint') : t('item.optional')}
          </span>
        )}
      </legend>

      {group.type === 'remove' ? (
        <div className="opt-chips">
          {group.options.map((option) => {
            const on = selected.includes(option.id)
            return (
              <button
                key={option.id}
                type="button"
                className={`opt-chip ${on ? 'is-removed' : ''}`}
                aria-pressed={on}
                onClick={() => onToggle(option.id)}
                disabled={readOnly}
              >
                <Icon name={on ? 'close' : 'check'} size={14} />
                <span>{on ? t('item.without', { name: option.name.toLowerCase() }) : option.name}</span>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="opt-list">
          {group.options.map((option) => {
            const checked = selected.includes(option.id)
            return (
              <label key={option.id} className={`opt-row ${checked ? 'is-checked' : ''}`}>
                <input
                  type={group.type === 'single' ? 'radio' : 'checkbox'}
                  name={name}
                  checked={checked}
                  onChange={() => (group.type === 'single' ? onSingle(option.id) : onToggle(option.id))}
                />
                <span className="opt-row__control" aria-hidden="true" />
                <span className="opt-row__label">{option.name}</span>
                {option.price ? <span className="opt-row__price num">+{formatPrice(toCents(option.price))}</span> : null}
              </label>
            )
          })}
        </div>
      )}
      {invalid && (
        <p className="opt-group__error" role="alert">
          <Icon name="alert" size={15} /> {t('item.pickOne')}
        </p>
      )}
    </fieldset>
  )
}
