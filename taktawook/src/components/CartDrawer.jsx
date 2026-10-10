import { useEffect, useRef, useState } from 'react'
import { Minus, Plus, X } from 'lucide-react'
import { useCart } from '../cart.jsx'
import { BRANCHES, WHATSAPP, formatLBP } from '../data/menu.js'

const EMPTY = { name: '', phone: '', mode: 'delivery', branch: 'sarba', address: '', notes: '' }

function validate(f) {
  const e = {}
  if (!f.name.trim()) e.name = 'Please add your name.'
  if (!/^[+\d][\d\s-]{6,}$/.test(f.phone.trim())) e.phone = 'Please add a phone number, like 03 123 456.'
  if (f.mode === 'delivery' && f.address.trim().length < 6) e.address = 'Please add your address so we can find you.'
  return e
}

export default function CartDrawer({ open, onClose }) {
  const { lines, total, dispatch } = useCart()
  const dialog = useRef(null)
  const summary = useRef(null)
  const [form, setForm] = useState(EMPTY)
  const [touched, setTouched] = useState({})
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  // showModal() traps focus, closes on Esc and makes the page behind inert
  useEffect(() => {
    const d = dialog.current
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  const set = (k) => (e) => {
    const next = { ...form, [k]: e.target.value }
    setForm(next)
    if (touched[k] || submitted) setErrors(validate(next))
  }
  const blur = (k) => () => {
    setTouched((t) => ({ ...t, [k]: true }))
    setErrors(validate(form))
  }
  const show = (k) => (touched[k] || submitted) && errors[k]

  const send = (e) => {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    setSubmitted(true)
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => summary.current?.focus())
      return
    }
    const branch = BRANCHES.find((b) => b.id === form.branch)
    const body = [
      'Hi Taktawook, I would like to order:',
      '',
      ...lines.map((l) => `${l.qty} x ${l.name}${l.opts?.length ? ` (${l.opts.join(', ')})` : ''}: ${formatLBP(l.unit * l.qty)} LBP`),
      '',
      `Total: ${formatLBP(total)} LBP`,
      `${form.mode === 'delivery' ? 'Delivery' : 'Pickup'}, ${branch.name} branch`,
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      form.mode === 'delivery' ? `Address: ${form.address.trim()}` : null,
      form.notes.trim() ? `Notes: ${form.notes.trim()}` : null,
    ].filter((x) => x !== null)
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(body.join('\n'))}`, '_blank', 'noopener')
  }

  const errList = Object.entries(errors)

  return (
    <dialog
      ref={dialog}
      className="drawer"
      aria-labelledby="order-title"
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && onClose()}
    >
      <div className="drawer__panel">
        <header className="drawer__head">
          <h2 id="order-title">Your order</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={22} aria-hidden="true" />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="drawer__empty">
            <p>Nothing here yet. Tap any price on the menu to add it.</p>
            <button className="btn btn--red" onClick={onClose}>
              Back to the menu
            </button>
          </div>
        ) : (
          <form className="drawer__body" onSubmit={send} noValidate>
            <ul className="lines">
              {lines.map((l) => (
                <li key={l.key} className="line">
                  <div className="line__info">
                    <strong>{l.name}</strong>
                    {l.opts?.length > 0 && <small>{l.opts.join(', ')}</small>}
                  </div>
                  <div className="stepper" role="group" aria-label={`How many ${l.name}`}>
                    <button type="button" onClick={() => dispatch({ type: 'qty', key: l.key, delta: -1 })} aria-label="One less">
                      <Minus size={16} aria-hidden="true" />
                    </button>
                    <output aria-live="polite">{l.qty}</output>
                    <button type="button" onClick={() => dispatch({ type: 'qty', key: l.key, delta: 1 })} aria-label="One more">
                      <Plus size={16} aria-hidden="true" />
                    </button>
                  </div>
                  <span className="line__price">{formatLBP(l.unit * l.qty)}</span>
                </li>
              ))}
            </ul>

            <div className="drawer__total">
              <span>Total</span>
              <strong>{formatLBP(total)} LBP</strong>
            </div>

            {submitted && errList.length > 0 && (
              <div className="err-summary" role="alert" tabIndex={-1} ref={summary} aria-labelledby="err-title">
                <h3 id="err-title">A few details are missing</h3>
                <ul>
                  {errList.map(([k, m]) => (
                    <li key={k}>
                      <a href={`#f-${k}`}>{m}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <fieldset className="fs">
              <legend className="label">Delivery or pickup?</legend>
              <div className="seg">
                {['delivery', 'pickup'].map((m) => (
                  <label key={m} className={form.mode === m ? 'is-on' : ''}>
                    <input type="radio" name="mode" value={m} checked={form.mode === m} onChange={set('mode')} />
                    {m === 'delivery' ? 'Delivery' : 'Pickup'}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="field">
              <label htmlFor="f-branch" className="label">Branch</label>
              <select id="f-branch" value={form.branch} onChange={set('branch')}>
                {BRANCHES.map((b) => (
                  <option key={b.id} value={b.id}>{b.area}</option>
                ))}
              </select>
            </div>

            {[
              ['name', 'Name', 'text', 'name'],
              ['phone', 'Phone', 'tel', 'tel'],
            ].map(([k, label, type, ac]) => (
              <div className={`field ${show(k) ? 'has-err' : ''}`} key={k}>
                <label htmlFor={`f-${k}`} className="label">{label}</label>
                <input
                  id={`f-${k}`}
                  type={type}
                  autoComplete={ac}
                  value={form[k]}
                  onChange={set(k)}
                  onBlur={blur(k)}
                  aria-invalid={!!show(k)}
                  aria-describedby={show(k) ? `e-${k}` : undefined}
                />
                {show(k) && <p className="field__err" id={`e-${k}`}>{errors[k]}</p>}
              </div>
            ))}

            {form.mode === 'delivery' && (
              <div className={`field ${show('address') ? 'has-err' : ''}`}>
                <label htmlFor="f-address" className="label">Address</label>
                <textarea
                  id="f-address"
                  rows="2"
                  autoComplete="street-address"
                  placeholder="Area, street, building, floor"
                  value={form.address}
                  onChange={set('address')}
                  onBlur={blur('address')}
                  aria-invalid={!!show('address')}
                  aria-describedby={show('address') ? 'e-address' : undefined}
                />
                {show('address') && <p className="field__err" id="e-address">{errors.address}</p>}
              </div>
            )}

            <div className="field">
              <label htmlFor="f-notes" className="label">Notes</label>
              <input id="f-notes" value={form.notes} onChange={set('notes')} />
            </div>

            <button type="submit" className="btn btn--red btn--block">
              Send on WhatsApp
            </button>
            <p className="drawer__fine">This opens WhatsApp with your order written out. You pay on delivery or pickup.</p>
          </form>
        )}
      </div>
    </dialog>
  )
}
