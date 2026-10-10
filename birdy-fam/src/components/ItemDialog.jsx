import { useEffect, useMemo, useRef, useState } from 'react'
import { addOns, categoryById, itemsById } from '../data/menu.js'
import { useShop } from '../context/ShopContext.jsx'
import { unitPrice } from '../lib/cart.js'
import { flyToCart } from '../lib/flyToCart.js'
import { formatPrice } from '../lib/format.js'
import FoodImage from './FoodImage.jsx'
import Icon from './Icon.jsx'
import Overlay from './Overlay.jsx'
import QuantityStepper from './QuantityStepper.jsx'
import { useToast } from './Toast.jsx'

function initialState(item, line) {
  if (line) return { qty: line.qty, options: { ...line.options }, addOns: [...line.addOns], removed: [...line.removed] }
  return { qty: 1, options: {}, addOns: [], removed: [] }
}

function ItemBody({ item, line, onDone }) {
  const { addLine, replaceLine } = useShop()
  const toast = useToast()
  const [state, setState] = useState(() => initialState(item, line))
  const [showErrors, setShowErrors] = useState(false)
  const imgRef = useRef(null)
  const isEdit = Boolean(line)

  const missing = item.options.filter((g) => g.required && !state.options[g.id])
  const total = useMemo(
    () => unitPrice({ itemId: item.id, addOns: state.addOns }) * state.qty,
    [item.id, state.addOns, state.qty],
  )

  const toggle = (key, value) =>
    setState((s) => ({
      ...s,
      [key]: s[key].includes(value) ? s[key].filter((v) => v !== value) : [...s[key], value],
    }))

  const submit = () => {
    if (missing.length) {
      setShowErrors(true)
      document.getElementById(`group-${missing[0].id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    const next = { itemId: item.id, qty: state.qty, options: state.options, addOns: state.addOns, removed: state.removed }
    if (isEdit) {
      replaceLine(line.uid, next)
      toast('Bag updated')
    } else {
      flyToCart(imgRef.current?.querySelector('img') || imgRef.current)
      addLine(next)
      toast(`${item.name} added to your bag`)
    }
    onDone()
  }

  return (
    <>
      <button type="button" className="dialog__close" onClick={onDone} aria-label="Close">
        <Icon name="close" size={20} />
      </button>

      <div className="item-dialog__scroll">
        <div ref={imgRef} className="item-dialog__media">
          {item.image ? (
            <FoodImage item={item} className="food-img--hero" eager />
          ) : (
            <div className="item-dialog__brand">
              <img src="/images/logo-240.webp" alt="" width="240" height="240" />
            </div>
          )}
        </div>

        <div className="item-dialog__body">
          <p className="eyebrow">{categoryById[item.category]?.name}</p>
          <h2 id="item-dialog-title" className="item-dialog__title">{item.name}</h2>
          <p className="item-dialog__price">{formatPrice(item.price)}</p>
          {item.description && <p className="item-dialog__desc">{item.description}</p>}

          {item.options.map((group) => {
            const invalid = showErrors && !state.options[group.id]
            return (
              <fieldset key={group.id} id={`group-${group.id}`} className={`opt-group ${invalid ? 'is-invalid' : ''}`}>
                <legend className="opt-group__head">
                  <span>{group.name}</span>
                  <span className={`opt-group__tag ${invalid ? 'is-error' : ''}`}>{group.required ? 'Required' : 'Optional'}</span>
                </legend>
                <div className="choice-grid">
                  {group.choices.map((c) => (
                    <label key={c.id} className="choice">
                      <input
                        type="radio"
                        name={group.id}
                        value={c.id}
                        checked={state.options[group.id] === c.id}
                        onChange={() => setState((s) => ({ ...s, options: { ...s.options, [group.id]: c.id } }))}
                      />
                      <span>{c.name}</span>
                    </label>
                  ))}
                </div>
                {invalid && <p className="field-error" role="alert"><Icon name="alert" size={15} /> Pick one to continue.</p>}
              </fieldset>
            )
          })}

          {item.addons && (
            <fieldset className="opt-group">
              <legend className="opt-group__head">
                <span>Add on</span>
                <span className="opt-group__tag">Optional</span>
              </legend>
              <ul className="check-list">
                {addOns.map((a) => (
                  <li key={a.id}>
                    <label className="check-row">
                      <input type="checkbox" checked={state.addOns.includes(a.id)} onChange={() => toggle('addOns', a.id)} />
                      <span className="check-row__box" aria-hidden="true"><Icon name="check" size={14} strokeWidth={2.6} /></span>
                      <span className="check-row__name">{a.name}</span>
                      <span className="check-row__price">+{formatPrice(a.price)}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
          )}

          {item.removable.length > 0 && (
            <fieldset className="opt-group">
              <legend className="opt-group__head">
                <span>Leave anything out?</span>
                <span className="opt-group__tag">Optional</span>
              </legend>
              <div className="chip-row">
                {item.removable.map((r) => {
                  const on = state.removed.includes(r)
                  return (
                    <button key={r} type="button" className={`chip ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => toggle('removed', r)}>
                      {on && <Icon name="close" size={13} strokeWidth={2.4} />}
                      {on ? `No ${r.toLowerCase()}` : r}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )}
        </div>
      </div>

      <div className="item-dialog__footer">
        <QuantityStepper value={state.qty} onChange={(qty) => setState((s) => ({ ...s, qty }))} />
        <button type="button" className="btn btn--primary btn--block" onClick={submit}>
          <span>{isEdit ? 'Update bag' : 'Add to bag'}</span>
          <span className="btn__price">{formatPrice(total)}</span>
        </button>
      </div>
    </>
  )
}

export default function ItemDialog() {
  const { activeItem, closeItem } = useShop()
  // Keep the last item rendered while the dialog animates out.
  const [shown, setShown] = useState(activeItem)
  useEffect(() => {
    if (activeItem) setShown(activeItem)
  }, [activeItem])
  const item = shown && itemsById[shown.itemId]

  return (
    <Overlay open={Boolean(activeItem)} onClose={closeItem} labelledBy="item-dialog-title" className="item-dialog">
      {item && <ItemBody key={`${item.id}-${shown.line?.uid ?? 'new'}`} item={item} line={shown.line} onDone={closeItem} />}
    </Overlay>
  )
}
