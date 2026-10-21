import { useEffect, useMemo, useRef, useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { findItem } from '../data/menu.js'
import { useDialog } from '../hooks/useDialog.js'
import { usePresence } from '../hooks/usePresence.js'
import { flyToCart } from '../lib/fly.js'
import { formatPrice } from '../lib/format.js'
import { defaultSelections, missingGroups, unitPrice } from '../lib/pricing.js'
import { IconCheck, IconClose } from './Icons.jsx'
import { QuantityStepper } from './QuantityStepper.jsx'

export function ItemModal() {
  const { activeItem, closeItem } = useCart()
  // Keep the last item around while the sheet animates out.
  const [shown, setShown] = useState(activeItem)
  useEffect(() => {
    if (activeItem) setShown(activeItem)
  }, [activeItem])
  const { mounted, visible } = usePresence(Boolean(activeItem), 280)
  if (!mounted || !shown) return null
  return <ItemSheet key={`${shown.itemId}-${shown.editKey ?? ''}`} request={shown} visible={visible} open={Boolean(activeItem)} onClose={closeItem} />
}

function ItemSheet({ request, visible, open, onClose }) {
  const { lines, add, replace, openCart } = useCart()
  const item = findItem(request.itemId)
  const editing = request.editKey ? lines.find((l) => l.key === request.editKey) : null

  const [selections, setSelections] = useState(() => editing?.selections ?? defaultSelections(item))
  const [removed, setRemoved] = useState(() => editing?.removed ?? [])
  const [qty, setQty] = useState(() => editing?.qty ?? 1)
  const [showErrors, setShowErrors] = useState(false)
  const dialogRef = useDialog(open, onClose)
  const addRef = useRef(null)
  const groupRefs = useRef({})

  const price = useMemo(() => unitPrice(item, selections), [item, selections])
  const missing = missingGroups(item, selections)

  const pickSingle = (groupId, optionId) => setSelections((s) => ({ ...s, [groupId]: optionId }))
  const toggleMulti = (groupId, optionId) =>
    setSelections((s) => {
      const current = s[groupId] ?? []
      return { ...s, [groupId]: current.includes(optionId) ? current.filter((o) => o !== optionId) : [...current, optionId] }
    })
  const toggleRemoved = (ingredient) =>
    setRemoved((r) => (r.includes(ingredient) ? r.filter((i) => i !== ingredient) : [...r, ingredient]))

  const submit = () => {
    if (missing.length) {
      setShowErrors(true)
      groupRefs.current[missing[0].id]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    const line = { itemId: item.id, qty, selections, removed }
    if (editing) {
      replace(editing.key, line)
      onClose()
      openCart()
      return
    }
    add(line)
    flyToCart(addRef.current, qty > 1 ? `${qty}` : '')
    onClose()
  }

  return (
    <div className={`sheet-layer ${visible ? 'is-visible' : ''}`}>
      <div className="sheet-backdrop" onClick={onClose} aria-hidden="true" />
      <div ref={dialogRef} className="sheet item-sheet" role="dialog" aria-modal="true" aria-labelledby="item-sheet-title">
        <header className={`item-sheet__head tone-${item.tone}`}>
          <div className="sheet__grab" aria-hidden="true" />
          <button type="button" className="sheet__close" onClick={onClose} aria-label="Close">
            <IconClose size={20} />
          </button>
          <p className="item-sheet__eyebrow">{item.portion ?? (item.categoryId === 'offers' ? 'Meal deal' : ' ')}</p>
          <h2 id="item-sheet-title" className="item-sheet__title">
            {item.name}
          </h2>
          {item.description && <p className="item-sheet__desc">{item.description}</p>}
          <p className="item-sheet__price">{formatPrice(item.price)}</p>
        </header>

        <div className="sheet__body">
          {(item.groups ?? []).map((group) => {
            const invalid = showErrors && missing.some((m) => m.id === group.id)
            return (
              <fieldset
                key={group.id}
                ref={(el) => (groupRefs.current[group.id] = el)}
                className={`opt-group ${invalid ? 'is-invalid' : ''}`}
              >
                <legend className="opt-group__legend">
                  <span>{group.label}</span>
                  <span className={`opt-group__tag ${group.type === 'single' ? 'is-required' : ''}`}>
                    {group.type === 'single' ? (invalid ? 'Please choose one' : 'Required') : 'Optional'}
                  </span>
                </legend>
                <div className="opt-list">
                  {group.options.map((option) => {
                    const checked =
                      group.type === 'single' ? selections[group.id] === option.id : selections[group.id]?.includes(option.id)
                    const priceNote =
                      option.price != null ? formatPrice(option.price) : option.add ? `+${formatPrice(option.add)}` : ''
                    return (
                      <label key={option.id} className={`opt ${checked ? 'is-checked' : ''}`}>
                        <input
                          type={group.type === 'single' ? 'radio' : 'checkbox'}
                          name={`${item.id}-${group.id}`}
                          checked={Boolean(checked)}
                          onChange={() => (group.type === 'single' ? pickSingle(group.id, option.id) : toggleMulti(group.id, option.id))}
                        />
                        <span className={`opt__mark opt__mark--${group.type}`} aria-hidden="true">
                          {group.type === 'multi' && <IconCheck size={14} />}
                        </span>
                        <span className="opt__label">{option.label}</span>
                        {priceNote && <span className="opt__price">{priceNote}</span>}
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            )
          })}

          {item.remove?.length > 0 && (
            <fieldset className="opt-group">
              <legend className="opt-group__legend">
                <span>Leave anything out?</span>
                <span className="opt-group__tag">Optional</span>
              </legend>
              <div className="chips">
                {item.remove.map((ingredient) => {
                  const off = removed.includes(ingredient)
                  return (
                    <button
                      key={ingredient}
                      type="button"
                      className={`chip ${off ? 'is-off' : ''}`}
                      aria-pressed={off}
                      onClick={() => toggleRemoved(ingredient)}
                    >
                      {off && <span className="visually-hidden">No </span>}
                      {ingredient}
                    </button>
                  )
                })}
              </div>
              {removed.length > 0 && (
                <p className="opt-group__hint">
                  Without: {removed.map((r) => r.toLowerCase()).join(', ')}
                </p>
              )}
            </fieldset>
          )}
        </div>

        <footer className="sheet__foot item-sheet__foot">
          <QuantityStepper value={qty} onChange={setQty} />
          <button ref={addRef} type="button" className="btn btn--primary btn--block" onClick={submit}>
            <span>{editing ? 'Update order' : 'Add to order'}</span>
            <span className="btn__price">{formatPrice(price * qty)}</span>
          </button>
        </footer>
      </div>
    </div>
  )
}
