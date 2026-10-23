import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { restaurant, whatsappLink } from '../config/restaurant'
import { useCart } from '../context/CartContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { useOpenStatus } from '../hooks/useOpenStatus'
import { formatPrice, formatTotals } from '../lib/format'
import { openingLabel, pickupSlots } from '../lib/hours'
import { createOrderNumber, describeLine, orderToMessage, paymentLabel, submitOrder } from '../lib/order'
import { load, save } from '../lib/storage'
import { isValidPhone } from '../lib/validate'
import CartTotals from '../components/CartTotals'
import CopyButton from '../components/CopyButton'
import Field from '../components/Field'
import { CashIcon, StoreIcon, TruckIcon, WalletIcon } from '../components/Icons'

const CUSTOMER_KEY = 'almanqal.customer.v1'
export const ORDERS_KEY = 'almanqal.orders.v1'

const blankCustomer = { name: '', phone: '', area: '', address: '', building: '', pickupTime: 'asap', notes: '' }

export default function Checkout() {
  usePageMeta('إتمام الطلب')
  const cart = useCart()
  const navigate = useNavigate()
  const open = useOpenStatus()
  const { ordering, payment } = restaurant

  const remembered = useMemo(() => load(CUSTOMER_KEY, {}), [])
  const [type, setType] = useState(remembered.type && ordering[remembered.type] ? remembered.type : ordering.delivery ? 'delivery' : 'pickup')
  const [method, setMethod] = useState('cash')
  const [customer, setCustomer] = useState({ ...blankCustomer, ...remembered.customer, pickupTime: 'asap', notes: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const { slots, nextSession } = useMemo(() => pickupSlots(), [])

  const set = (key) => (e) => setCustomer((c) => ({ ...c, [key]: e.target.value }))
  const whish = payment.whish

  if (!cart.lines.length) {
    return (
      <div className="container checkout-empty">
        <h1 className="page-title page-title--dark">السلة فاضية</h1>
        <p className="muted">زيد أصناف من المنيو لتكمّل الطلب.</p>
        <Link to="/menu" className="btn btn--primary">
          تصفّح المنيو
        </Link>
      </div>
    )
  }

  const validate = () => {
    const e = {}
    if (customer.name.trim().length < 2) e.name = 'اكتب اسمك'
    if (!customer.phone.trim()) e.phone = 'اكتب رقم هاتفك'
    else if (!isValidPhone(customer.phone)) e.phone = 'الرقم مش صحيح — مثلاً 03 123 456'
    if (type === 'delivery') {
      if (!customer.area.trim()) e.area = 'اختار أو اكتب المنطقة'
      if (customer.address.trim().length < 4) e.address = 'اكتب العنوان بالتفصيل (شارع، علامة مميزة…)'
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
      totals: cart.totals,
      deliveryFee: type === 'delivery' ? ordering.deliveryFee : null,
    }

    // Open WhatsApp synchronously, inside the click, so popup blockers allow it.
    const usesWhatsApp = !ordering.orderEndpoint
    const waUrl = whatsappLink(orderToMessage(order))
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
      setSubmitError('صار في مشكلة بإرسال الطلب. جرّب كمان مرة، أو ابعت الطلب عالواتساب.')
    }
  }

  return (
    <div className="checkout-page">
      <header className="page-hero page-hero--compact">
        <div className="container">
          <h1 className="page-title">إتمام الطلب</h1>
        </div>
      </header>

      <form className="container checkout" onSubmit={placeOrder} noValidate>
        <div className="checkout__main">
          {!open && (
            <p className="notice" role="note">
              نحنا مسكّرين هلّق. فيك تبعت طلبك، ومنبلّش نحضّره لما نفتح الساعة {openingLabel}.
            </p>
          )}

          <section className="checkout-step" aria-labelledby="step-type">
            <h2 id="step-type" className="checkout-step__title">
              <span className="checkout-step__num">1</span>
              كيف بدك طلبك؟
            </h2>
            <div className="segmented" role="radiogroup" aria-labelledby="step-type">
              {ordering.delivery && (
                <label className={`segmented__option ${type === 'delivery' ? 'is-active' : ''}`}>
                  <input type="radio" name="type" value="delivery" checked={type === 'delivery'} onChange={() => setType('delivery')} />
                  <TruckIcon />
                  <span>
                    <strong>توصيل</strong>
                    <small>لعندك عالبيت</small>
                  </span>
                </label>
              )}
              {ordering.pickup && (
                <label className={`segmented__option ${type === 'pickup' ? 'is-active' : ''}`}>
                  <input type="radio" name="type" value="pickup" checked={type === 'pickup'} onChange={() => setType('pickup')} />
                  <StoreIcon />
                  <span>
                    <strong>استلام</strong>
                    <small>بتمرق بتاخده من المحل</small>
                  </span>
                </label>
              )}
            </div>
          </section>

          <section className="checkout-step" aria-labelledby="step-details">
            <h2 id="step-details" className="checkout-step__title">
              <span className="checkout-step__num">2</span>
              معلوماتك
            </h2>
            <div className="form-grid">
              <Field label="الاسم" error={errors.name}>
                <input className="input" value={customer.name} onChange={set('name')} autoComplete="name" maxLength={60} />
              </Field>
              <Field label="رقم الهاتف" error={errors.phone} hint="منتصل فيك على هالرقم إذا احتجنا">
                <input
                  className="input"
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
                  <Field label="المنطقة" error={errors.area}>
                    {ordering.deliveryAreas.length ? (
                      <select className="input" value={customer.area} onChange={set('area')}>
                        <option value="">اختار المنطقة</option>
                        {ordering.deliveryAreas.map((a) => (
                          <option key={a}>{a}</option>
                        ))}
                      </select>
                    ) : (
                      <input className="input" value={customer.area} onChange={set('area')} autoComplete="address-level2" maxLength={60} />
                    )}
                  </Field>
                  <Field label="البناية / الطابق / الشقة" optional>
                    <input className="input" value={customer.building} onChange={set('building')} maxLength={80} />
                  </Field>
                  <Field label="العنوان" error={errors.address} className="form-grid__wide" hint="الشارع وأقرب علامة مميزة">
                    <input className="input" value={customer.address} onChange={set('address')} autoComplete="street-address" maxLength={160} />
                  </Field>
                  <Field label="ملاحظات للتوصيل" optional className="form-grid__wide">
                    <textarea className="input" rows={2} value={customer.notes} onChange={set('notes')} maxLength={300} />
                  </Field>
                </>
              ) : (
                <>
                  <Field label="وقت الاستلام" hint={nextSession ? `أول وقت متاح بعد ما نفتح الساعة ${openingLabel}` : undefined}>
                    <select className="input" value={customer.pickupTime} onChange={set('pickupTime')}>
                      <option value="asap">{open ? 'بأقرب وقت' : 'أول ما تفتحوا'}</option>
                      {slots.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="ملاحظات على الطلب" optional className="form-grid__wide">
                    <textarea className="input" rows={2} value={customer.notes} onChange={set('notes')} maxLength={300} />
                  </Field>
                </>
              )}
            </div>
          </section>

          <section className="checkout-step" aria-labelledby="step-pay">
            <h2 id="step-pay" className="checkout-step__title">
              <span className="checkout-step__num">3</span>
              الدفع
            </h2>
            <div className="pay-options" role="radiogroup" aria-labelledby="step-pay">
              {payment.cash && (
                <label className={`pay-option ${method === 'cash' ? 'is-active' : ''}`}>
                  <input type="radio" name="payment" value="cash" checked={method === 'cash'} onChange={() => setMethod('cash')} />
                  <CashIcon />
                  <span>
                    <strong>{paymentLabel('cash', type)}</strong>
                    <small>{type === 'delivery' ? 'بتدفع للدليفري لما يوصل الطلب' : 'بتدفع بالمحل وقت بتستلم'}</small>
                  </span>
                </label>
              )}
              {whish.enabled && (
                <label className={`pay-option ${method === 'whish' ? 'is-active' : ''}`}>
                  <input type="radio" name="payment" value="whish" checked={method === 'whish'} onChange={() => setMethod('whish')} />
                  <WalletIcon />
                  <span>
                    <strong>Whish Money</strong>
                    <small>تحويل من تطبيق Whish</small>
                  </span>
                </label>
              )}
            </div>

            {method === 'whish' && (
              <div className="whish-panel">
                {whish.number ? (
                  <>
                    <p className="whish-panel__label">حوّل المبلغ على رقم Whish:</p>
                    <div className="whish-panel__number">
                      <span dir="ltr">{whish.number}</span>
                      <CopyButton value={whish.number.replace(/\s/g, '')} label="نسخ الرقم" />
                    </div>
                    {whish.accountName && <p className="whish-panel__name">باسم: {whish.accountName}</p>}
                  </>
                ) : (
                  <p className="whish-panel__label">منبعتلك رقم Whish تبعنا عالواتساب لما نأكّد الطلب.</p>
                )}
                <ol className="whish-panel__steps">
                  <li>حوّل المجموع من تطبيق Whish.</li>
                  <li>ابعت صورة إيصال التحويل بنفس محادثة الواتساب يلي فيها الطلب.</li>
                  <li>منتأكد من التحويل بإيدنا ومنأكدلك الطلب.</li>
                </ol>
              </div>
            )}
          </section>
        </div>

        <aside className="checkout__summary" aria-labelledby="summary-title">
          <div className="summary">
            <h2 id="summary-title" className="summary__title">
              طلبك
              <Link to="/menu" className="text-btn">
                تعديل
              </Link>
            </h2>
            <ul className="summary__lines">
              {cart.lines.map((line) => (
                <li key={line.key}>
                  <span className="summary__qty">{line.quantity}×</span>
                  <span className="summary__name">
                    {line.name}
                    {describeLine(line).map((d) => (
                      <small key={d}>{d}</small>
                    ))}
                  </span>
                  <span className="summary__price">{formatPrice({ amount: line.unitPrice * line.quantity, currency: line.currency })}</span>
                </li>
              ))}
            </ul>
            <CartTotals totals={cart.totals} type={type} />

            {submitError && (
              <div className="form-error" role="alert">
                {submitError}{' '}
                <a href={whatsappLink(`مرحبا، بدي اطلب:\n${cart.lines.map((l) => `${l.quantity} × ${l.name}`).join('\n')}`)} target="_blank" rel="noopener noreferrer">
                  واتساب
                </a>
              </div>
            )}

            <button type="submit" className="btn btn--primary btn--block btn--large summary__submit" disabled={submitting}>
              {submitting ? 'عم نبعت الطلب…' : ordering.orderEndpoint ? 'أكّد الطلب' : 'أكّد وابعت الطلب عالواتساب'}
              {!submitting && <span className="btn__meta">{formatTotals(cart.totals)}</span>}
            </button>
            {!ordering.orderEndpoint && <p className="summary__hint">بينفتح واتساب ومعه رسالة الطلب جاهزة، بس اكبس إرسال.</p>}
          </div>
        </aside>
      </form>
    </div>
  )
}
