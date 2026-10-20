import { useEffect, useMemo, useRef, useState } from 'react'
import Overlay from './Overlay'
import FoodImage from './FoodImage'
import QuantityStepper from './QuantityStepper'
import Icon from './Icon'
import useDialog from '../hooks/useDialog'
import { useUI } from '../context/UIContext'
import { useCart } from '../context/CartContext'
import { menuById, extraGroups, categoryById } from '../data/menu'
import { money, itemTitle } from '../utils/format'
import { extraChoice } from '../utils/cartLine'
import { flyToCart } from '../utils/flyToCart'

function initialState(item, line) {
  return {
    qty: line?.qty || 1,
    options: line?.options || {},
    removed: line?.removed || [],
    extras: line?.extras || [],
    note: line?.note || '',
  }
}

export default function ItemSheet() {
  const { sheet, closeItem, notify } = useUI()
  const { lines, add, replace } = useCart()
  const open = Boolean(sheet)

  // Keep the last item while the sheet animates out.
  const [current, setCurrent] = useState(sheet)
  useEffect(() => {
    if (sheet) setCurrent(sheet)
  }, [sheet])

  const item = current ? menuById[current.itemId] : null
  const editing = current?.editKey ? lines.find((l) => l.key === current.editKey) : null
  const [state, setState] = useState(() => initialState(item, editing))
  const [missing, setMissing] = useState([])
  const imgRef = useRef(null)
  const ref = useDialog(open, closeItem)

  useEffect(() => {
    if (sheet) {
      const it = menuById[sheet.itemId]
      const line = sheet.editKey ? lines.find((l) => l.key === sheet.editKey) : null
      setState(initialState(it, line))
      setMissing([])
    }
    // Only reset when a new sheet opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheet])

  const unit = useMemo(() => {
    if (!item) return 0
    return item.price + state.extras.reduce((s, id) => s + (extraChoice(id)?.price || 0), 0)
  }, [item, state.extras])

  if (!item) return null

  const category = categoryById[item.category]
  const toggle = (field, value) =>
    setState((s) => ({
      ...s,
      [field]: s[field].includes(value) ? s[field].filter((v) => v !== value) : [...s[field], value],
    }))

  function submit() {
    const unanswered = (item.options || []).filter((o) => !state.options[o.id]).map((o) => o.id)
    if (unanswered.length) {
      setMissing(unanswered)
      ref.current?.querySelector(`#opt-${unanswered[0]}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    const config = { itemId: item.id, options: state.options, removed: state.removed, extras: state.extras, note: state.note }
    if (editing) {
      replace(editing.key, config, state.qty)
      notify(`${itemTitle(item)} updated`)
    } else {
      add(config, state.qty)
      notify(`${state.qty} × ${itemTitle(item)} added to your order`)
      flyToCart(imgRef.current || ref.current?.querySelector('.sheet__add'))
    }
    closeItem()
  }

  return (
    <Overlay open={open} onClose={closeItem} variant="sheet" labelledBy="sheet-title" panelRef={ref} className={item.image ? 'has-image' : 'no-image'}>
      <button type="button" className="sheet__close" onClick={closeItem} aria-label="Close">
        <Icon name="close" size={20} />
      </button>

      {item.image && (
        <div className="sheet__media">
          <FoodImage ref={imgRef} name={item.image} alt={item.imageAlt} sizes="(min-width: 900px) 460px, 90vw" eager />
        </div>
      )}

      <div className="sheet__body">
        <div className="sheet__scroll">
          <p className="sheet__eyebrow">{category?.name}{item.detail ? ` · ${item.detail}` : ''}</p>
          <h2 id="sheet-title" className="sheet__title">{item.name}</h2>
          <p className="sheet__price">{money(item.price)}</p>
          {item.description && <p className="sheet__desc">{item.description}</p>}

          {(item.options || []).map((opt) => (
            <fieldset key={opt.id} id={`opt-${opt.id}`} className={`choice-group ${missing.includes(opt.id) ? 'has-error' : ''}`}>
              <legend>
                {opt.label}
                <span className="choice-group__tag">Required</span>
              </legend>
              <div className="choice-group__options choice-group__options--pills">
                {opt.choices.map((c) => (
                  <label key={c.id} className="pill">
                    <input
                      type="radio"
                      name={opt.id}
                      checked={state.options[opt.id] === c.id}
                      onChange={() => {
                        setState((s) => ({ ...s, options: { ...s.options, [opt.id]: c.id } }))
                        setMissing((m) => m.filter((x) => x !== opt.id))
                      }}
                    />
                    <span>{c.label}</span>
                  </label>
                ))}
              </div>
              {missing.includes(opt.id) && <p className="field-error" role="alert">Please choose one.</p>}
            </fieldset>
          ))}

          {(item.extras || []).map((groupId) => {
            const group = extraGroups[groupId]
            return (
              <fieldset key={groupId} className="choice-group">
                <legend>
                  {group.label}
                  <span className="choice-group__tag choice-group__tag--muted">Optional</span>
                </legend>
                <div className="choice-group__options">
                  {group.choices.map((c) => (
                    <label key={c.id} className="check-row">
                      <input type="checkbox" checked={state.extras.includes(c.id)} onChange={() => toggle('extras', c.id)} />
                      <span className="check-row__box" aria-hidden="true"><Icon name="check" size={14} strokeWidth={2.4} /></span>
                      <span className="check-row__label">{c.label}</span>
                      <span className="check-row__price">+{money(c.price)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )
          })}

          {item.remove?.length > 0 && (
            <fieldset className="choice-group">
              <legend>
                Leave anything out?
                <span className="choice-group__tag choice-group__tag--muted">Tap to remove</span>
              </legend>
              <div className="choice-group__options choice-group__options--chips">
                {item.remove.map((ing) => {
                  const off = state.removed.includes(ing)
                  return (
                    <button
                      type="button"
                      key={ing}
                      className={`ing-chip ${off ? 'is-removed' : ''}`}
                      aria-pressed={off}
                      onClick={() => toggle('removed', ing)}
                    >
                      <span className="ing-chip__name">{ing}</span>
                      <Icon name={off ? 'plus' : 'close'} size={13} strokeWidth={2.2} />
                      <span className="sr-only">{off ? '(removed, tap to add back)' : '(tap to remove)'}</span>
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )}

          <div className="choice-group">
            <label className="field-label" htmlFor="sheet-note">
              Note for the kitchen <span className="choice-group__tag choice-group__tag--muted">Optional</span>
            </label>
            <textarea
              id="sheet-note"
              className="input"
              rows={2}
              maxLength={140}
              placeholder="Extra crispy, sauce on the side..."
              value={state.note}
              onChange={(e) => setState((s) => ({ ...s, note: e.target.value }))}
            />
          </div>
        </div>

        <div className="sheet__footer">
          <QuantityStepper value={state.qty} onChange={(qty) => setState((s) => ({ ...s, qty }))} />
          <button type="button" className="btn btn--primary btn--lg sheet__add" onClick={submit}>
            <span>{editing ? 'Update order' : 'Add to order'}</span>
            <span className="sheet__add-total">{money(unit * state.qty)}</span>
          </button>
        </div>
      </div>
    </Overlay>
  )
}
