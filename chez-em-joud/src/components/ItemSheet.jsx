import { useEffect, useRef, useState } from 'react'
import Modal from './Modal'
import Logo from './Logo'
import { MinusIcon, PlusIcon } from './Icons'
import { useCart } from '../cart/CartContext'
import { flyToCart } from '../cart/flyToCart'
import { categories } from '../data/menu'
import { money } from '../data/site'
import './ItemSheet.css'

const categoryOf = (id) => categories.find((c) => c.items.some((i) => i.id === id))

export default function ItemSheet() {
  const { sheet, closeItem, add, replace, lines } = useCart()
  const open = !!sheet
  // Keep the last item around while the sheet animates out.
  const [current, setCurrent] = useState(sheet)
  useEffect(() => {
    if (sheet) setCurrent(sheet)
  }, [sheet])

  return (
    <Modal open={open} onClose={closeItem} label={current?.item.name} variant="sheet">
      {current && (
        <ItemForm
          key={`${current.item.id}-${current.editKey || 'new'}`}
          item={current.item}
          editLine={current.editKey ? lines.find((l) => l.key === current.editKey) : null}
          onDone={(line, sourceEl) => {
            if (current.editKey) replace(current.editKey, line)
            else {
              add(line)
              flyToCart(sourceEl)
            }
            closeItem()
          }}
        />
      )}
    </Modal>
  )
}

function ItemForm({ item, editLine, onDone }) {
  const [qty, setQty] = useState(editLine?.qty || 1)
  const [removed, setRemoved] = useState(editLine?.removed || [])
  const [flavor, setFlavor] = useState(editLine?.flavor || '')
  const [note, setNote] = useState(editLine?.note || '')
  const mediaRef = useRef(null)
  const category = categoryOf(item.id)

  const toggle = (ing) => setRemoved((r) => (r.includes(ing) ? r.filter((x) => x !== ing) : [...r, ing]))

  const submit = (e) => {
    e.preventDefault()
    onDone({ id: item.id, qty, removed, flavor: flavor.trim(), note: note.trim() }, mediaRef.current)
  }

  return (
    <form className="item" onSubmit={submit}>
      <div className={`item__media${item.image ? '' : ' item__media--empty'}`} ref={mediaRef}>
        {item.image ? (
          <img
            src={`/images/${item.image}.webp`}
            alt={`${item.name}: ${item.desc}`}
            width="591"
            height="523"
            decoding="async"
          />
        ) : (
          <Logo className="item__placeholder" />
        )}
      </div>

      <div className="item__body">
        <div className="item__scroll">
          {category && <p className="eyebrow">{category.title}</p>}
          <div className="item__head">
            <h2 className="item__name display">{item.name}</h2>
            <p className="item__price">{money(item.price)}</p>
          </div>
          <p className="item__desc">{item.desc}</p>

          {item.removable?.length > 0 && (
            <fieldset className="item__group">
              <legend className="item__legend">
                Leave anything out? <span className="field__opt">optional</span>
              </legend>
              <div className="item__chips">
                {item.removable.map((ing) => {
                  const off = removed.includes(ing)
                  return (
                    <button
                      key={ing}
                      type="button"
                      className={`ing${off ? ' is-off' : ''}`}
                      aria-pressed={off}
                      onClick={() => toggle(ing)}
                    >
                      <span className="ing__mark" aria-hidden="true">
                        {off ? <MinusIcon /> : <PlusIcon />}
                      </span>
                      {off ? `No ${ing.toLowerCase()}` : ing}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )}

          {item.askFlavor && (
            <div className="field item__group">
              <label htmlFor="item-flavor">
                Flavor <span className="field__opt">we’ll confirm what’s available</span>
              </label>
              <input
                id="item-flavor"
                className="input"
                value={flavor}
                onChange={(e) => setFlavor(e.target.value)}
                placeholder="e.g. cola"
                maxLength={40}
              />
            </div>
          )}

          <div className="field item__group">
            <label htmlFor="item-note">
              Note for the kitchen <span className="field__opt">optional</span>
            </label>
            <textarea
              id="item-note"
              className="input"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Extra crispy, sauce on the side…"
              maxLength={140}
            />
          </div>
        </div>

        <div className="item__foot">
          <div className="stepper" role="group" aria-label="Quantity">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="One less">
              <MinusIcon />
            </button>
            <output aria-live="polite">{qty}</output>
            <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="One more">
              <PlusIcon />
            </button>
          </div>
          <button type="submit" className="btn item__submit">
            <span>{editLine ? 'Update order' : 'Add to order'}</span>
            <span className="item__total">{money(item.price * qty)}</span>
          </button>
        </div>
      </div>
    </form>
  )
}
