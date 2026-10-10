import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '../cart.jsx'
import { BRANCHES, WHATSAPP, formatLBP } from '../data/menu.js'
import { FLYERS } from './FoodIcons.jsx'

function LineIcon({ name }) {
  const Icon = FLYERS[name]
  return <span className="line__ph">{Icon && <Icon width="80%" height="80%" />}</span>
}

const EMPTY = { name: '', phone: '', mode: 'delivery', branch: 'sarba', address: '', notes: '' }

function validate(f) {
  const e = {}
  if (!f.name.trim()) e.name = 'Enter your name so we know who the order is for.'
  if (!/^[+\d][\d\s-]{6,}$/.test(f.phone.trim())) e.phone = 'Enter a phone number, for example 03 123 456.'
  if (f.mode === 'delivery' && f.address.trim().length < 6) e.address = 'Enter a delivery address with street and building.'
  return e
}

export default function CartDrawer({ open, onClose }) {
  const { lines, total, count, dispatch } = useCart()
  const dialog = useRef(null)
  const summary = useRef(null)
  const [form, setForm] = useState(EMPTY)
  const [touched, setTouched] = useState({})
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  // <dialog>.showModal() gives us focus trapping, Esc to close and an inert page for free
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
      'Hello Taktawook! I would like to order:',
      '',
      ...lines.map((l) => `• ${l.qty} × ${l.name}${l.opts?.length ? ` (${l.opts.join(', ')})` : ''}: ${formatLBP(l.unit * l.qty)}`),
      '',
      `Total: ${formatLBP(total)}`,
      `${form.mode === 'delivery' ? 'Delivery' : 'Pickup'} from: ${branch.name}`,
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
      aria-labelledby="bag-title"
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && onClose()}
    >
      <div className="drawer__panel">
        <header className="drawer__head">
          <h2 id="bag-title">
            <ShoppingBag size={24} aria-hidden="true" /> Your bag <span>({count})</span>
          </h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close bag">
            <X size={22} aria-hidden="true" />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="drawer__empty">
            <img src="/images/logo.png" alt="" width="120" height="120" />
            <p>Your bag is empty. The chicken is waiting.</p>
            <button className="btn btn--primary" onClick={onClose}>
              Browse the menu
            </button>
          </div>
        ) : (
          <form className="drawer__body" onSubmit={send} noValidate>
            <ul className="lines">
              {lines.map((l) => (
                <li key={l.key} className="line">
                  {l.img ? (
                    <img src={`/images/${l.img}.webp`} alt="" />
                  ) : (
                    <LineIcon name={l.icon} />
                  )}
                  <div className="line__info">
                    <strong>{l.name}</strong>
                    {l.opts?.length > 0 && <small>{l.opts.join(' · ')}</small>}
                    <span>{formatLBP(l.unit * l.qty)}</span>
                  </div>
                  <div className="stepper" role="group" aria-label={`Quantity of ${l.name}`}>
                    <button type="button" onClick={() => dispatch({ type: 'qty', key: l.key, delta: -1 })} aria-label="Remove one">
                      {l.qty === 1 ? <Trash2 size={16} aria-hidden="true" /> : <Minus size={16} aria-hidden="true" />}
                    </button>
                    <output aria-live="polite">{l.qty}</output>
                    <button type="button" onClick={() => dispatch({ type: 'qty', key: l.key, delta: 1 })} aria-label="Add one">
                      <Plus size={16} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="drawer__total">
              <span>Total</span>
              <strong>{formatLBP(total)}</strong>
            </div>

            {submitted && errList.length > 0 && (
              <div className="err-summary" role="alert" tabIndex={-1} ref={summary} aria-labelledby="err-title">
                <h3 id="err-title">Please fix {errList.length === 1 ? 'one thing' : `${errList.length} things`}</h3>
                <ul>
                  {errList.map(([k, m]) => (
                    <li key={k}>
                      <a href={`#f-${k}`}>{m}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <fieldset className="seg seg--wide">
              <legend className="label">How do you want it?</legend>
              {['delivery', 'pickup'].map((m) => (
                <label key={m} className={form.mode === m ? 'is-on' : ''}>
                  <input type="radio" name="mode" value={m} checked={form.mode === m} onChange={set('mode')} />
                  {m === 'delivery' ? 'Delivery' : 'Pickup'}
                </label>
              ))}
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
              ['name', 'Your name', 'text', 'name'],
              ['phone', 'Phone number', 'tel', 'tel'],
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
                <label htmlFor="f-address" className="label">Delivery address</label>
                <textarea
                  id="f-address"
                  rows="2"
                  autoComplete="street-address"
                  value={form.address}
                  onChange={set('address')}
                  onBlur={blur('address')}
                  aria-invalid={!!show('address')}
                  aria-describedby={show('address') ? 'e-address' : 'h-address'}
                />
                {show('address') ? (
                  <p className="field__err" id="e-address">{errors.address}</p>
                ) : (
                  <p className="field__help" id="h-address">Area, street, building and floor.</p>
                )}
              </div>
            )}

            <div className="field">
              <label htmlFor="f-notes" className="label">Notes <span className="opt">(optional)</span></label>
              <input id="f-notes" value={form.notes} onChange={set('notes')} placeholder="Extra garlic, no pickles…" />
            </div>

            <button type="submit" className="btn btn--whatsapp btn--block">
              <MessageCircle size={20} aria-hidden="true" /> Send order on WhatsApp
            </button>
            <p className="drawer__fine">Opens WhatsApp with your order ready to send. Payment on delivery or pickup.</p>
          </form>
        )}
      </div>
    </dialog>
  )
}
