import { useEffect, useMemo, useState } from 'react'
import { restaurant, formatPhone } from '../data/restaurant.js'
import { useShop } from '../context/ShopContext.jsx'
import { CartLine } from '../components/CartDrawer.jsx'
import Icon from '../components/Icon.jsx'
import WhishPanel from '../components/WhishPanel.jsx'
import { formatPrice, isValidLebanesePhone } from '../lib/format.js'
import { pickupSlots } from '../lib/hours.js'
import { buildOrder, orderMessage } from '../lib/order.js'
import { goToSection, navigate } from '../lib/router.js'
import { load, save } from '../lib/storage.js'
import { whatsappUrl } from '../lib/whatsapp.js'

const CUSTOMER_KEY = 'birdyfam:customer'
export const LAST_ORDER_KEY = 'birdyfam:lastOrder'

const blank = { type: 'pickup', branchId: '', name: '', phone: '', pickupTime: 'asap', area: '', address: '', building: '', notes: '', payment: 'cash' }

function validate(f) {
  const e = {}
  if (!f.branchId) e.branchId = 'Choose the branch for your order.'
  if (!f.name.trim()) e.name = 'Enter your name.'
  if (!f.phone.trim()) e.phone = 'Enter your phone number.'
  else if (!isValidLebanesePhone(f.phone)) e.phone = 'Enter a Lebanese number, e.g. 76 123 456 or 03 123 456.'
  if (f.type === 'delivery') {
    if (!f.area.trim()) e.area = 'Enter your area.'
    if (!f.address.trim()) e.address = 'Enter your street and building name.'
  }
  return e
}

function Field({ id, label, error, optional, hint, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>
        {label} {optional && <span className="field__opt">optional</span>}
      </label>
      {children}
      {hint && !error && <p className="field__hint">{hint}</p>}
      {error && (
        <p id={`${id}-err`} className="field-error">
          <Icon name="alert" size={15} /> {error}
        </p>
      )}
    </div>
  )
}

export default function Checkout() {
  const { lines, subtotal, count, clearCart, branchId, setBranchId } = useShop()
  const [form, setForm] = useState(() => ({ ...blank, ...load(CUSTOMER_KEY, {}), branchId: branchId || '' }))
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const { slots, sameDay } = useMemo(() => pickupSlots(), [])

  useEffect(() => {
    document.title = `Checkout | ${restaurant.name}`
  }, [])

  const update = (key, value) => {
    setForm((f) => {
      const next = { ...f, [key]: value }
      if (submitted) setErrors(validate(next))
      return next
    })
    if (key === 'branchId') setBranchId(value)
  }
  const bind = (key) => ({
    id: `co-${key}`,
    value: form[key],
    onChange: (e) => update(key, e.target.value),
    'aria-invalid': Boolean(errors[key]),
    'aria-describedby': errors[key] ? `co-${key}-err` : undefined,
  })

  const fee = form.type === 'delivery' ? restaurant.ordering.deliveryFee : 0
  const feeUnknown = form.type === 'delivery' && fee == null
  const total = subtotal + (fee || 0)

  const pickupLabel =
    form.pickupTime === 'asap'
      ? sameDay ? `as soon as possible (about ${restaurant.ordering.pickupLeadMinutes} min)` : slots[0].label
      : slots.find((s) => s.value === form.pickupTime)?.label

  const submit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    const errs = validate(form)
    setErrors(errs)
    const first = Object.keys(errs)[0]
    if (first) {
      const el = document.getElementById(`co-${first}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el?.focus({ preventScroll: true })
      return
    }
    const order = buildOrder({ lines, subtotal, form, pickupLabel })
    save(LAST_ORDER_KEY, order)
    // Remember contact details for next time, never the notes or payment.
    const { name, phone, area, address, building, type } = form
    save(CUSTOMER_KEY, { name, phone, area, address, building, type })
    window.open(whatsappUrl(orderMessage(order)), '_blank', 'noopener')
    clearCart()
    navigate('/order-confirmed')
    window.scrollTo(0, 0)
  }

  if (!count) {
    return (
      <main id="main" className="page checkout checkout--empty container">
        <img src="/images/logo-240.webp" alt="" width="110" height="110" />
        <h1 className="page-title">Your bag is empty</h1>
        <p className="muted">Add something from the menu first, then come back here to check out.</p>
        <button type="button" className="btn btn--primary" onClick={() => goToSection('menu')}>Go to the menu</button>
      </main>
    )
  }

  const errorCount = Object.keys(errors).length

  return (
    <main id="main" className="page checkout">
      <div className="container">
        <button type="button" className="back-link" onClick={() => goToSection('menu')}>
          <Icon name="arrowLeft" size={18} /> Back to menu
        </button>
        <h1 className="page-title">Checkout</h1>
      </div>

      <form className="container checkout__grid" onSubmit={submit} noValidate>
        <div className="checkout__form">
          {submitted && errorCount > 0 && (
            <p className="form-alert" role="alert">
              <Icon name="alert" size={16} /> Please check the {errorCount === 1 ? 'highlighted field' : `${errorCount} highlighted fields`}.
            </p>
          )}

          <section className="co-step" aria-labelledby="step-type">
            <h2 id="step-type" className="co-step__title"><span className="co-step__num">1</span> Pickup or delivery</h2>
            <div className="seg" role="radiogroup" aria-labelledby="step-type">
              {[
                restaurant.ordering.pickup && { id: 'pickup', label: 'Pickup', hint: 'Ready at the branch', icon: 'store' },
                restaurant.ordering.delivery && { id: 'delivery', label: 'Delivery', hint: 'Brought to your door', icon: 'scooter' },
              ].filter(Boolean).map((o) => (
                <label key={o.id} className={`seg__opt ${form.type === o.id ? 'is-on' : ''}`}>
                  <input type="radio" name="type" value={o.id} checked={form.type === o.id} onChange={() => update('type', o.id)} />
                  <Icon name={o.icon} size={24} />
                  <span className="seg__label">{o.label}</span>
                  <span className="seg__hint">{o.hint}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="co-step" aria-labelledby="step-branch">
            <h2 id="step-branch" className="co-step__title">
              <span className="co-step__num">2</span> {form.type === 'pickup' ? 'Pickup branch' : 'Delivering branch'}
            </h2>
            <div className={`branch-pick ${errors.branchId ? 'has-error' : ''}`} role="radiogroup" aria-labelledby="step-branch">
              {restaurant.branches.map((b, i) => (
                <label key={b.id} className={`branch-pick__opt ${form.branchId === b.id ? 'is-on' : ''}`}>
                  <input
                    type="radio"
                    name="branch"
                    id={i === 0 ? 'co-branchId' : undefined}
                    value={b.id}
                    checked={form.branchId === b.id}
                    onChange={() => update('branchId', b.id)}
                  />
                  <Icon name="pin" size={20} />
                  <span>
                    <span className="branch-pick__name">{b.name}</span>
                    <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer" className="branch-pick__map" onClick={(e) => e.stopPropagation()}>
                      View on map
                    </a>
                  </span>
                </label>
              ))}
            </div>
            {form.type === 'delivery' && <p className="field__hint">Pick the branch closest to you.</p>}
            {errors.branchId && <p id="co-branchId-err" className="field-error"><Icon name="alert" size={15} /> {errors.branchId}</p>}
          </section>

          <section className="co-step" aria-labelledby="step-details">
            <h2 id="step-details" className="co-step__title"><span className="co-step__num">3</span> Your details</h2>
            <div className="field-row">
              <Field id="co-name" label="Full name" error={errors.name}>
                <input {...bind('name')} autoComplete="name" />
              </Field>
              <Field id="co-phone" label="Phone number" error={errors.phone} hint="We'll call or WhatsApp this number about your order.">
                <div className="input-prefix">
                  <span aria-hidden="true">+{restaurant.countryCode}</span>
                  <input {...bind('phone')} type="tel" inputMode="tel" autoComplete="tel-national" placeholder="76 123 456" />
                </div>
              </Field>
            </div>

            {form.type === 'pickup' ? (
              <>
                <Field id="co-pickupTime" label="Pickup time">
                  <select {...bind('pickupTime')}>
                    <option value="asap">
                      {sameDay ? `As soon as possible (about ${restaurant.ordering.pickupLeadMinutes} min)` : `First thing: ${slots[0].label}`}
                    </option>
                    {slots.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </Field>
                <Field id="co-notes" label="Order notes" optional>
                  <textarea {...bind('notes')} rows="3" placeholder="Anything the kitchen should know" />
                </Field>
              </>
            ) : (
              <>
                <Field id="co-area" label="Area" error={errors.area}>
                  <input {...bind('area')} autoComplete="address-level2" placeholder="Your neighbourhood or town" />
                </Field>
                <Field id="co-address" label="Street and building" error={errors.address}>
                  <input {...bind('address')} autoComplete="street-address" />
                </Field>
                <Field id="co-building" label="Floor / apartment" optional>
                  <input {...bind('building')} placeholder="e.g. 3rd floor, apt 7" />
                </Field>
                <Field id="co-notes" label="Delivery notes" optional>
                  <textarea {...bind('notes')} rows="3" placeholder="Landmark, gate code, or anything the driver should know" />
                </Field>
              </>
            )}
          </section>

          <section className="co-step" aria-labelledby="step-pay">
            <h2 id="step-pay" className="co-step__title"><span className="co-step__num">4</span> Payment</h2>
            <div className="pay-opts" role="radiogroup" aria-labelledby="step-pay">
              <label className={`pay-opt ${form.payment === 'cash' ? 'is-on' : ''}`}>
                <input type="radio" name="payment" value="cash" checked={form.payment === 'cash'} onChange={() => update('payment', 'cash')} />
                <Icon name="cash" size={22} />
                <span>
                  <span className="pay-opt__label">{form.type === 'pickup' ? 'Cash at pickup' : 'Cash on delivery'}</span>
                  <span className="pay-opt__hint">{form.type === 'pickup' ? 'Pay at the counter when you collect.' : 'Pay the driver when your order arrives.'}</span>
                </span>
              </label>
              <label className={`pay-opt ${form.payment === 'whish' ? 'is-on' : ''}`}>
                <input type="radio" name="payment" value="whish" checked={form.payment === 'whish'} onChange={() => update('payment', 'whish')} />
                <Icon name="wallet" size={22} />
                <span>
                  <span className="pay-opt__label">Whish Money</span>
                  <span className="pay-opt__hint">Transfer from your Whish app.</span>
                </span>
              </label>
            </div>
            {form.payment === 'whish' && <WhishPanel amount={total} feeUnknown={feeUnknown} />}
          </section>
        </div>

        <aside className="checkout__summary" aria-labelledby="summary-title">
          <div className="summary">
            <button type="button" className="summary__toggle" onClick={() => setSummaryOpen((o) => !o)} aria-expanded={summaryOpen} aria-controls="summary-lines">
              <h2 id="summary-title" className="summary__title">Order summary <span className="muted">({count})</span></h2>
              <span className="summary__toggle-total">{formatPrice(total)}<Icon name="arrowRight" size={16} className="summary__chev" /></span>
            </button>
            <ul id="summary-lines" className={`summary__lines ${summaryOpen ? 'is-open' : ''}`}>
              {lines.map((l) => <CartLine key={l.uid} line={l} compact />)}
            </ul>
            <dl className="totals">
              <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
              {form.type === 'delivery' && (
                <div><dt>Delivery</dt><dd>{feeUnknown ? 'Confirmed on WhatsApp' : formatPrice(fee)}</dd></div>
              )}
              <div className="totals__grand"><dt>Total</dt><dd>{formatPrice(total)}{feeUnknown && <small> + delivery</small>}</dd></div>
            </dl>
            <button type="submit" className="btn btn--primary btn--block btn--lg summary__submit">
              <Icon name="whatsapp" size={20} />
              Send order on WhatsApp
            </button>
            <p className="summary__fine">
              Your order opens in WhatsApp, already written out. Send it to {formatPhone()} and the branch confirms it with you there.
            </p>
          </div>
        </aside>

        <div className="checkout__bar">
          <div>
            <span className="checkout__bar-label">Total</span>
            <span className="checkout__bar-total">{formatPrice(total)}{feeUnknown && <small> + delivery</small>}</span>
          </div>
          <button type="submit" className="btn btn--primary btn--lg">
            <Icon name="whatsapp" size={20} /> Send order
          </button>
        </div>
      </form>
    </main>
  )
}
