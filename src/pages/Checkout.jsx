import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Field } from '../components/Field.jsx'
import { IconArrowLeft, IconCash, IconScooter, IconStore, IconWallet } from '../components/Icons.jsx'
import { OrderSummary } from '../components/OrderSummary.jsx'
import { WhishCard } from '../components/WhishCard.jsx'
import { restaurant } from '../config/restaurant.js'
import { useCart } from '../context/CartContext.jsx'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { formatPrice } from '../lib/format.js'
import { isOpenNow, pickupSlots } from '../lib/hours.js'
import { createOrderNumber, deliveryFeeFor, LAST_ORDER_KEY, PAYMENT_LABELS } from '../lib/order.js'
import { readJSON, writeJSON } from '../lib/storage.js'
import { ordersGoToWhatsApp, submitOrder } from '../lib/submit.js'
import { isValidPhone } from '../lib/validate.js'

const CUSTOMER_KEY = 'jungs:customer:v1'

const ASAP = 'As soon as possible'

function validate(type, v) {
  const e = {}
  if (!v.name.trim()) e.name = 'Please enter your name.'
  if (!v.phone.trim()) e.phone = 'We need a number to confirm your order.'
  else if (!isValidPhone(v.phone)) e.phone = 'Enter a Lebanese number, e.g. 70 123 456.'
  if (type === 'pickup' && !v.pickupTime) e.pickupTime = 'Choose a pickup time.'
  if (type === 'delivery') {
    if (!v.area.trim()) e.area = 'Which area should we deliver to?'
    if (!v.address.trim()) e.address = 'Please add a street or landmark.'
  }
  return e
}

export default function Checkout() {
  usePageMeta('Checkout')
  const { lines, subtotal, clear } = useCart()
  const navigate = useNavigate()
  const saved = readJSON(CUSTOMER_KEY, {})

  const [type, setType] = useState(saved.type ?? 'pickup')
  const [payment, setPayment] = useState('cash')
  const [values, setValues] = useState({
    name: saved.name ?? '',
    phone: saved.phone ?? '',
    pickupTime: '',
    area: saved.area ?? '',
    address: saved.address ?? '',
    building: saved.building ?? '',
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState('idle')

  const open = isOpenNow()
  const slots = useMemo(() => pickupSlots(), [])
  const timeOptions = open ? [ASAP, ...slots] : slots
  const fee = deliveryFeeFor(type)
  const total = subtotal + fee
  const feeUnknown = type === 'delivery' && restaurant.deliveryFee == null

  const set = (key) => (e) => {
    const next = { ...values, [key]: e.target.value }
    setValues(next)
    if (submitted) setErrors(validate(type, next))
  }

  const changeType = (t) => {
    setType(t)
    if (submitted) setErrors(validate(t, values))
  }

  if (lines.length === 0) {
    return (
      <div className="container checkout-empty">
        <h1 className="page-title">Your order is empty</h1>
        <p>Add something from the menu to check out.</p>
        <Link to="/menu" className="btn btn--primary">
          Browse the menu
        </Link>
      </div>
    )
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    const found = validate(type, values)
    setErrors(found)
    if (Object.keys(found).length) {
      requestAnimationFrame(() => {
        const first = document.querySelector('.checkout [aria-invalid="true"]')
        first?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        first?.focus({ preventScroll: true })
      })
      return
    }

    const customer = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      notes: values.notes.trim(),
      ...(type === 'pickup'
        ? { pickupTime: values.pickupTime }
        : { area: values.area.trim(), address: values.address.trim(), building: values.building.trim() }),
    }
    const order = {
      number: createOrderNumber(),
      createdAt: new Date().toISOString(),
      type,
      payment,
      customer,
      lines: lines.map(({ key, ...line }) => line),
      subtotal,
      deliveryFee: fee,
      deliveryFeePending: feeUnknown,
      total,
    }

    writeJSON(CUSTOMER_KEY, { type, name: customer.name, phone: customer.phone, area: values.area, address: values.address, building: values.building })

    setStatus('sending')
    try {
      await submitOrder(order)
    } catch {
      setStatus('error')
      return
    }
    writeJSON(LAST_ORDER_KEY, order)
    clear()
    navigate(`/order/${order.number}`, { replace: true, state: { order } })
  }

  return (
    <div className="checkout">
      <div className="container">
        <Link to="/menu" className="back-link">
          <IconArrowLeft size={18} /> Back to menu
        </Link>
        <h1 className="page-title">Checkout</h1>
      </div>

      <form className="container checkout__grid" onSubmit={onSubmit} noValidate>
        <div className="checkout__form">
          <section className="co-step" aria-labelledby="step-type">
            <h2 id="step-type" className="co-step__title">
              <span className="co-step__num">1</span> How do you want it?
            </h2>
            <div className="segmented" role="radiogroup" aria-label="Order type">
              {[
                { id: 'pickup', label: 'Pickup', sub: `Ready in ${restaurant.estimates.pickupMinutes} min`, icon: IconStore },
                { id: 'delivery', label: 'Delivery', sub: feeUnknown || type !== 'delivery' ? 'Fee confirmed with order' : `${formatPrice(restaurant.deliveryFee)} delivery`, icon: IconScooter },
              ].map(({ id, label, sub, icon: Icon }) => (
                <label key={id} className={`segmented__opt ${type === id ? 'is-checked' : ''}`}>
                  <input type="radio" name="type" value={id} checked={type === id} onChange={() => changeType(id)} />
                  <Icon size={22} />
                  <span>
                    <span className="segmented__label">{label}</span>
                    <span className="segmented__sub">{sub}</span>
                  </span>
                </label>
              ))}
            </div>
            {!open && (
              <p className="notice">
                We&rsquo;re closed right now. We open at {restaurant.hours.short.split(' ')[0]}, and you can still send your order for later.
              </p>
            )}
          </section>

          <section className="co-step" aria-labelledby="step-details">
            <h2 id="step-details" className="co-step__title">
              <span className="co-step__num">2</span> Your details
            </h2>
            <div className="form__row">
              <Field label="Full name" error={errors.name}>
                {(p) => <input {...p} type="text" autoComplete="name" value={values.name} onChange={set('name')} />}
              </Field>
              <Field label="Phone number" error={errors.phone}>
                {(p) => <input {...p} type="tel" inputMode="tel" autoComplete="tel" placeholder="70 123 456" value={values.phone} onChange={set('phone')} />}
              </Field>
            </div>

            {type === 'pickup' ? (
              <Field label="Pickup time" error={errors.pickupTime} hint={`Today · ${restaurant.address.display}`}>
                {(p) => (
                  <select {...p} value={values.pickupTime} onChange={set('pickupTime')}>
                    <option value="">Choose a time</option>
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
            ) : (
              <>
                <div className="form__row">
                  <Field label="Area" error={errors.area}>
                    {(p) => <input {...p} type="text" autoComplete="address-level2" placeholder="e.g. Chekka" value={values.area} onChange={set('area')} />}
                  </Field>
                  <Field label="Building / floor / apartment" optional>
                    {(p) => <input {...p} type="text" value={values.building} onChange={set('building')} />}
                  </Field>
                </div>
                <Field label="Address" error={errors.address} hint="Street, nearby landmark, anything that helps the driver.">
                  {(p) => <input {...p} type="text" autoComplete="street-address" value={values.address} onChange={set('address')} />}
                </Field>
              </>
            )}

            <Field label={type === 'pickup' ? 'Order notes' : 'Delivery notes'} optional>
              {(p) => (
                <textarea
                  {...p}
                  rows={3}
                  placeholder={type === 'pickup' ? 'Anything the kitchen should know' : 'Call when outside, gate code...'}
                  value={values.notes}
                  onChange={set('notes')}
                />
              )}
            </Field>
          </section>

          <section className="co-step" aria-labelledby="step-pay">
            <h2 id="step-pay" className="co-step__title">
              <span className="co-step__num">3</span> Payment
            </h2>
            <div className="pay-options" role="radiogroup" aria-label="Payment method">
              {[
                { id: 'cash', icon: IconCash, sub: type === 'pickup' ? 'Pay at the counter' : 'Pay the driver' },
                { id: 'whish', icon: IconWallet, sub: 'Transfer to our Whish number' },
              ].map(({ id, icon: Icon, sub }) => (
                <label key={id} className={`pay-opt ${payment === id ? 'is-checked' : ''}`}>
                  <input type="radio" name="payment" value={id} checked={payment === id} onChange={() => setPayment(id)} />
                  <span className="pay-opt__radio" aria-hidden="true" />
                  <Icon size={22} />
                  <span>
                    <span className="pay-opt__label">{PAYMENT_LABELS[id][type]}</span>
                    <span className="pay-opt__sub">{sub}</span>
                  </span>
                </label>
              ))}
            </div>

            {payment === 'whish' && (
              <WhishCard>
                <ol className="whish__steps">
                  {feeUnknown ? (
                    <>
                      <li>Place your order below.</li>
                      <li>We reply on WhatsApp with the delivery fee and your final total.</li>
                      <li>Send that amount to the Whish number above and share the transfer screenshot in the chat.</li>
                    </>
                  ) : (
                    <>
                      <li>
                        Send <strong>{formatPrice(total)}</strong> to the Whish number above.
                      </li>
                      <li>Place your order below.</li>
                      <li>Share the transfer screenshot in the WhatsApp chat so we can match it to your order.</li>
                    </>
                  )}
                </ol>
                <p className="whish__note">Payments are checked by our team before your order is prepared.</p>
              </WhishCard>
            )}
          </section>
        </div>

        <aside className="checkout__aside">
          <div className="checkout__summary">
            <h2 className="co-step__title">Order summary</h2>
            <OrderSummary lines={lines} subtotal={subtotal} deliveryFee={fee} feePending={feeUnknown} total={total} editable />
            {status === 'error' && (
              <p className="form__error" role="alert">
                We couldn&rsquo;t send your order. Check your connection and try again, or order on WhatsApp.
              </p>
            )}
            <button type="submit" className="btn btn--primary btn--block btn--lg checkout__submit" disabled={status === 'sending'}>
              <span>{status === 'sending' ? 'Sending...' : 'Place order'}</span>
              <span className="btn__price">{formatPrice(total)}</span>
            </button>
            {ordersGoToWhatsApp && (
              <p className="checkout__fineprint">Your order opens in WhatsApp, already written. Just hit send and we take it from there.</p>
            )}
          </div>
        </aside>
      </form>
    </div>
  )
}
