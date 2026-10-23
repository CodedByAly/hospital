import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { restaurant, whatsappLink } from '../config/restaurant'
import { useCart } from '../context/CartContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { useOpenStatus } from '../hooks/useOpenStatus'
import { useLang } from '../i18n/LanguageContext'
import { formatPrice } from '../lib/format'
import { openingLabel, pickupSlots } from '../lib/hours'
import { createOrderNumber, describeLine, orderToMessage, paymentLabel, submitOrder } from '../lib/order'
import { load, save } from '../lib/storage'
import { isValidPhone } from '../lib/validate'
import CartTotals from '../components/CartTotals'
import CopyButton from '../components/CopyButton'
import Field from '../components/Field'
import { CashIcon, StoreIcon, TruckIcon, WalletIcon } from '../components/Icons'

const CUSTOMER_KEY = 'laffet.customer.v1'
export const ORDERS_KEY = 'laffet.orders.v1'

const blankCustomer = { name: '', phone: '', area: '', address: '', building: '', pickupTime: 'asap', notes: '' }

export default function Checkout() {
  const lang = useLang()
  const { t, pick } = lang
  usePageMeta(t('checkout.title'))
  const cart = useCart()
  const navigate = useNavigate()
  const open = useOpenStatus()
  const { ordering, payment } = restaurant

  const remembered = useMemo(() => load(CUSTOMER_KEY, {}), [])
  const [type, setType] = useState(remembered.type && ordering[remembered.type] ? remembered.type : ordering.pickup ? 'pickup' : 'delivery')
  const [method, setMethod] = useState('cash')
  const [customer, setCustomer] = useState({ ...blankCustomer, ...remembered.customer, pickupTime: 'asap', notes: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const { slots, nextSession } = useMemo(() => pickupSlots(lang.lang), [lang.lang])

  const set = (key) => (e) => setCustomer((c) => ({ ...c, [key]: e.target.value }))
  const whish = payment.whish

  if (!cart.lines.length) {
    return (
      <div className="container checkout-empty">
        <h1 className="page-title page-title--dark">{t('checkout.emptyTitle')}</h1>
        <p className="muted">{t('checkout.emptyHint')}</p>
        <Link to="/menu" className="btn btn--primary">
          {t('cart.browse')}
        </Link>
      </div>
    )
  }

  const validate = () => {
    const e = {}
    if (customer.name.trim().length < 2) e.name = t('checkout.errName')
    if (!customer.phone.trim()) e.phone = t('checkout.errPhone')
    else if (!isValidPhone(customer.phone)) e.phone = t('checkout.errPhoneFormat')
    if (type === 'delivery') {
      if (!customer.area.trim()) e.area = t('checkout.errArea')
      if (customer.address.trim().length < 4) e.address = t('checkout.errAddress')
    }
    return e
  }

  const placeOrder = async (event) => {
    event.preventDefault()
    const e = validate()
    setErrors(e)
    setSubmitError('')
    if (Object.keys(e).length) {
      const firstInvalid = event.currentTarget.querySelector('[aria-invalid="true"]')
      firstInvalid?.focus()
      firstInvalid?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      return
    }

    const order = {
      number: createOrderNumber(),
      createdAt: new Date().toISOString(),
      lang: lang.lang,
      type,
      payment: method,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        ...(type === 'delivery'
          ? { area: customer.area.trim(), address: customer.address.trim(), building: customer.building.trim() }
          : { pickupTime: customer.pickupTime }),
        notes: customer.notes.trim(),
      },
      lines: cart.lines.map(({ key, image, ...line }) => line),
      total: cart.total,
      deliveryFee: type === 'delivery' ? ordering.deliveryFee : null,
    }

    // Open WhatsApp synchronously, inside the click, so popup blockers allow it.
    const usesWhatsApp = !ordering.orderEndpoint
    const waUrl = whatsappLink(orderToMessage(order, lang))
    if (usesWhatsApp) window.open(waUrl, '_blank', 'noopener')

    setSubmitting(true)
    try {
      const { channel } = await submitOrder(order)
      const saved = { ...order, channel, whatsappUrl: waUrl }
      save(ORDERS_KEY, [saved, ...load(ORDERS_KEY, [])].slice(0, 10))
      save(CUSTOMER_KEY, {
        type,
        customer: { name: order.customer.name, phone: order.customer.phone, area: customer.area, address: customer.address, building: customer.building },
      })
      cart.clear()
      navigate(`/order/${order.number}`, { replace: true })
    } catch {
      setSubmitting(false)
      setSubmitError(t('checkout.error'))
    }
  }

  const fallbackWa = whatsappLink(`${t('checkout.waFallback')}\n${cart.lines.map((l) => `${l.quantity} × ${pick(l.name)}`).join('\n')}`)

  return (
    <div className="checkout-page">
      <header className="page-hero page-hero--compact">
        <div className="container">
          <h1 className="page-title">{t('checkout.title')}</h1>
        </div>
      </header>

      <form className="container checkout" onSubmit={placeOrder} noValidate>
        <div className="checkout__main">
          {!open && (
            <p className="notice" role="note">
              {t('checkout.closed', { time: openingLabel(lang.lang) })}
            </p>
          )}

          <section className="checkout-step" aria-labelledby="step-type">
            <h2 id="step-type" className="checkout-step__title">
              <span className="checkout-step__num">1</span>
              {t('checkout.step1')}
            </h2>
            <div className="segmented" role="radiogroup" aria-labelledby="step-type">
              {ordering.pickup && (
                <label className={`segmented__option ${type === 'pickup' ? 'is-active' : ''}`}>
                  <input type="radio" name="type" value="pickup" checked={type === 'pickup'} onChange={() => setType('pickup')} />
                  <StoreIcon />
                  <span>
                    <strong>{t('checkout.pickup')}</strong>
                    <small>{t('checkout.pickupHint')}</small>
                  </span>
                </label>
              )}
              {ordering.delivery && (
                <label className={`segmented__option ${type === 'delivery' ? 'is-active' : ''}`}>
                  <input type="radio" name="type" value="delivery" checked={type === 'delivery'} onChange={() => setType('delivery')} />
                  <TruckIcon />
                  <span>
                    <strong>{t('checkout.delivery')}</strong>
                    <small>{t('checkout.deliveryHint')}</small>
                  </span>
                </label>
              )}
            </div>
          </section>

          <section className="checkout-step" aria-labelledby="step-details">
            <h2 id="step-details" className="checkout-step__title">
              <span className="checkout-step__num">2</span>
              {t('checkout.step2')}
            </h2>
            <div className="form-grid">
              <Field label={t('checkout.name')} error={errors.name}>
                <input className="input" value={customer.name} onChange={set('name')} autoComplete="name" maxLength={60} />
              </Field>
              <Field label={t('checkout.phone')} error={errors.phone} hint={t('checkout.phoneHint')}>
                <input
                  className="input input--ltr"
                  type="tel"
                  dir="ltr"
                  value={customer.phone}
                  onChange={set('phone')}
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="03 123 456"
                  maxLength={20}
                />
              </Field>

              {type === 'delivery' ? (
                <>
                  <Field label={t('checkout.area')} error={errors.area}>
                    {ordering.deliveryAreas.length ? (
                      <select className="input" value={customer.area} onChange={set('area')}>
                        <option value="">{t('checkout.areaPick')}</option>
                        {ordering.deliveryAreas.map((a) => (
                          <option key={a.en} value={pick(a)}>
                            {pick(a)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input className="input" value={customer.area} onChange={set('area')} autoComplete="address-level2" maxLength={60} />
                    )}
                  </Field>
                  <Field label={t('checkout.building')} optional>
                    <input className="input" value={customer.building} onChange={set('building')} maxLength={80} />
                  </Field>
                  <Field label={t('checkout.address')} error={errors.address} className="form-grid__wide" hint={t('checkout.addressHint')}>
                    <input className="input" value={customer.address} onChange={set('address')} autoComplete="street-address" maxLength={160} />
                  </Field>
                  <Field label={t('checkout.deliveryNotes')} optional className="form-grid__wide">
                    <textarea className="input" rows={2} value={customer.notes} onChange={set('notes')} maxLength={300} />
                  </Field>
                </>
              ) : (
                <>
                  <Field label={t('checkout.pickupTime')} hint={nextSession ? t('checkout.pickupNext', { time: openingLabel(lang.lang) }) : undefined}>
                    <select className="input" value={customer.pickupTime} onChange={set('pickupTime')}>
                      <option value="asap">{open ? t('checkout.asap') : t('checkout.whenOpen')}</option>
                      {slots.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label={t('checkout.orderNotes')} optional className="form-grid__wide">
                    <textarea className="input" rows={2} value={customer.notes} onChange={set('notes')} maxLength={300} />
                  </Field>
                </>
              )}
            </div>
          </section>

          <section className="checkout-step" aria-labelledby="step-pay">
            <h2 id="step-pay" className="checkout-step__title">
              <span className="checkout-step__num">3</span>
              {t('checkout.step3')}
            </h2>
            <div className="pay-options" role="radiogroup" aria-labelledby="step-pay">
              {payment.cash && (
                <label className={`pay-option ${method === 'cash' ? 'is-active' : ''}`}>
                  <input type="radio" name="payment" value="cash" checked={method === 'cash'} onChange={() => setMethod('cash')} />
                  <CashIcon />
                  <span>
                    <strong>{paymentLabel('cash', type, t)}</strong>
                    <small>{t(type === 'delivery' ? 'checkout.cashDeliveryHint' : 'checkout.cashPickupHint')}</small>
                  </span>
                </label>
              )}
              {whish.enabled && (
                <label className={`pay-option ${method === 'whish' ? 'is-active' : ''}`}>
                  <input type="radio" name="payment" value="whish" checked={method === 'whish'} onChange={() => setMethod('whish')} />
                  <WalletIcon />
                  <span>
                    <strong>{t('checkout.whish')}</strong>
                    <small>{t('checkout.whishHint')}</small>
                  </span>
                </label>
              )}
            </div>

            {method === 'whish' && (
              <div className="whish-panel">
                {whish.number ? (
                  <>
                    <p className="whish-panel__label">{t('checkout.whishTo')}</p>
                    <div className="whish-panel__number">
                      <span dir="ltr">{whish.number}</span>
                      <CopyButton value={whish.number.replace(/\s/g, '')} label={t('checkout.copyNumber')} />
                    </div>
                    {whish.accountName && <p className="whish-panel__name">{t('checkout.whishName', { name: whish.accountName })}</p>}
                  </>
                ) : (
                  <p className="whish-panel__label">{t('checkout.whishLater')}</p>
                )}
                <ol className="whish-panel__steps">
                  <li>{t('checkout.whishStep1')}</li>
                  <li>{t('checkout.whishStep2')}</li>
                  <li>{t('checkout.whishStep3')}</li>
                </ol>
              </div>
            )}
          </section>
        </div>

        <aside className="checkout__summary" aria-labelledby="summary-title">
          <div className="summary">
            <h2 id="summary-title" className="summary__title">
              {t('checkout.summary')}
              <Link to="/menu" className="text-btn">
                {t('checkout.edit')}
              </Link>
            </h2>
            <SummaryLines lines={cart.lines} />
            <CartTotals total={cart.total} type={type} />

            {submitError && (
              <div className="form-error" role="alert">
                {submitError}{' '}
                <a href={fallbackWa} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </div>
            )}

            <button type="submit" className="btn btn--primary btn--block btn--large summary__submit" disabled={submitting}>
              {submitting ? t('checkout.submitting') : ordering.orderEndpoint ? t('checkout.submit') : t('checkout.submitWa')}
              {!submitting && <span className="btn__meta">{formatPrice(cart.total, lang.lang)}</span>}
            </button>
            {!ordering.orderEndpoint && <p className="summary__hint">{t('checkout.waHint')}</p>}
          </div>
        </aside>
      </form>
    </div>
  )
}

export function SummaryLines({ lines }) {
  const { t, pick, lang } = useLang()
  return (
    <ul className="summary__lines">
      {lines.map((line, i) => (
        <li key={line.key ?? i}>
          <span className="summary__qty">{line.quantity}×</span>
          <span className="summary__name">
            {pick(line.name)}
            {line.size && <small>{pick(line.size)}</small>}
            {describeLine(line, t, pick).map((d) => (
              <small key={d}>{d}</small>
            ))}
          </span>
          <span className="summary__price">{formatPrice(line.unitPrice * line.quantity, lang)}</span>
        </li>
      ))}
    </ul>
  )
}
