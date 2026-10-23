import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ordering } from '../config/restaurant'
import { useCart } from '../context/CartContext'
import { t } from '../content/text'
import { formatPrice } from '../lib/price'
import { load, save } from '../lib/storage'
import { createOrderNumber, orderWhatsAppUrl } from '../lib/order'
import { normalizeLebanesePhone } from '../lib/validate'
import { statusText, useOpenStatus } from '../components/OpenStatus'
import CartLines, { CartTotals } from '../components/CartLines'
import CopyButton from '../components/CopyButton'
import Field from '../components/Field'
import Icon from '../components/Icon'
import './Checkout.css'

const DETAILS_KEY = 'moods:customer'
const ORDERS_KEY = 'moods:orders'

const whishEnabled = Boolean(ordering.whish.number)
const showWhish = whishEnabled || import.meta.env.DEV

const empty = { name: '', phone: '', area: '', street: '', building: '', floor: '', apartment: '', notes: '' }

export default function Checkout() {
  const cart = useCart()
  const navigate = useNavigate()
  const status = useOpenStatus()
  const formRef = useRef(null)

  // Returning customers get their last details back (never the notes).
  const [form, setForm] = useState(() => ({ ...empty, ...load(DETAILS_KEY, {}), notes: '' }))
  const [payment, setPayment] = useState('cash')
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const validate = (values) => {
    const next = {}
    if (values.name.trim().length < 2) next.name = t('checkout.errors.name')
    if (!normalizeLebanesePhone(values.phone)) next.phone = t('checkout.errors.phone')
    if (!values.area.trim()) next.area = t('checkout.errors.area')
    if (!values.street.trim()) next.street = t('checkout.errors.street')
    if (!values.building.trim()) next.building = t('checkout.errors.building')
    if (payment === 'whish' && !whishEnabled) next.payment = t('checkout.errors.payment')
    return next
  }

  const update = (field) => (event) => {
    const value = event.target.value
    setForm((f) => {
      const next = { ...f, [field]: value }
      if (submitted) setErrors(validate(next))
      return next
    })
  }

  const totals = useMemo(
    () => ({ subtotalCents: cart.subtotalCents, deliveryCents: cart.deliveryCents, totalCents: cart.totalCents }),
    [cart.subtotalCents, cart.deliveryCents, cart.totalCents],
  )

  const onSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) {
      const first = formRef.current?.querySelector('[aria-invalid="true"]')
      first?.focus()
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    const customer = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()]))
    const order = {
      number: createOrderNumber(),
      createdAt: new Date().toISOString(),
      type: 'delivery',
      payment,
      customer,
      lines: cart.lines.map(({ key, itemId, selection, qty, unitCents }) => ({ key, itemId, selection, qty, unitCents })),
      ...totals,
    }

    const orders = load(ORDERS_KEY, {})
    save(ORDERS_KEY, { ...orders, [order.number]: order })
    const { notes, ...remembered } = customer
    save(DETAILS_KEY, remembered)

    // Opened straight from the click so mobile browsers don't block it.
    window.open(orderWhatsAppUrl(order), '_blank', 'noopener')
    cart.clear()
    navigate(`/order/${order.number}`, { replace: true })
  }

  if (!cart.lines.length) {
    return (
      <div className="checkout checkout--empty container">
        <div className="checkout__empty">
          <Icon name="bag" size={36} />
          <h1>{t('checkout.emptyTitle')}</h1>
          <p>{t('cart.emptyHint')}</p>
          <Link to="/menu" className="btn btn--dark">
            {t('cart.browse')}
          </Link>
        </div>
      </div>
    )
  }

  const errorCount = Object.keys(errors).length

  return (
    <div className="checkout">
      <div className="container">
        <Link to="/menu" className="checkout__back">
          <Icon name="arrow" size={16} className="checkout__back-icon" /> {t('checkout.back')}
        </Link>
        <h1 className="checkout__title">{t('checkout.title')}</h1>
        <p className="checkout__lead">{t('checkout.lead')}</p>

        {!status.open && (
          <p className="checkout__closed" role="note">
            <Icon name="clock" size={18} /> {t('checkout.closedNotice', { status: statusText(status) })}
          </p>
        )}

        <div className="checkout__grid">
          <form className="checkout__form" onSubmit={onSubmit} noValidate ref={formRef}>
            {submitted && errorCount > 0 && (
              <p className="checkout__error-summary" role="alert">
                <Icon name="alert" size={18} /> {t('checkout.errors.summary')}
              </p>
            )}

            <fieldset className="checkout__section">
              <legend>
                <span className="checkout__step num">1</span> {t('checkout.details')}
              </legend>
              <div className="form-grid">
                <Field label={t('checkout.name')} value={form.name} onChange={update('name')} error={errors.name} autoComplete="name" required className="span-2" />
                <Field
                  label={t('checkout.phone')}
                  value={form.phone}
                  onChange={update('phone')}
                  error={errors.phone}
                  hint={t('checkout.phoneHint')}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="03 123 456"
                  dir="ltr"
                  required
                  className="span-2"
                />
              </div>
            </fieldset>

            <fieldset className="checkout__section">
              <legend>
                <span className="checkout__step num">2</span> {t('checkout.address')}
              </legend>
              <div className="form-grid form-grid--3">
                <Field label={t('checkout.area')} value={form.area} onChange={update('area')} error={errors.area} placeholder={t('checkout.areaPlaceholder')} autoComplete="address-level2" required className="span-3" />
                <Field label={t('checkout.street')} value={form.street} onChange={update('street')} error={errors.street} placeholder={t('checkout.streetPlaceholder')} autoComplete="street-address" required className="span-3" />
                <Field label={t('checkout.building')} value={form.building} onChange={update('building')} error={errors.building} required />
                <Field label={t('checkout.floor')} value={form.floor} onChange={update('floor')} optional={t('checkout.optional')} inputMode="numeric" />
                <Field label={t('checkout.apartment')} value={form.apartment} onChange={update('apartment')} optional={t('checkout.optional')} />
                <Field
                  as="textarea"
                  rows={3}
                  label={t('checkout.notes')}
                  value={form.notes}
                  onChange={update('notes')}
                  optional={t('checkout.optional')}
                  placeholder={t('checkout.notesPlaceholder')}
                  className="span-3"
                  maxLength={400}
                />
              </div>
            </fieldset>

            <fieldset className="checkout__section">
              <legend>
                <span className="checkout__step num">3</span> {t('checkout.payment')}
              </legend>
              <div className="pay-options" role="radiogroup" aria-label={t('checkout.payment')}>
                <PayOption id="cash" current={payment} onSelect={setPayment} title={t('checkout.cash')} text={t('checkout.cashText')} icon="bag" />
                {showWhish && (
                  <PayOption id="whish" current={payment} onSelect={setPayment} title={t('checkout.whish')} text={t('checkout.whishText')} icon="phone">
                    <WhishDetails totalCents={cart.totalCents} />
                  </PayOption>
                )}
              </div>
              {errors.payment && <p className="field__error">{errors.payment}</p>}
            </fieldset>

            <div className="checkout__submit">
              <button type="submit" className="btn btn--primary btn--lg btn--block">
                <Icon name="whatsapp" size={20} /> {t('checkout.submit')}
                <span className="checkout__submit-total num">{formatPrice(cart.totalCents)}</span>
              </button>
              <p className="checkout__how">{t('checkout.howItWorks')}</p>
            </div>
          </form>

          <aside className="checkout__summary" aria-labelledby="summary-title">
            <h2 id="summary-title">{t('checkout.summary')}</h2>
            <CartLines editable />
            <CartTotals />
          </aside>
        </div>
      </div>
    </div>
  )
}

function PayOption({ id, current, onSelect, title, text, icon, children }) {
  const checked = current === id
  return (
    <div className={`pay-option ${checked ? 'is-checked' : ''}`}>
      <label className="pay-option__head">
        <input type="radio" name="payment" value={id} checked={checked} onChange={() => onSelect(id)} />
        <span className="pay-option__radio" aria-hidden="true" />
        <span className="pay-option__icon" aria-hidden="true">
          <Icon name={icon} size={20} />
        </span>
        <span className="pay-option__text">
          <strong>{title}</strong>
          <span>{text}</span>
        </span>
      </label>
      {checked && children && <div className="pay-option__body">{children}</div>}
    </div>
  )
}

function WhishDetails({ totalCents }) {
  const { number, accountName } = ordering.whish

  if (!number) {
    return <p className="whish__dev">{t('checkout.whishDevNote')}</p>
  }

  const display = `+${number.slice(0, 3)} ${number.slice(3, 5)} ${number.slice(5, 8)} ${number.slice(8)}`.trim()
  return (
    <div className="whish">
      <div className="whish__number">
        <span className="whish__label">{t('checkout.whishNumber')}</span>
        <span className="whish__value num">{display}</span>
        <span className="whish__name">{accountName}</span>
        <CopyButton value={`+${number}`} />
      </div>
      <ol className="whish__steps">
        {t('checkout.whishSteps').map((step, i) => (
          <li key={i}>{i === 0 ? <>{step} <strong className="num">({formatPrice(totalCents)})</strong></> : step}</li>
        ))}
      </ol>
    </div>
  )
}
