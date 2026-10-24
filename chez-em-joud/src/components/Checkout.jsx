import { useEffect, useState } from 'react'
import { ArrowRightIcon, ScooterIcon, StoreIcon, WhatsAppIcon } from './Icons'
import { useCart } from '../cart/CartContext'
import { makeOrderNumber, orderMessage, orderTotals } from '../cart/order'
import { itemsById } from '../data/menu'
import { money, site, whatsappLink } from '../data/site'
import './Checkout.css'

const SAVED_KEY = 'cej:customer'
const blank = {
  name: '',
  phone: '',
  area: '',
  address: '',
  building: '',
  pickupTime: 'asap',
  pickupAt: '',
  notes: '',
}

const phoneOk = (v) => /^\+?[\d\s()-]{7,}$/.test(v.trim()) && v.replace(/\D/g, '').length >= 7

function validate(v, type) {
  const e = {}
  if (!v.name.trim()) e.name = 'Please enter your name.'
  if (!v.phone.trim()) e.phone = 'We need a number to confirm your order.'
  else if (!phoneOk(v.phone)) e.phone = 'Enter a valid phone number, e.g. 03 123 456.'
  if (type === 'delivery') {
    if (!v.area.trim()) e.area = 'Which area should we deliver to?'
    if (!v.address.trim()) e.address = 'Add a street or landmark so the driver can find you.'
  } else if (v.pickupTime === 'later' && !v.pickupAt) {
    e.pickupAt = 'Pick a time, or choose “As soon as possible”.'
  }
  return e
}

export default function Checkout({ onBack }) {
  const { lines, clear, closeCart, showOrder } = useCart()
  const both = site.ordering.delivery && site.ordering.pickup
  const [type, setType] = useState(site.ordering.delivery ? 'delivery' : 'pickup')
  const [v, setV] = useState(blank)
  const [touched, setTouched] = useState({})
  const [errors, setErrors] = useState({})

  // Returning customers don't retype their details.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVED_KEY) || 'null')
      if (saved) setV((cur) => ({ ...cur, ...saved, pickupTime: 'asap', pickupAt: '', notes: '' }))
    } catch {
      /* ignore */
    }
  }, [])

  const totals = orderTotals(lines, type)
  const payment = type === 'delivery' ? 'Cash on delivery' : 'Cash at pickup'

  const set = (field) => (e) => {
    const next = { ...v, [field]: e.target.value }
    setV(next)
    if (touched[field]) setErrors(validate(next, type))
  }
  const blur = (field) => () => {
    setTouched((t) => ({ ...t, [field]: true }))
    setErrors(validate(v, type))
  }

  useEffect(() => {
    if (Object.keys(touched).length) setErrors(validate(v, type))
  }, [type]) // eslint-disable-line react-hooks/exhaustive-deps

  const submit = (e) => {
    e.preventDefault()
    const errs = validate(v, type)
    setErrors(errs)
    setTouched({ name: true, phone: true, area: true, address: true, pickupAt: true })
    const first = ['name', 'phone', 'area', 'address', 'pickupAt'].find((f) => errs[f])
    if (first) {
      document.getElementById(`co-${first}`)?.focus()
      return
    }

    const customer = Object.fromEntries(Object.entries(v).map(([k, val]) => [k, typeof val === 'string' ? val.trim() : val]))
    const order = {
      number: makeOrderNumber(),
      type,
      customer,
      lines,
      totals,
      payment,
      placedAt: new Date().toISOString(),
    }
    order.message = orderMessage(order)

    // Open WhatsApp straight from the click so browsers don't block it.
    window.open(whatsappLink(order.message), '_blank', 'noopener')

    try {
      const { name, phone, area, address, building } = customer
      localStorage.setItem(SAVED_KEY, JSON.stringify({ name, phone, area, address, building }))
    } catch {
      /* ignore */
    }

    showOrder(order)
    clear()
    closeCart()
  }

  const fp = (field) => ({
    id: `co-${field}`,
    name: field,
    value: v[field],
    onChange: set(field),
    onBlur: blur(field),
    className: 'input',
    'aria-invalid': touched[field] && errors[field] ? 'true' : undefined,
    'aria-describedby': touched[field] && errors[field] ? `co-${field}-err` : undefined,
  })
  const err = (field) =>
    touched[field] &&
    errors[field] && (
      <p className="field__error" id={`co-${field}-err`}>
        {errors[field]}
      </p>
    )

  return (
    <form className="checkout" onSubmit={submit} noValidate>
      <header className="checkout__head">
        <button type="button" className="checkout__back" onClick={onBack}>
          <ArrowRightIcon /> Back to order
        </button>
        <h2 className="display checkout__title">Checkout</h2>
      </header>

      <div className="checkout__body">
        {both && (
          <fieldset className="checkout__section">
            <legend className="checkout__legend">How do you want it?</legend>
            <div className="seg">
              <label className={`seg__opt${type === 'delivery' ? ' is-on' : ''}`}>
                <input type="radio" name="type" value="delivery" checked={type === 'delivery'} onChange={() => setType('delivery')} />
                <ScooterIcon />
                <span>
                  <strong>Delivery</strong>
                  <small>To your door</small>
                </span>
              </label>
              <label className={`seg__opt${type === 'pickup' ? ' is-on' : ''}`}>
                <input type="radio" name="type" value="pickup" checked={type === 'pickup'} onChange={() => setType('pickup')} />
                <StoreIcon />
                <span>
                  <strong>Pickup</strong>
                  <small>Collect it yourself</small>
                </span>
              </label>
            </div>
          </fieldset>
        )}

        <fieldset className="checkout__section">
          <legend className="checkout__legend">Your details</legend>
          <div className="checkout__grid">
            <div className="field">
              <label htmlFor="co-name">Name</label>
              <input type="text" autoComplete="name" {...fp('name')} />
              {err('name')}
            </div>
            <div className="field">
              <label htmlFor="co-phone">Phone number</label>
              <input type="tel" autoComplete="tel" inputMode="tel" placeholder="03 123 456" {...fp('phone')} />
              {err('phone')}
            </div>
          </div>
        </fieldset>

        {type === 'delivery' ? (
          <fieldset className="checkout__section" key="delivery">
            <legend className="checkout__legend">Delivery address</legend>
            <div className="field">
              <label htmlFor="co-area">Area</label>
              <input type="text" autoComplete="address-level2" placeholder="Town or neighbourhood" {...fp('area')} />
              {err('area')}
            </div>
            <div className="field">
              <label htmlFor="co-address">Street &amp; landmark</label>
              <input type="text" autoComplete="street-address" placeholder="Street, near…" {...fp('address')} />
              {err('address')}
            </div>
            <div className="field">
              <label htmlFor="co-building">
                Building, floor, apartment <span className="field__opt">optional</span>
              </label>
              <input type="text" {...fp('building')} />
            </div>
            <div className="field">
              <label htmlFor="co-notes">
                Delivery notes <span className="field__opt">optional</span>
              </label>
              <textarea rows={2} placeholder="Ring twice, call when you arrive…" {...fp('notes')} />
            </div>
          </fieldset>
        ) : (
          <fieldset className="checkout__section" key="pickup">
            <legend className="checkout__legend">Pickup time</legend>
            <div className="seg seg--small">
              <label className={`seg__opt${v.pickupTime === 'asap' ? ' is-on' : ''}`}>
                <input
                  type="radio"
                  name="pickupTime"
                  value="asap"
                  checked={v.pickupTime === 'asap'}
                  onChange={() => setV((c) => ({ ...c, pickupTime: 'asap' }))}
                />
                <span>
                  <strong>As soon as possible</strong>
                </span>
              </label>
              <label className={`seg__opt${v.pickupTime === 'later' ? ' is-on' : ''}`}>
                <input
                  type="radio"
                  name="pickupTime"
                  value="later"
                  checked={v.pickupTime === 'later'}
                  onChange={() => setV((c) => ({ ...c, pickupTime: 'later' }))}
                />
                <span>
                  <strong>Choose a time</strong>
                </span>
              </label>
            </div>
            {v.pickupTime === 'later' && (
              <div className="field">
                <label htmlFor="co-pickupAt">Time</label>
                <input type="time" {...fp('pickupAt')} />
                {err('pickupAt')}
              </div>
            )}
            <div className="field">
              <label htmlFor="co-notes">
                Order notes <span className="field__opt">optional</span>
              </label>
              <textarea rows={2} {...fp('notes')} />
            </div>
          </fieldset>
        )}

        <fieldset className="checkout__section">
          <legend className="checkout__legend">Payment</legend>
          <label className="pay is-on">
            <input type="radio" name="payment" checked readOnly />
            <span className="pay__dot" aria-hidden="true" />
            <span>
              <strong>{payment}</strong>
              <small>
                {type === 'delivery'
                  ? 'Pay the driver in cash when your order arrives.'
                  : 'Pay in cash when you collect your order.'}
              </small>
            </span>
          </label>
        </fieldset>

        <section className="checkout__section" aria-label="Order summary">
          <p className="checkout__legend">Summary</p>
          <ul className="summary">
            {lines.map((l) => (
              <li key={l.key}>
                <span>
                  {l.qty} × {itemsById[l.id].name}
                </span>
                <span>{money(itemsById[l.id].price * l.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="totals">
            <div>
              <dt>Subtotal</dt>
              <dd>{money(totals.subtotal)}</dd>
            </div>
            {type === 'delivery' && (
              <div className="totals__muted">
                <dt>Delivery</dt>
                <dd>{totals.fee == null ? 'Confirmed on WhatsApp' : money(totals.fee)}</dd>
              </div>
            )}
            <div className="totals__grand">
              <dt>Total</dt>
              <dd>
                {money(totals.total)}
                {type === 'delivery' && totals.fee == null && <small> + delivery</small>}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <footer className="checkout__foot">
        <p className="checkout__how">
          Your order opens in WhatsApp, ready to send to us. We reply there to confirm it and let you
          know the timing.
        </p>
        <button type="submit" className="btn btn--block checkout__submit">
          <WhatsAppIcon /> Send order on WhatsApp
        </button>
      </footer>
    </form>
  )
}
