import { Bike, ShoppingBag, Wallet, Banknote } from 'lucide-react'
import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { lines, restaurant } from '../config/restaurant'
import { useCart } from '../context/CartContext'
import { useMeta } from '../hooks/useMeta'
import { formatPrice, formatTime, isValidPhone } from '../lib/format'
import { lineLabel } from '../lib/cart'
import { buildOrder, lineById, loadCustomer, orderLink, saveCustomer, saveOrder, type OrderDetails } from '../lib/order'
import './Checkout.css'

function Choice({ name, value, checked, onChange, icon, title, hint }: { name: string; value: string; checked: boolean; onChange: () => void; icon?: ReactNode; title: string; hint: string }) {
  return (
    <label className="choice" data-on={checked || undefined}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="visually-hidden" />
      {icon && <span className="choice__icon" aria-hidden="true">{icon}</span>}
      <span className="choice__title">{title}</span>
      <span className="choice__hint">{hint}</span>
    </label>
  )
}

/** Pickup slots every 15 minutes for the next 6 hours, after the prep lead time. */
function pickupSlots() {
  const start = new Date(Date.now() + restaurant.ordering.pickupLeadMinutes * 60000)
  start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15, 0, 0)
  return Array.from({ length: 24 }, (_, i) => new Date(start.getTime() + i * 15 * 60000))
}

export default function Checkout() {
  useMeta({ title: 'Checkout — Outlaw Sushi Bar', path: '/checkout' })
  const { lines: cart, subtotal, clear } = useCart()
  const navigate = useNavigate()
  const saved = useMemo(loadCustomer, [])
  const slots = useMemo(pickupSlots, [])
  const [d, setD] = useState<OrderDetails>({
    type: restaurant.ordering.delivery ? 'delivery' : 'pickup',
    lineId: saved.lineId ?? lines[0].id,
    name: saved.name ?? '', phone: saved.phone ?? '', pickupTime: 'asap',
    area: saved.area ?? '', address: saved.address ?? '', building: saved.building ?? '',
    notes: '', payment: 'cash',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof OrderDetails, string>>>({})
  const set = <K extends keyof OrderDetails>(k: K, v: OrderDetails[K]) => setD((p) => ({ ...p, [k]: v }))
  const line = lineById(d.lineId)
  const fee = d.type === 'delivery' ? restaurant.ordering.deliveryFee : 0

  if (!cart.length) {
    return (
      <div className="container page-top checkout-empty">
        <h1>Your order is empty.</h1>
        <p className="muted">Add a few dishes from the menu first.</p>
        <Link to="/menu" className="btn btn--ember">Open the menu</Link>
      </div>
    )
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = {}
    if (!d.name.trim()) errs.name = 'Please enter your name.'
    if (!isValidPhone(d.phone)) errs.phone = 'Please enter a phone number we can reach, e.g. 70 123 456.'
    if (d.type === 'delivery' && !d.area.trim()) errs.area = 'Please enter your area.'
    if (d.type === 'delivery' && !d.address.trim()) errs.address = 'Please enter the street and a landmark.'
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    const order = buildOrder({ ...d, name: d.name.trim(), phone: d.phone.trim() }, cart, subtotal)
    saveOrder(order)
    saveCustomer({ name: d.name.trim(), phone: d.phone.trim(), area: d.area, address: d.address, building: d.building, lineId: d.lineId })
    window.open(orderLink(order), '_blank', 'noopener')
    clear()
    navigate(`/order/${order.number}`)
  }

  return (
    <div className="container page-top checkout">
      <header className="checkout__head">
        <Link to="/menu" className="link-arrow">Back to the menu</Link>
        <h1>Checkout</h1>
      </header>

      <form className="checkout__grid" onSubmit={submit} noValidate>
        <div className="checkout__main">
          <section className="step" aria-labelledby="s1">
            <h2 id="s1" className="step__title"><span>1</span>How do you want it?</h2>
            <div className="choices">
              {restaurant.ordering.pickup && <Choice name="type" value="pickup" checked={d.type === 'pickup'} onChange={() => set('type', 'pickup')} icon={<ShoppingBag size={20} />} title="Take away" hint="Collect it from the restaurant" />}
              {restaurant.ordering.delivery && <Choice name="type" value="delivery" checked={d.type === 'delivery'} onChange={() => set('type', 'delivery')} icon={<Bike size={20} />} title="Delivery" hint="We bring it to you" />}
            </div>
          </section>

          <section className="step" aria-labelledby="s2">
            <h2 id="s2" className="step__title"><span>2</span>Send the order to</h2>
            <p className="muted step__lead">Both WhatsApp lines take orders. Pick either one.</p>
            <div className="choices">
              {lines.map((l) => <Choice key={l.id} name="line" value={l.id} checked={d.lineId === l.id} onChange={() => set('lineId', l.id)} title={l.display} hint={`WhatsApp · ${l.label}`} />)}
            </div>
          </section>

          <section className="step" aria-labelledby="s3">
            <h2 id="s3" className="step__title"><span>3</span>Your details</h2>
            <div className="fields">
              <label className="field">
                <span className="field__label">Full name</span>
                <input id="co-name" className="input" autoComplete="name" value={d.name} onChange={(e) => set('name', e.target.value)} aria-invalid={!!errors.name} />
                {errors.name && <span className="field__error">{errors.name}</span>}
              </label>
              <label className="field">
                <span className="field__label">Phone number</span>
                <input id="co-phone" className="input" type="tel" inputMode="tel" autoComplete="tel" value={d.phone} onChange={(e) => set('phone', e.target.value)} aria-invalid={!!errors.phone} placeholder="70 123 456" />
                {errors.phone && <span className="field__error">{errors.phone}</span>}
              </label>
              {d.type === 'pickup' ? (
                <label className="field">
                  <span className="field__label">Pickup time</span>
                  <select id="co-time" className="input" value={d.pickupTime} onChange={(e) => set('pickupTime', e.target.value)}>
                    <option value="asap">As soon as possible</option>
                    {slots.map((s) => <option key={s.toISOString()} value={s.toISOString()}>{formatTime(s)}</option>)}
                  </select>
                  <span className="field__hint">The restaurant confirms the time on WhatsApp.</span>
                </label>
              ) : (
                <>
                  <label className="field">
                    <span className="field__label">Area</span>
                    <input id="co-area" className="input" value={d.area} onChange={(e) => set('area', e.target.value)} aria-invalid={!!errors.area} placeholder="e.g. Mansourieh, Mkalles, Dekwaneh" />
                    {errors.area && <span className="field__error">{errors.area}</span>}
                  </label>
                  <label className="field">
                    <span className="field__label">Street &amp; landmark</span>
                    <input id="co-address" className="input" autoComplete="street-address" value={d.address} onChange={(e) => set('address', e.target.value)} aria-invalid={!!errors.address} />
                    {errors.address && <span className="field__error">{errors.address}</span>}
                  </label>
                  <label className="field fields__wide">
                    <span className="field__label">Building, floor, apartment <span className="field__hint">optional</span></span>
                    <input id="co-building" className="input" value={d.building} onChange={(e) => set('building', e.target.value)} />
                  </label>
                </>
              )}
              <label className="field fields__wide">
                <span className="field__label">Order notes <span className="field__hint">optional</span></span>
                <textarea id="co-notes" className="input" rows={2} value={d.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Chopsticks, extra soy sauce, ring the bell…" />
              </label>
            </div>
          </section>

          <section className="step" aria-labelledby="s4">
            <h2 id="s4" className="step__title"><span>4</span>Payment</h2>
            <div className="choices">
              <Choice name="pay" value="cash" checked={d.payment === 'cash'} onChange={() => set('payment', 'cash')} icon={<Banknote size={20} />} title={d.type === 'delivery' ? 'Cash on delivery' : 'Cash at pickup'} hint="Pay when you get your order" />
              {restaurant.payments.whish && <Choice name="pay" value="whish" checked={d.payment === 'whish'} onChange={() => set('payment', 'whish')} icon={<Wallet size={20} />} title="Whish Money" hint={`Transfer to ${line.display}`} />}
            </div>
            {d.payment === 'whish' && (
              <div className="whish">
                <p>Send <strong className="price">{formatPrice(subtotal + (fee ?? 0))}</strong>{d.type === 'delivery' && fee == null ? ' plus the delivery fee' : ''} by Whish Money to:</p>
                <p className="whish__number">{line.display}</p>
                <p className="muted">That's the same number your order goes to. Put your name in the transfer note. The restaurant checks transfers by hand and confirms on WhatsApp.</p>
              </div>
            )}
          </section>
        </div>

        <aside className="summary" aria-labelledby="sum-title">
          <h2 id="sum-title" className="summary__title">Order summary</h2>
          <ul className="summary__lines">
            {cart.map((l) => (
              <li key={l.key}>
                <span>{l.qty} × {lineLabel(l)}{l.notes && <small>“{l.notes}”</small>}</span>
                <span className="price">{formatPrice(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="summary__totals">
            <div><dt>Subtotal</dt><dd className="price">{formatPrice(subtotal)}</dd></div>
            {d.type === 'delivery' && <div><dt>Delivery</dt><dd>{fee == null ? 'Confirmed on WhatsApp' : formatPrice(fee)}</dd></div>}
            <div className="summary__total"><dt>Total</dt><dd className="price">{formatPrice(subtotal + (fee ?? 0))}</dd></div>
          </dl>
          <button type="submit" className="btn btn--ember btn--lg btn--block">Send order on WhatsApp</button>
          <p className="summary__note">WhatsApp opens with the whole order written out, addressed to {line.display}. It reaches the restaurant when you press send.</p>
        </aside>
      </form>
    </div>
  )
}
