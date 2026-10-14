import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang, fmt } from '../i18n/LanguageProvider'
import { useCart, describeLine, lineTotal } from '../store/cart'
import { findItem } from '../data/menu'
import { restaurant, whatsappLink } from '../config/restaurant'
import { submitOrder, type OrderDetails, type OrderType, type PaymentMethod } from '../services/orders'
import { clock, isOpenNow, lbp, money, normalizeLbPhone, num, pickupSlots } from '../utils/format'
import { storage } from '../utils/storage'
import { usePageMeta } from '../hooks/usePageMeta'
import { FoodImage } from '../components/FoodImage'
import { Icon, type IconName } from '../components/Icon'
import './Checkout.css'

const CUSTOMER = 'kuku.customer'
export const ORDER_TYPE = 'kuku.orderType'

type Errors = Partial<Record<'name' | 'phone' | 'area' | 'address' | 'pickupTime', string>>

export default function Checkout() {
  const { t, l, lang } = useLang()
  usePageMeta(t.checkout.title)
  const navigate = useNavigate()
  const { lines, subtotal, clear } = useCart()
  const openNow = isOpenNow()
  const slots = useMemo(() => pickupSlots(), [])

  const saved = storage.get<Partial<OrderDetails>>(CUSTOMER) ?? {}
  const [form, setForm] = useState<OrderDetails>({
    type: (storage.get<OrderType>(ORDER_TYPE) === 'delivery' ? 'delivery' : 'pickup') as OrderType,
    name: saved.name ?? '',
    phone: saved.phone ?? '',
    pickupTime: openNow ? 'asap' : (slots[0] ?? 'asap'),
    area: saved.area ?? '',
    address: saved.address ?? '',
    building: saved.building ?? '',
    notes: '',
    payment: 'cash',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [copied, setCopied] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const set = <K extends keyof OrderDetails>(k: K, v: OrderDetails[K]) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k as keyof Errors]) setErrors((e) => ({ ...e, [k]: undefined }))
    if (k === 'type') storage.set(ORDER_TYPE, v)
  }

  const fee = form.type === 'delivery' ? restaurant.ordering.deliveryFee : null
  const total = subtotal + (fee ?? 0)
  const approx = lbp(total)

  const validate = (): Errors => {
    const e: Errors = {}
    if (form.name.trim().length < 2) e.name = t.checkout.errors.name
    if (!normalizeLbPhone(form.phone)) e.phone = t.checkout.errors.phone
    if (form.type === 'delivery') {
      if (!form.area.trim()) e.area = t.checkout.errors.area
      if (form.address.trim().length < 4) e.address = t.checkout.errors.address
    } else if (form.pickupTime !== 'asap' && !slots.includes(form.pickupTime)) {
      e.pickupTime = t.checkout.errors.time
    }
    return e
  }

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    const firstBad = Object.keys(e)[0]
    if (firstBad) {
      document.getElementById(`f-${firstBad}`)?.focus()
      return
    }
    setSubmitting(true)
    const phone = normalizeLbPhone(form.phone)!
    // International format drops the leading 0 of 03 numbers: 03123456 -> +961 3 123 456
    const intl = phone.replace(/^0/, '')
    const details = { ...form, phone: `+961 ${intl.replace(/^(\d{1,2})(\d{3})(\d{3})$/, '$1 $2 $3')}`, name: form.name.trim() }
    storage.set(CUSTOMER, { name: details.name, phone: form.phone, area: form.area, address: form.address, building: form.building })
    const order = submitOrder(details, lines)
    // Must run inside the click handler so pop-up blockers allow it.
    // ('noopener' would make window.open return null, so detach the opener manually.)
    const win = window.open(order.whatsappUrl, '_blank')
    if (win) win.opener = null
    else window.location.href = order.whatsappUrl
    clear()
    navigate(`/order/${order.number}`, { replace: true })
  }

  const copyWhish = async () => {
    if (!restaurant.payments.whishNumber) return
    try {
      await navigator.clipboard.writeText(restaurant.payments.whishNumber)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = restaurant.payments.whishNumber
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  if (!lines.length) {
    return (
      <div className="container checkout-empty">
        <Icon name="bag" />
        <h1>{t.checkout.title}</h1>
        <p>{t.checkout.emptyCart}</p>
        <Link to="/menu" className="btn btn--yellow">{t.cart.browse}</Link>
      </div>
    )
  }

  return (
    <div className="checkout">
      <div className="container">
        <Link to="/menu" className="checkout__back">
          <Icon name="back" className="flip-rtl" /> {t.checkout.back}
        </Link>
        <h1 className="checkout__title">{t.checkout.title}</h1>

        <form className="checkout__grid" onSubmit={onSubmit} noValidate>
          <div className="checkout__main">
            <Panel step={1} title={t.checkout.type}>
              <div className="choice-grid" role="radiogroup" aria-label={t.checkout.type}>
                {restaurant.ordering.pickup && (
                  <ChoiceCard name="type" checked={form.type === 'pickup'} onChange={() => set('type', 'pickup')} icon="store" title={t.checkout.pickup} desc={t.checkout.pickupDesc} />
                )}
                {restaurant.ordering.delivery && (
                  <ChoiceCard name="type" checked={form.type === 'delivery'} onChange={() => set('type', 'delivery')} icon="scooter" title={t.checkout.delivery} desc={t.checkout.deliveryDesc} />
                )}
              </div>
              {!openNow && <p className="checkout__note"><Icon name="clock" /> {t.checkout.closedNote}</p>}
            </Panel>

            <Panel step={2} title={t.checkout.details}>
              <div className="form-grid">
                <Field id="name" label={t.checkout.name} error={errors.name} required>
                  <input id="f-name" className="input" autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'e-name' : undefined} />
                </Field>
                <Field id="phone" label={t.checkout.phone} error={errors.phone} required>
                  <input id="f-phone" className="input" type="tel" inputMode="tel" autoComplete="tel" placeholder={t.checkout.phonePh} value={form.phone} onChange={(e) => set('phone', e.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'e-phone' : undefined} />
                </Field>

                <AnimatePresence initial={false} mode="popLayout">
                  {form.type === 'pickup' ? (
                    <motion.div key="pickup" className="form-grid__full" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                      <Field id="pickupTime" label={t.checkout.pickupTime} error={errors.pickupTime} required>
                        <select id="f-pickupTime" className="select" value={form.pickupTime} onChange={(e) => set('pickupTime', e.target.value)}>
                          {openNow && <option value="asap">{t.checkout.asap}</option>}
                          {slots.map((s) => (
                            <option key={s} value={s}>{clock(s, lang)}</option>
                          ))}
                        </select>
                      </Field>
                    </motion.div>
                  ) : (
                    <motion.div key="delivery" className="form-grid form-grid__full" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                      <Field id="area" label={t.checkout.area} error={errors.area} required>
                        <input id="f-area" className="input" autoComplete="address-level2" placeholder={t.checkout.areaPh} value={form.area} onChange={(e) => set('area', e.target.value)} aria-invalid={!!errors.area} aria-describedby={errors.area ? 'e-area' : undefined} />
                      </Field>
                      <Field id="building" label={t.checkout.building}>
                        <input id="f-building" className="input" autoComplete="address-line2" value={form.building} onChange={(e) => set('building', e.target.value)} />
                      </Field>
                      <Field id="address" label={t.checkout.address} error={errors.address} required full>
                        <input id="f-address" className="input" autoComplete="street-address" value={form.address} onChange={(e) => set('address', e.target.value)} aria-invalid={!!errors.address} aria-describedby={errors.address ? 'e-address' : undefined} />
                      </Field>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Field id="notes" label={t.checkout.notes} full>
                  <textarea id="f-notes" className="textarea" rows={3} maxLength={300} placeholder={form.type === 'pickup' ? t.checkout.notesPhPickup : t.checkout.notesPhDelivery} value={form.notes} onChange={(e) => set('notes', e.target.value)} />
                </Field>
              </div>
            </Panel>

            <Panel step={3} title={t.checkout.payment}>
              <div className="choice-grid" role="radiogroup" aria-label={t.checkout.payment}>
                <ChoiceCard name="payment" checked={form.payment === 'cash'} onChange={() => set('payment', 'cash' as PaymentMethod)} icon="cash" title={form.type === 'pickup' ? t.checkout.cashPickup : t.checkout.cashDelivery} desc={t.checkout.cashDesc} />
                <ChoiceCard name="payment" checked={form.payment === 'whish'} onChange={() => set('payment', 'whish' as PaymentMethod)} icon="wallet" title={t.checkout.whish} desc={t.checkout.whishDesc} />
              </div>
              <AnimatePresence initial={false}>
                {form.payment === 'whish' && (
                  <motion.div className="whish" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <div className="whish__inner">
                      {restaurant.payments.whishNumber ? (
                        <>
                          <p>{t.checkout.whishSteps}</p>
                          <div className="whish__card">
                            <div>
                              <span className="whish__label">{t.checkout.whishNumber}</span>
                              <strong dir="ltr">{restaurant.payments.whishNumber}</strong>
                              <span className="whish__label">{t.checkout.whishName}: {restaurant.payments.whishAccountName}</span>
                            </div>
                            <button type="button" className="btn btn--sm" onClick={copyWhish}>
                              <Icon name={copied ? 'check' : 'copy'} /> {copied ? t.checkout.copied : t.checkout.copy}
                            </button>
                          </div>
                          <p className="whish__amount">{t.cart.total}: <span className="price">{money(total)}</span></p>
                        </>
                      ) : (
                        <>
                          <p>{t.checkout.whishMissing}</p>
                          <a className="btn btn--wa btn--sm" href={whatsappLink('Hi, can you send me your Whish number?')} target="_blank" rel="noreferrer">
                            <Icon name="whatsapp" /> {t.contact.whatsapp}
                          </a>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Panel>
          </div>

          <aside className="checkout__summary" aria-labelledby="summary-title">
            <h2 id="summary-title">{t.checkout.summary}</h2>
            <ul className="summary-lines">
              {lines.map((line) => {
                const item = findItem(line.itemId)!
                const opts = describeLine(line, lang)
                return (
                  <li key={line.key}>
                    <FoodImage image={item.image} alt="" className="summary-lines__img" sizes="56px" />
                    <div>
                      <p className="summary-lines__name"><span>{num(line.qty, lang)}×</span> {item.name}</p>
                      {opts.length > 0 && <p className="summary-lines__meta">{opts.join(' · ')}</p>}
                      {line.removed.length > 0 && (
                        <p className="summary-lines__meta">{t.cart.without}: {line.removed.map((en) => item.removable?.find((r) => r.en === en)?.[lang] ?? en).join(', ')}</p>
                      )}
                    </div>
                    <span className="price">{money(lineTotal(line))}</span>
                  </li>
                )
              })}
            </ul>
            <dl className="totals">
              <div>
                <dt>{t.cart.subtotal}</dt>
                <dd className="price">{money(subtotal)}</dd>
              </div>
              {form.type === 'delivery' && (
                <div className="totals__muted">
                  <dt>{t.cart.delivery}</dt>
                  <dd>{fee != null ? money(fee) : t.cart.deliveryTbd}</dd>
                </div>
              )}
              <div className="totals__grand">
                <dt>{t.cart.total}</dt>
                <dd className="price">{money(total)}</dd>
              </div>
              {approx && <p className="totals__lbp">{fmt(t.cart.approxLbp, { v: approx, r: num(restaurant.payments.lbpRate!, lang) })}</p>}
            </dl>
            {Object.values(errors).some(Boolean) && <p className="field-error" role="alert">{t.checkout.errors.fix}</p>}
            <button type="submit" className="btn btn--wa btn--block checkout__submit" disabled={submitting}>
              <Icon name="whatsapp" /> {t.checkout.place}
            </button>
            <p className="checkout__hint">{t.checkout.placeHint}</p>
            <p className="checkout__where">
              <Icon name="pin" /> {restaurant.name} · {l(restaurant.address)}
            </p>
          </aside>
        </form>
      </div>
    </div>
  )
}

function Panel({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  const { lang } = useLang()
  return (
    <section className="panel">
      <h2 className="panel__title">
        <span aria-hidden="true">{num(step, lang)}</span>
        {title}
      </h2>
      {children}
    </section>
  )
}

function ChoiceCard({ name, checked, onChange, icon, title, desc }: { name: string; checked: boolean; onChange: () => void; icon: IconName; title: string; desc: string }) {
  return (
    <label className={`choice ${checked ? 'is-on' : ''}`}>
      <input type="radio" name={name} checked={checked} onChange={onChange} />
      <span className="choice__icon"><Icon name={icon} /></span>
      <span className="choice__text">
        <strong>{title}</strong>
        <span>{desc}</span>
      </span>
      <span className="choice__tick" aria-hidden="true"><Icon name="check" /></span>
    </label>
  )
}

function Field({ id, label, error, required, full, children }: { id: string; label: string; error?: string; required?: boolean; full?: boolean; children: ReactNode }) {
  return (
    <div className={`field ${full ? 'form-grid__full' : ''}`} data-invalid={!!error}>
      <label htmlFor={`f-${id}`}>
        {label}
        {required && <span className="req" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && <span className="field-error" id={`e-${id}`}>{error}</span>}
    </div>
  )
}
