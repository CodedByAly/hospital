import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import Field, { describedBy } from '../components/Field'
import CartLineThumb from '../components/CartLineThumb'
import OrderSummary, { orderTotal } from '../components/OrderSummary'
import CopyButton from '../components/CopyButton'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import { menuById } from '../data/menu'
import { restaurant, telLink } from '../config/restaurant'
import { money, itemTitle } from '../utils/format'
import { lineDetails, lineTotal } from '../utils/cartLine'
import { buildOrder, saveOrder, orderWhatsappLink, loadCustomer, saveCustomer, isValidPhone } from '../utils/order'
import usePageTitle from '../hooks/usePageTitle'

const blank = {
  type: 'delivery',
  name: '',
  phone: '',
  pickupWhen: 'asap',
  pickupTime: '',
  area: '',
  address: '',
  building: '',
  floor: '',
  apartment: '',
  notes: '',
  payment: 'cash',
}

function validate(form) {
  const e = {}
  if (!form.name.trim()) e.name = 'Please enter your name.'
  if (!form.phone.trim()) e.phone = 'We need a number to confirm your order.'
  else if (!isValidPhone(form.phone)) e.phone = 'Enter a valid phone number, e.g. 03 123 456.'
  if (form.type === 'pickup' && form.pickupWhen === 'later') {
    if (!form.pickupTime) e.pickupTime = 'Choose a pickup time.'
    else {
      const [h, m] = form.pickupTime.split(':').map(Number)
      const now = new Date()
      if (h * 60 + m <= now.getHours() * 60 + now.getMinutes()) e.pickupTime = 'Pick a time later today.'
    }
  }
  if (form.type === 'delivery') {
    if (!form.area.trim()) e.area = 'Which area should we deliver to?'
    if (!form.address.trim()) e.address = 'Add the street or a landmark.'
  }
  return e
}

export default function Checkout() {
  usePageTitle('Checkout')
  const { lines, subtotal, clear } = useCart()
  const { openItem } = useUI()
  const navigate = useNavigate()
  const [form, setForm] = useState(blank)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef(null)

  // Returning customers: prefill contact and address.
  useEffect(() => {
    const saved = loadCustomer()
    if (saved) setForm((f) => ({ ...f, ...saved }))
  }, [])

  const set = (field) => (e) => {
    const value = e?.target ? e.target.value : e
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }))
  }

  const total = orderTotal(subtotal, form.type)
  const feeUnknown = form.type === 'delivery' && typeof restaurant.ordering.deliveryFee !== 'number'
  const whish = restaurant.whish

  const minTime = useMemo(() => {
    const d = new Date(Date.now() + 15 * 60000)
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }, [])

  function onSubmit(e) {
    e.preventDefault()
    const er = validate(form)
    setErrors(er)
    const firstKey = Object.keys(er)[0]
    if (firstKey) {
      const el = formRef.current?.querySelector(`[name="${firstKey}"]`)
      el?.focus()
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setSubmitting(true)
    const order = buildOrder(form, lines, subtotal)
    saveOrder(order)
    saveCustomer({
      name: form.name.trim(),
      phone: form.phone.trim(),
      area: form.area.trim(),
      address: form.address.trim(),
      building: form.building.trim(),
      floor: form.floor.trim(),
      apartment: form.apartment.trim(),
    })
    // Opened inside the click handler so browsers don't block it.
    window.open(orderWhatsappLink(order), '_blank', 'noopener')
    clear()
    navigate(`/order/${order.id}`, { state: { justPlaced: true } })
  }

  if (lines.length === 0) {
    return (
      <main id="main" className="page checkout checkout--empty">
        <div className="container narrow">
          <div className="empty-state">
            <span className="empty-state__mark" aria-hidden="true"><Icon name="bag" size={32} strokeWidth={1.4} /></span>
            <h1 className="display display--sm">Your order is empty</h1>
            <p>Add a few things from the menu, then come back here to check out.</p>
            <Link to="/#menu" className="btn btn--primary btn--lg">See the menu</Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main id="main" className="page checkout">
      <div className="container">
        <Link to="/#menu" className="back-link">
          <Icon name="arrowLeft" size={17} /> Back to menu
        </Link>
        <h1 className="display display--sm checkout__title">Checkout</h1>

        <div className="checkout__grid">
          <form ref={formRef} className="checkout__form" onSubmit={onSubmit} noValidate>
            {/* 1. Order type */}
            <section className="step" aria-labelledby="step-type">
              <h2 id="step-type" className="step__title"><span className="step__num">1</span> How would you like it?</h2>
              <div className="segmented" role="radiogroup" aria-label="Order type">
                {[
                  { id: 'delivery', label: 'Delivery', icon: 'truck', sub: 'We bring it to you' },
                  { id: 'pickup', label: 'Pickup', icon: 'store', sub: 'Collect at Hleliyeh' },
                ].map((t) => (
                  <label key={t.id} className={`segmented__opt ${form.type === t.id ? 'is-active' : ''}`}>
                    <input type="radio" name="type" value={t.id} checked={form.type === t.id} onChange={set('type')} />
                    <Icon name={t.icon} size={22} />
                    <span className="segmented__label">{t.label}</span>
                    <span className="segmented__sub">{t.sub}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* 2. Details */}
            <section className="step" aria-labelledby="step-details">
              <h2 id="step-details" className="step__title"><span className="step__num">2</span> Your details</h2>
              <div className="form-grid">
                <Field id="co-name" label="Full name" error={errors.name}>
                  <input id="co-name" name="name" className="input" autoComplete="name" value={form.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={describedBy('co-name', errors.name)} />
                </Field>
                <Field id="co-phone" label="Phone number" error={errors.phone} hint="We call or WhatsApp this number to confirm.">
                  <input id="co-phone" name="phone" className="input" type="tel" inputMode="tel" autoComplete="tel" placeholder="03 123 456" value={form.phone} onChange={set('phone')} aria-invalid={!!errors.phone} aria-describedby={describedBy('co-phone', errors.phone, true)} />
                </Field>
              </div>

              {form.type === 'pickup' ? (
                <div className="reveal-block" key="pickup">
                  <fieldset className="choice-group">
                    <legend className="field-label">Pickup time</legend>
                    <div className="choice-group__options choice-group__options--pills">
                      <label className="pill">
                        <input type="radio" name="pickupWhen" value="asap" checked={form.pickupWhen === 'asap'} onChange={set('pickupWhen')} />
                        <span>As soon as possible</span>
                      </label>
                      <label className="pill">
                        <input type="radio" name="pickupWhen" value="later" checked={form.pickupWhen === 'later'} onChange={set('pickupWhen')} />
                        <span>Later today</span>
                      </label>
                    </div>
                  </fieldset>
                  {form.pickupWhen === 'later' && (
                    <Field id="co-time" label="Pickup at" error={errors.pickupTime} className="field--narrow">
                      <input id="co-time" name="pickupTime" className="input" type="time" min={minTime} value={form.pickupTime} onChange={set('pickupTime')} aria-invalid={!!errors.pickupTime} aria-describedby={describedBy('co-time', errors.pickupTime)} />
                    </Field>
                  )}
                  <p className="info-line">
                    <Icon name="pin" size={17} /> Pickup from {restaurant.address.line}, {restaurant.address.city}.
                  </p>
                  <Field id="co-notes" label="Order notes" optional>
                    <textarea id="co-notes" name="notes" className="input" rows={2} maxLength={300} placeholder="Anything we should know?" value={form.notes} onChange={set('notes')} />
                  </Field>
                </div>
              ) : (
                <div className="reveal-block" key="delivery">
                  <div className="form-grid">
                    <Field id="co-area" label="Area" error={errors.area}>
                      <input id="co-area" name="area" className="input" autoComplete="address-level2" placeholder="e.g. Hleliyeh" value={form.area} onChange={set('area')} aria-invalid={!!errors.area} aria-describedby={describedBy('co-area', errors.area)} />
                    </Field>
                    <Field id="co-address" label="Street & landmark" error={errors.address}>
                      <input id="co-address" name="address" className="input" autoComplete="street-address" placeholder="Street, near..." value={form.address} onChange={set('address')} aria-invalid={!!errors.address} aria-describedby={describedBy('co-address', errors.address)} />
                    </Field>
                  </div>
                  <div className="form-grid form-grid--3">
                    <Field id="co-building" label="Building" optional>
                      <input id="co-building" name="building" className="input" value={form.building} onChange={set('building')} />
                    </Field>
                    <Field id="co-floor" label="Floor" optional>
                      <input id="co-floor" name="floor" className="input" inputMode="numeric" value={form.floor} onChange={set('floor')} />
                    </Field>
                    <Field id="co-apartment" label="Apartment" optional>
                      <input id="co-apartment" name="apartment" className="input" value={form.apartment} onChange={set('apartment')} />
                    </Field>
                  </div>
                  <Field id="co-notes" label="Delivery notes" optional>
                    <textarea id="co-notes" name="notes" className="input" rows={2} maxLength={300} placeholder="Ring twice, call when downstairs..." value={form.notes} onChange={set('notes')} />
                  </Field>
                </div>
              )}
            </section>

            {/* 3. Payment */}
            <section className="step" aria-labelledby="step-pay">
              <h2 id="step-pay" className="step__title"><span className="step__num">3</span> Payment</h2>
              <div className="pay-options" role="radiogroup" aria-label="Payment method">
                <label className={`pay-opt ${form.payment === 'cash' ? 'is-active' : ''}`}>
                  <input type="radio" name="payment" value="cash" checked={form.payment === 'cash'} onChange={set('payment')} />
                  <span className="pay-opt__icon"><Icon name="cash" size={22} /></span>
                  <span className="pay-opt__text">
                    <span className="pay-opt__label">{form.type === 'pickup' ? 'Cash at pickup' : 'Cash on delivery'}</span>
                    <span className="pay-opt__sub">{form.type === 'pickup' ? 'Pay at the counter when you collect.' : 'Pay the driver when your order arrives.'}</span>
                  </span>
                </label>
                <label className={`pay-opt ${form.payment === 'whish' ? 'is-active' : ''}`}>
                  <input type="radio" name="payment" value="whish" checked={form.payment === 'whish'} onChange={set('payment')} />
                  <span className="pay-opt__icon pay-opt__icon--whish"><Icon name="wallet" size={22} /></span>
                  <span className="pay-opt__text">
                    <span className="pay-opt__label">Whish Money</span>
                    <span className="pay-opt__sub">Transfer from your Whish app.</span>
                  </span>
                </label>
              </div>

              {form.payment === 'whish' && (
                <div className="whish reveal-block">
                  {whish.number ? (
                    <>
                      <p className="whish__k">Send to our Whish number</p>
                      <div className="whish__number-row">
                        <span className="whish__number">{whish.number}</span>
                        <CopyButton text={whish.number.replace(/\s/g, '')} label="Copy number" />
                      </div>
                      {whish.accountName && <p className="whish__name">Account: {whish.accountName}</p>}
                    </>
                  ) : (
                    <p className="whish__k">Our Whish number is sent to you on WhatsApp with your order confirmation.</p>
                  )}
                  <ol className="whish__steps">
                    <li>Place your order below.</li>
                    <li>
                      Transfer <strong>{money(total)}</strong>
                      {feeUnknown ? ' plus the delivery fee we confirm with you' : ''} through Whish, with your order number in the note.
                    </li>
                    <li>Send us the transfer screenshot on WhatsApp. We check it and confirm your order.</li>
                  </ol>
                  <p className="whish__fine">Payments are checked by our team, not automatically.</p>
                </div>
              )}
            </section>

            <div className="checkout__submit">
              <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={submitting}>
                <Icon name="whatsapp" size={19} />
                <span>Place order · {money(total)}{feeUnknown ? ' + delivery' : ''}</span>
              </button>
              <p className="checkout__fine">
                Your order opens in WhatsApp, ready to send to Chippy on {restaurant.phone.display}. No WhatsApp? Call{' '}
                <a href={telLink}>{restaurant.phone.display}</a>.
              </p>
            </div>
          </form>

          <aside className="checkout__aside" aria-labelledby="aside-title">
            <div className="checkout__card">
              <h2 id="aside-title" className="checkout__aside-title">Your order</h2>
              <ul className="mini-lines">
                {lines.map((l) => {
                  const item = menuById[l.itemId]
                  return (
                    <li key={l.key} className="mini-line">
                      <CartLineThumb itemId={l.itemId} />
                      <div className="mini-line__main">
                        <p className="mini-line__name"><span className="mini-line__qty">{l.qty}×</span> {itemTitle(item)}</p>
                        {lineDetails(l).length > 0 && <p className="mini-line__details">{lineDetails(l).join(' · ')}</p>}
                        <button type="button" className="link-btn" onClick={() => openItem(l.itemId, l.key)}>Edit</button>
                      </div>
                      <span className="mini-line__price">{money(lineTotal(l))}</span>
                    </li>
                  )
                })}
              </ul>
              <OrderSummary subtotal={subtotal} orderType={form.type} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
