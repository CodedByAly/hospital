import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { restaurant } from '../config/restaurant'
import { imageUrl } from '../data/menu'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { useMeta } from '../hooks/useMeta'
import { formatPrice, formatTime, isValidPhone } from '../lib/format'
import { createOrder, orderWhatsappLink, saveOrder, savedCustomer } from '../lib/order'
import Field from '../components/Field'
import FoodImage from '../components/FoodImage'
import Icon from '../components/Icon'
import LineDetails from '../components/LineDetails'
import WhishPanel from '../components/WhishPanel'
import './Checkout.css'

const TYPES = [
  { id: 'dineIn', icon: 'table', enabled: restaurant.ordering.dineIn },
  { id: 'pickup', icon: 'walk', enabled: restaurant.ordering.pickup },
  { id: 'delivery', icon: 'scooter', enabled: restaurant.ordering.delivery },
].filter((x) => x.enabled)

/** Pickup slots every 15 minutes for the next 6 hours, starting after the prep lead time. */
function pickupSlots() {
  const start = new Date(Date.now() + restaurant.ordering.pickupLeadMinutes * 60000)
  start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15, 0, 0)
  return Array.from({ length: 24 }, (_, i) => new Date(start.getTime() + i * 15 * 60000))
}

function validate(form, t) {
  const e = {}
  if (form.name.trim().length < 2) e.name = t('checkout.errors.name')
  if (!isValidPhone(form.phone)) e.phone = t('checkout.errors.phone')
  if (form.type === 'dineIn' && !form.table.trim()) e.table = t('checkout.errors.table')
  if (form.type === 'pickup' && !form.time) e.time = t('checkout.errors.time')
  if (form.type === 'delivery') {
    if (!form.area.trim()) e.area = t('checkout.errors.area')
    if (form.address.trim().length < 4) e.address = t('checkout.errors.address')
  }
  return e
}

export default function Checkout() {
  const { t, pick, lang } = useLanguage()
  const cart = useCart()
  const navigate = useNavigate()
  const formRef = useRef(null)
  useMeta({ title: t('meta.checkoutTitle'), path: '/checkout' })

  const [form, setForm] = useState(() => {
    const saved = savedCustomer() ?? {}
    return {
      type: TYPES[0]?.id ?? 'pickup',
      name: saved.name ?? '', phone: saved.phone ?? '', table: '', time: 'asap',
      area: saved.area ?? '', address: saved.address ?? '', building: saved.building ?? '',
      notes: '', payment: 'cash',
    }
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [placing, setPlacing] = useState(false)
  const slots = useMemo(() => pickupSlots(), [])

  const set = (key) => (e) => {
    const value = e?.target ? e.target.value : e
    const next = { ...form, [key]: value }
    setForm(next)
    if (submitted) setErrors(validate(next, t))
  }

  const deliveryFee = form.type === 'delivery' ? cart.deliveryFee : 0
  const total = cart.subtotal + (deliveryFee || 0)

  const submit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    const found = validate(form, t)
    setErrors(found)
    if (Object.keys(found).length) {
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus())
      return
    }
    setPlacing(true)
    const order = createOrder({ form, lines: cart.lines, subtotal: cart.subtotal, lang })
    saveOrder(order)
    // opened inside the submit handler so browsers treat it as user-initiated
    window.open(orderWhatsappLink(order), '_blank', 'noopener')
    cart.clear()
    navigate(`/order/${order.number}`, { state: { justPlaced: true } })
  }

  if (cart.lines.length === 0 && !placing) {
    return (
      <div className="container checkout-empty">
        <h1 className="page-title">{t('checkout.title')}</h1>
        <p>{t('checkout.emptyCart')}</p>
        <Link to="/menu" className="btn btn--primary">{t('cart.browse')}</Link>
      </div>
    )
  }

  const cashLabel = { dineIn: t('checkout.cashDineIn'), pickup: t('checkout.cashPickup'), delivery: t('checkout.cashDelivery') }[form.type]

  return (
    <div className="container checkout">
      <Link to="/menu" className="link-arrow link-arrow--back">
        <Icon name="back" size={18} className="flip-rtl" /> {t('checkout.back')}
      </Link>
      <h1 className="page-title">{t('checkout.title')}</h1>

      <div className="checkout__grid">
        <form ref={formRef} className="checkout__form" onSubmit={submit} noValidate>
          {submitted && Object.keys(errors).length > 0 && (
            <p className="form-alert" role="alert">{t('checkout.errors.fix')}</p>
          )}

          <fieldset className="checkout__block">
            <legend className="checkout__legend"><span>1</span>{t('checkout.orderType')}</legend>
            <div className="type-grid">
              {TYPES.map((type) => (
                <label key={type.id} className="type-card">
                  <input type="radio" name="type" value={type.id} checked={form.type === type.id} onChange={set('type')} />
                  <Icon name={type.icon} size={24} />
                  <span className="type-card__name">{t(`checkout.${type.id}`)}</span>
                  <span className="type-card__hint">{t(`checkout.${type.id}Hint`)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="checkout__block">
            <legend className="checkout__legend"><span>2</span>{t('checkout.details')}</legend>
            <div className="form-grid">
              <Field label={t('checkout.name')} error={errors.name}>
                <input className="input" value={form.name} onChange={set('name')} autoComplete="name" maxLength={60} />
              </Field>
              <Field label={t('checkout.phone')} hint={t('checkout.phoneHint')} error={errors.phone}>
                <input className="input" value={form.phone} onChange={set('phone')} type="tel" inputMode="tel" autoComplete="tel" dir="ltr" maxLength={20} />
              </Field>

              {form.type === 'dineIn' && (
                <Field label={t('checkout.table')} hint={t('checkout.tableHint')} error={errors.table}>
                  <input className="input" value={form.table} onChange={set('table')} inputMode="numeric" maxLength={6} />
                </Field>
              )}

              {form.type === 'pickup' && (
                <Field label={t('checkout.pickupTime')} error={errors.time}>
                  <select className="input" value={form.time} onChange={set('time')}>
                    <option value="asap">{t('checkout.asap')}</option>
                    {slots.map((d) => {
                      const label = formatTime(d, lang)
                      return <option key={d.getTime()} value={label}>{label}</option>
                    })}
                  </select>
                </Field>
              )}

              {form.type === 'delivery' && (
                <>
                  <Field label={t('checkout.area')} error={errors.area}>
                    <input className="input" value={form.area} onChange={set('area')} placeholder={t('checkout.areaPlaceholder')} autoComplete="address-level2" maxLength={60} />
                  </Field>
                  <Field label={t('checkout.address')} error={errors.address} className="form-grid__wide">
                    <input className="input" value={form.address} onChange={set('address')} placeholder={t('checkout.addressPlaceholder')} autoComplete="street-address" maxLength={120} />
                  </Field>
                  <Field label={t('checkout.building')} optional className="form-grid__wide">
                    <input className="input" value={form.building} onChange={set('building')} placeholder={t('checkout.buildingPlaceholder')} maxLength={80} />
                  </Field>
                </>
              )}

              <Field label={form.type === 'delivery' ? t('checkout.deliveryNotes') : t('checkout.notes')} optional className="form-grid__wide">
                <textarea className="input" rows={3} value={form.notes} onChange={set('notes')} placeholder={t('checkout.notesPlaceholder')} maxLength={300} />
              </Field>
            </div>
          </fieldset>

          <fieldset className="checkout__block">
            <legend className="checkout__legend"><span>3</span>{t('checkout.payment')}</legend>
            <div className="pay-list">
              {restaurant.payments.cash && (
                <label className="pay-option">
                  <input type="radio" name="payment" value="cash" checked={form.payment === 'cash'} onChange={set('payment')} />
                  <Icon name="cash" size={22} />
                  <span>
                    <span className="pay-option__name">{cashLabel}</span>
                    <span className="pay-option__hint">{t('checkout.cashHint')}</span>
                  </span>
                </label>
              )}
              {restaurant.payments.whish.enabled && (
                <label className="pay-option">
                  <input type="radio" name="payment" value="whish" checked={form.payment === 'whish'} onChange={set('payment')} />
                  <Icon name="wallet" size={22} />
                  <span>
                    <span className="pay-option__name">{t('checkout.whish')}</span>
                    <span className="pay-option__hint">{t('checkout.whishHint')}</span>
                  </span>
                </label>
              )}
            </div>
            {form.payment === 'whish' && <WhishPanel total={total} />}
          </fieldset>

          <p className="field-hint checkout__note">
            <Icon name="whatsapp" size={14} /> {t('checkout.sendNote')}
          </p>
          <div className="checkout__submit">
            <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={placing}>
              <Icon name="whatsapp" size={20} />
              {placing ? t('checkout.placing') : t('checkout.place')}
              <span className="btn__price">{formatPrice(total, lang)}</span>
            </button>
          </div>
        </form>

        <aside className="checkout__summary" aria-labelledby="summary-title">
          <h2 id="summary-title">{t('checkout.summary')}</h2>
          <ul className="summary-lines">
            {cart.lines.map((line) => (
              <li key={line.key}>
                <FoodImage src={imageUrl(line.item.image)} alt="" className="summary-lines__img" />
                <div>
                  <p className="summary-lines__name"><span className="summary-lines__qty">{line.qty}×</span> {pick(line.item.name)}</p>
                  <LineDetails line={line} />
                </div>
                <span className="summary-lines__price">{formatPrice(line.lineTotal, lang)}</span>
              </li>
            ))}
          </ul>
          <dl className="totals">
            <div><dt>{t('cart.subtotal')}</dt><dd>{formatPrice(cart.subtotal, lang)}</dd></div>
            {form.type === 'delivery' && (
              <div className="totals__muted">
                <dt>{t('cart.delivery')}</dt>
                <dd>{deliveryFee == null ? t('cart.deliveryLater') : formatPrice(deliveryFee, lang)}</dd>
              </div>
            )}
            <div className="totals__grand"><dt>{t('cart.total')}</dt><dd>{formatPrice(total, lang)}</dd></div>
          </dl>
          <button type="button" className="link" onClick={cart.open}>{t('common.edit')}</button>
        </aside>
      </div>
    </div>
  )
}
